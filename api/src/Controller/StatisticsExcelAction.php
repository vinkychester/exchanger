<?php

namespace App\Controller;


use App\Entity\Pair;
use App\Entity\Requisition;
use App\Entity\RequisitionFeeHistory;
use App\Entity\RequisitionProfitHistory;
use DateTime;
use DateTimeZone;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Exception;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;


/**
 * Class StatisticsExcelAction
 * @package App\Controller
 */
class StatisticsExcelAction extends AbstractController
{


    /**
     * @param Request $request
     * @return mixed
     * @throws Exception
     */
    public function __invoke(Request $request)
    {
        $args = $request->query->all();

        $requisitions = $this->getDoctrine()->getRepository(Requisition::class)->getQueryBuilderRequisitionsByAdminForStatistics($args)->getQuery(
        )->getResult();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $columnNames = [
            'Id',
            'Клиент',
            'Тип',
            'Вход',
            'Входящая платежная система',
            'Выход',
            'Выходящая платежная система',
            'Статус',
            'Дата создания',
            'Дата выполнения',
            'Входящая сумма',
            'Входящая сумма (USDT)',
            'Входящий процент',
            'Входящая константа',
            'Входящая комиссия',
            'Входящая комиссия (USDT)',
            'Входящая сумма с комиссией',
            'Входящая сумма с комиссией (USDT)',
            'Выходящая сумма',
            'Выходящая сумма (USDT)',
            'Выходящий процент',
            'Выходящая константа',
            'Выходящая комиссия',
            'Выходящая комиссия (USDT)',
            'Выходящая сумма с комиссией',
            'Выходящая сумма с комиссией (USDT)',
            'Курс(курс биржи)',
            'Курс(курс биржи) (USDT)',
            'Процент пары',
            'Себестоимость покупки',
            'Себестоимость продажи',
            'Курс(отдаем)',
            'Курс(получаем)',
            'Прибыль заявки',
            'Прибыль реферала 1 уровня',
            'Прибыль реферала 2 уровня',
            'Прибыль системы'
        ];
        $columnLetter = 'A';
        foreach ($columnNames as $columnName) {
            $sheet->setCellValue($columnLetter . '1', $columnName);
            $columnLetter++;
        }

        $i = 3;
        foreach ($requisitions as $val) {
            $columnLetter = 'A';
            $sheet->setCellValue($columnLetter . $i, mb_substr($val->getId(),0,8));
            $sheet->setCellValue(++$columnLetter . $i, $val->getClient()->getEmail());
            if($val->getPair()->getPayment()->getCurrency()->getTag() == "CRYPTO"){
                $sheet->setCellValue(++$columnLetter . $i, "продажа");
            }
            else{
                $sheet->setCellValue(++$columnLetter . $i, "покупка");
            }
            $sheet->setCellValue(++$columnLetter . $i, $val->getPair()->getPayment()->getCurrency()->getAsset());
            $sheet->setCellValue(++$columnLetter . $i, $val->getPair()->getPayment()->getPaymentSystem()->getName());
            $sheet->setCellValue(++$columnLetter . $i, $val->getPair()->getPayout()->getCurrency()->getAsset());
            $sheet->setCellValue(++$columnLetter . $i, $val->getPair()->getPayout()->getPaymentSystem()->getName());
            $sheet->setCellValue(++$columnLetter . $i, $val->getStatus());
            $date = new DateTime();
            $date->setTimezone(new DateTimeZone('Europe/Kiev'));
            $date->setTimestamp($val->getCreatedAt());
            $sheet->setCellValue(++$columnLetter . $i, $date->format('Y-m-d H:i:s'));
            $date->setTimestamp($val->getEndDate());
            $sheet->setCellValue(++$columnLetter . $i, $date->format('Y-m-d H:i:s'));
            //Входящая сумма
            $sheet->setCellValue(++$columnLetter . $i, round($val->getPaymentAmount(),2));
            $requisitionFeeHistoryPayment = $this->getDoctrine()->getRepository(RequisitionFeeHistory::class)
                ->getQueryBuilderRateForStatistics($val->getId(), 'payment')
                ->getQuery()->getResult();
            $ratePayment = $requisitionFeeHistoryPayment[0]['rate'];
            $percentPayment = $requisitionFeeHistoryPayment[0]['percent'];
            $constantPayment = $requisitionFeeHistoryPayment[0]['constant'];
            //Входящая сумма USDT
            if ($val->getPair()->getPayment()->getCurrency()->getTag() == "CRYPTO") {
                $sheet->setCellValue(++$columnLetter . $i, round($val->getPaymentAmount() * $ratePayment,2));
            } else {
                $sheet->setCellValue(++$columnLetter . $i, round($val->getPaymentAmount() / $ratePayment,2));
            }
            $sheet->setCellValue(++$columnLetter . $i, $percentPayment);
            $sheet->setCellValue(++$columnLetter . $i, $constantPayment);
            $inFee = $percentPayment / 100 * $val->getPaymentAmount() + $constantPayment;
            $sheet->setCellValue(++$columnLetter . $i, round($inFee,2));
            // Входящая комиссия USDT
            if ($val->getPair()->getPayment()->getCurrency()->getTag() == "CRYPTO") {
                $sheet->setCellValue(++$columnLetter . $i, round($inFee * $ratePayment,2));
            } else {
                $sheet->setCellValue(++$columnLetter . $i, round($inFee / $ratePayment,2));
            }
            $sumInWithFee = $val->getPaymentAmount() - $inFee;
            $sheet->setCellValue(++$columnLetter . $i, round($sumInWithFee,2));
            // Входящая cумма с комиссией USDT
            if ($val->getPair()->getPayment()->getCurrency()->getTag() == "CRYPTO") {
                $sheet->setCellValue(++$columnLetter . $i, round($sumInWithFee * $ratePayment,2));
            } else {
                $sheet->setCellValue(++$columnLetter . $i, round($sumInWithFee / $ratePayment,2));
            }
            $sheet->setCellValue(++$columnLetter . $i, round($val->getPayoutAmount(),2));
            $requisitionFeeHistoryPayout = $this->getDoctrine()->getRepository(RequisitionFeeHistory::class)
                ->getQueryBuilderRateForStatistics($val->getId(), 'payout')
                ->getQuery()->getResult();
            $ratePayout = $requisitionFeeHistoryPayout[0]['rate'];
            $percentPayout = $requisitionFeeHistoryPayout[0]['percent'];
            $constantPayout = $requisitionFeeHistoryPayout[0]['constant'];
            if ($val->getPair()->getPayout()->getCurrency()->getTag() == "CRYPTO") {
                $sheet->setCellValue(++$columnLetter . $i, round($val->getPayoutAmount() * $ratePayout,2));
            } else {
                $sheet->setCellValue(++$columnLetter . $i, round($val->getPayoutAmount() / $ratePayout,2));
            }
            $sheet->setCellValue(++$columnLetter . $i, $percentPayout);
            $sheet->setCellValue(++$columnLetter . $i, $constantPayout);
            $outFee = $percentPayout / 100 * $val->getPayoutAmount() + $constantPayout;
            // Выходящая комиссия
            $sheet->setCellValue(++$columnLetter . $i, round($outFee,2));
            // Выходящая комиссия USDT
            if ($val->getPair()->getPayout()->getCurrency()->getTag() == "CRYPTO") {
                $sheet->setCellValue(++$columnLetter . $i, round($outFee * $ratePayout,2));
            } else {
                $sheet->setCellValue(++$columnLetter . $i, round($outFee / $ratePayout,2));
            }
            $sumOutWithFee = $val->getPayoutAmount() + $outFee;
            // Выходящая сумма с комиссией
            $sheet->setCellValue(++$columnLetter . $i, round($sumOutWithFee,2));
            // Выходящая сумма с комиссией USDT
            if ($val->getPair()->getPayout()->getCurrency()->getTag() == "CRYPTO") {
                $sheet->setCellValue(++$columnLetter . $i, round($sumOutWithFee * $ratePayout,2));
            } else {
                $sheet->setCellValue(++$columnLetter . $i, round($sumOutWithFee / $ratePayout,2));
            }
            // Course
            $sheet->setCellValue(++$columnLetter . $i, round($val->getCourse(), 2));
            // Course(USDT)
            if ($val->getPair()->getPayment()->getCurrency()->getTag() == "CRYPTO") {
                $sheet->setCellValue(++$columnLetter . $i, round($val->getCourse() / $ratePayout, 3));
            } else {
                $sheet->setCellValue(++$columnLetter . $i, round($val->getCourse() * $ratePayout, 3));
            }
            // SystemPercent-Процент пары
            $sheet->setCellValue(++$columnLetter . $i, $val->getPairPercent());
            $paymentSystemPricePayment = $this->getDoctrine()->getRepository(RequisitionFeeHistory::class)->findOneBy(
                [
                    'requisition' => $val->getId(),
                    'type'        => Pair::PAYMENT
                ]
            )->getPaymentSystemPrice();
            $paymentSystemPricePayout = $this->getDoctrine()->getRepository(RequisitionFeeHistory::class)->findOneBy(
                [
                    'requisition' => $val->getId(),
                    'type'        => Pair::PAYOUT
                ]
            )->getPaymentSystemPrice();
            // SystemCostPrice-PaymentSystemPrice-Себестоимость покупки
            $sheet->setCellValue(++$columnLetter . $i, $paymentSystemPricePayment);
            // SystemCostPrice-PaymentSystemPrice-Себестоимость продажи
            $sheet->setCellValue(++$columnLetter . $i, $paymentSystemPricePayout);
            // Курс(отдаем)
            $sheet->setCellValue(++$columnLetter . $i, $ratePayment);
            // Курс(получаем)
            $sheet->setCellValue(++$columnLetter . $i, $ratePayout);
            if ($val->getPair()->getPayment()->getCurrency()->getTag() == "CRYPTO") {
                $sheet->setCellValue(++$columnLetter . $i, round($val->getProfit() * $ratePayout, 2) . " USDT");
            } else {
                $sheet->setCellValue(++$columnLetter . $i, round($val->getProfit() / $ratePayout, 2) . " USD");
            }
            // RequisitionProfit
            $referralsFirstLevelProfit = $this->getDoctrine()->getRepository(
                RequisitionProfitHistory::class
            )->findOneBy(
                [
                    'requisition' => $val->getId(),
                    'fieldName'   => "referralsProfit_1"
                ]
            );
            $referralsFirstLevelProfitValue = (!$referralsFirstLevelProfit) ? 0 : $referralsFirstLevelProfit->getValue();
            // FirstReferralLevelProfit
            $sheet->setCellValue(++$columnLetter . $i, $referralsFirstLevelProfitValue);

            $referralsSecondLevelProfit = $this->getDoctrine()->getRepository(
                RequisitionProfitHistory::class
            )->findOneBy(
                [
                    'requisition' => $val->getId(),
                    'fieldName'   => "referralsProfit_2"
                ]
            );
            $referralsSecondLevelProfitValue = (!$referralsSecondLevelProfit) ? 0 : $referralsSecondLevelProfit->getValue();
            // SecondReferralLevelProfit
            $sheet->setCellValue(++$columnLetter . $i, $referralsSecondLevelProfitValue);

            if ($val->getPair()->getPayment()->getCurrency()->getTag() == "CRYPTO") {
                $sheet->setCellValue(++$columnLetter . $i, round($val->getSystemProfit() * $ratePayout, 2) . " USDT");
            } else {
                $sheet->setCellValue(++$columnLetter . $i, round($val->getSystemProfit() / $ratePayout, 2) . " USD");
            }
            $i += 2;
        }
        $writer = new Xlsx($spreadsheet);
        $fileName = 'statistics.xlsx';
        $temp_file = tempnam(sys_get_temp_dir(), $fileName);
        $writer->save($temp_file);


        return $this->file($temp_file, $fileName, ResponseHeaderBag::DISPOSITION_INLINE);
    }
}
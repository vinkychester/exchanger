<?php

namespace App\Controller;


use App\Entity\Client;
use App\Entity\Currency;
use App\Entity\Pair;
use App\Entity\Requisition;
use App\Entity\RequisitionFeeHistory;
use App\Entity\TrafficDetail;
use App\Entity\TrafficLink;
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
class TrafficStatisticsExcelAction extends AbstractController
{

    /**
     * @param Request $request
     * @return mixed
     * @throws Exception
     */
    public function __invoke(Request $request)
    {
        $args = $request->query->all();

        $trafficLinks = $this->getDoctrine()->getRepository(TrafficLink::class)->getTrafficLinks($args);

        foreach ($trafficLinks as $trafficLink) {
            $trafficLink->setRegisterClients(
                $this->getDoctrine()->getRepository(Client::class)->getTrafficLinksClients(
                    $args,
                    $trafficLink->getToken()
                )
            );

            $trafficLink->setCountOfClicksForPeriod(
                count(
                    $this->getDoctrine()->getRepository(TrafficDetail::class)->getFilteredTrafficLinks(
                        $args,
                        $trafficLink->getToken()
                    )
                )
            );

            if (!isset($trafficLink->getRegisterClients()[0])) {
                $trafficLink->setCountOfRequisitionForPeriod(0);
                $trafficLink->setSystemProfitForPeriod(0);
                $trafficLink->setCleanSystemProfitForPeriod(0);
            } else {
                $profit = 0;
                $systemProfit = 0;
                $countOfRequisition = 0;

                foreach ($trafficLink->getRegisterClients() as $client) {
                    $requisitions = $this->getDoctrine()->getRepository(Requisition::class)->findBy(
                        ['client' => $client, 'status' => 'finished']
                    );
                    foreach ($requisitions as $requisition) {
                        $rate = $this->getDoctrine()->getRepository(RequisitionFeeHistory::class)->findOneBy(
                            [
                                'requisition' => $requisition,
                                'type'        => Pair::PAYMENT
                            ]
                        )->getRate();

                        if($requisition->getPair()->getPayment()->getCurrency()->getTag()===Currency::TYPE_CRYPTO){
                            $profit += round(($requisition->getProfit() * $rate) * 100) / 100;
                            $systemProfit += round(($requisition->getSystemProfit() * $rate) * 100) / 100;
                        }
                        else{
                            $profit += round(($requisition->getProfit() / $rate) * 100) / 100;
                            $systemProfit += round(($requisition->getSystemProfit() / $rate) * 100) / 100;
                        }
                    }
                    $countOfRequisition += count($requisitions);
                }
                $trafficLink->setCountOfRequisitionForPeriod($countOfRequisition);
                $trafficLink->setSystemProfitForPeriod($profit);
                $trafficLink->setCleanSystemProfitForPeriod($systemProfit);
            }
        }

        $spreadsheet = new Spreadsheet();

        $sheet = $spreadsheet->getActiveSheet();
        $columnNames = [
            'Имя сайта',
            'Количество пользователей которые перешли по ссылке',
            'Количество зарегистрированных пользователей',
            'Количество заявок пользователей',
            'Общая прибыль системы с заявок пользователей(USD)',
            'Чистая прибыль системы с заявок пользователей(USD)',
            'Ссылка'
        ];
        $columnLetter = 'A';
        foreach ($columnNames as $columnName) {
            $sheet->setCellValue($columnLetter . '1', $columnName);
            $columnLetter++;
        }

        $i = 2;
        foreach ($trafficLinks as $trafficLink) {
            $columnLetter = 'A';

            $sheet->setCellValue($columnLetter . $i, $trafficLink->getSiteName());
            $sheet->setCellValue(++$columnLetter . $i, $trafficLink->getCountOfClicksForPeriod());
            $sheet->setCellValue(++$columnLetter . $i, count($trafficLink->getRegisterClients()));
            $sheet->setCellValue(++$columnLetter . $i, $trafficLink->getCountOfRequisitionForPeriod());
            $sheet->setCellValue(++$columnLetter . $i, round($trafficLink->getSystemProfitForPeriod(),2));
            $sheet->setCellValue(++$columnLetter . $i, round($trafficLink->getCleanSystemProfitForPeriod(),2));
            if (!empty($trafficLink->getSiteUrl())) {
                $link = $trafficLink->getSiteUrl() . "?traffic=" . $trafficLink->getToken();
            } else {
                $link = "https://coin24.com.ua/traffic/" . $trafficLink->getToken();
            }
            $sheet->setCellValue(++$columnLetter . $i, $link);
            $i++;
        }
        $writer = new Xlsx($spreadsheet);
        $fileName = 'traffic.xlsx';
        $temp_file = tempnam(sys_get_temp_dir(), $fileName);
        $writer->save($temp_file);

        return $this->file($temp_file, $fileName, ResponseHeaderBag::DISPOSITION_INLINE);
    }
}
<?php


namespace App\Service\RequisitionCalculation;

use App\Entity\Currency;
use App\Entity\ManagerPercentProfitHistory;
use App\Entity\Requisition;
use App\Entity\RequisitionProfitHistory;
use App\Repository\ManagerPercentProfitHistoryRepository;
use App\Repository\RequisitionProfitHistoryRepository;
use App\Service\CashbackSystem\CashbackRecountBalancesService;
use App\Service\ReferralSystem\ReferralRecountBalancesService;
use Calculation\Service\Exchange;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Class RequisitionCalculationService
 * @package App\Service\RequisitionCalculation
 */
class RequisitionCalculationService
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var RequisitionProfitHistoryRepository
     */
    protected RequisitionProfitHistoryRepository $requisitionProfitHistoryRepository;
    /**
     * @var ReferralRecountBalancesService
     */
    protected ReferralRecountBalancesService $referralRecountBalancesService;
    /**
     * @var CashbackRecountBalancesService
     */
    protected CashbackRecountBalancesService $cashbackBalanceService;
    /**
     * @var ManagerPercentProfitHistoryRepository
     */
    protected ManagerPercentProfitHistoryRepository $managerPercentProfitHistoryRepository;

    /**
     * ClientReferralRelationService constructor.
     * @param EntityManagerInterface $entityManager
     * @param RequisitionProfitHistoryRepository $requisitionProfitHistoryRepository
     * @param ReferralRecountBalancesService $referralRecountBalancesService
     * @param CashbackRecountBalancesService $cashbackBalanceService
     * @param ManagerPercentProfitHistoryRepository $managerPercentProfitHistoryRepository
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        RequisitionProfitHistoryRepository $requisitionProfitHistoryRepository,
        ReferralRecountBalancesService $referralRecountBalancesService,
        CashbackRecountBalancesService $cashbackBalanceService,
        ManagerPercentProfitHistoryRepository $managerPercentProfitHistoryRepository
    ) {
        $this->entityManager = $entityManager;
        $this->requisitionProfitHistoryRepository = $requisitionProfitHistoryRepository;
        $this->referralRecountBalancesService = $referralRecountBalancesService;
        $this->cashbackBalanceService = $cashbackBalanceService;
        $this->managerPercentProfitHistoryRepository = $managerPercentProfitHistoryRepository;
    }

//    /**
//     * @param Requisition $requisition
//     * @param $amount
//     * @return $this
//     */
//    public function calculateRequisitionAmounts(Requisition $requisition, $amount): RequisitionCalculationService
//    {
//        $pair = $requisition->getPair();
//        $paymentInvoice = $requisition->getInvoices()->first();
//
//        if (Currency::TYPE_CRYPTO === $pair->getPayment()->getCurrency()->getTag()) {
//            $requisition->setPaymentAmount($amount);
//            Exchange::calculation('payment')->calculateAmount($pair, $amount);
//            $requisition->setPayoutAmount($pair->getPayout()->getAmount());
//        }
//
//        if (Currency::TYPE_CURRENCY === $pair->getPayment()->getCurrency()->getTag()) {
//            $requisition->setAmountWithFee(round($paymentInvoice->getPaidAmount(), 2));
//        }
//
//        return $this;
//    }

    /**
     * Сумма, которую нужно выплатить клиенту
     *
     * commissionPercent = $pair->getPercent()
     * amount = $pair->getPayment()->getAmount()
     * @param float $amount
     * @param float $pairPercent
     * @return float|int
     */
    public function calculateAmountForPayout(float $amount, float $pairPercent)
    {
        return $amount - ($amount * $pairPercent) / 100;
    }

//    /**
//     * @param Requisition $requisition
//     * @return $this|float|int
//     */
//    public function calculateRequisitionCourse(Requisition $requisition)
//    {
//        $pair = $requisition->getPair();
//
//        if ($pair->getPayment()->getCurrency()->getTag() === Currency::TYPE_CRYPTO) {
//            $paymentWithCommission = $requisition->getPaymentAmount()
//                - ($requisition->getPaymentAmount() * $pair->getPayment()->getFee()->getPercent() / 100)
//                - $pair->getPayment()->getFee()->getConstant();
//            $payoutWithCommission = $requisition->getPayoutAmount()
//                * ((100 + $requisition->getPair()->getPayout()->getFee()->getPercent()) / 100)
//                + $requisition->getPair()->getPayout()->getFee()->getConstant();
//
//            return $payoutWithCommission / $paymentWithCommission;
//        }
//
//        if ($pair->getPayment()->getCurrency()->getTag() === Currency::TYPE_CURRENCY) {
//            $tmp = $requisition->getPayoutAmount() * ((100 + $requisition->getPair()->getPayment()->getFee(
//                        )->getPercent()) / 100)
//                + $requisition->getPair()->getPayment()->getFee()->getConstant();
//
//            return 1 / ($requisition->getAmountWithFee() / $tmp);
//        }
//
//        return $this;
//    }

//    /**
//     * System profit depend on payment currency
//     *
//     * @param Requisition $requisition
//     * @return $this|float|int
//     */
//    public function calculateRequisitionSystemProfit(Requisition $requisition)
//    {
//        $pair = $requisition->getPair();
//
//        if ($pair->getPayment()->getCurrency()->getTag() === Currency::TYPE_CURRENCY) {
//            //TODO: Check percent on valid
//            return $requisition->getAmountWithFee() * ($requisition->getPair()->getPercent() / 100);
//        }
//
//        if ($pair->getPayment()->getCurrency()->getTag() === Currency::TYPE_CRYPTO) {
//            $amountWithFee = $requisition->getPaymentAmount()
//                * (100 - $requisition->getPair()->getPayment()->getFee()->getPercent()) / 100
//                - $requisition->getPair()->getPayment()->getFee()->getConstant();
//
//            return $amountWithFee * $requisition->getPair()->getPercent() / 100;
//        }
//
//        return $this;
//    }

    /**
     * Return current manager percent for requisition
     * Manager percent types: cash/bank
     *
     * @param Requisition $requisition
     * @return float
     */
    public function getManagerPercentByRequisitionType(Requisition $requisition): float
    {
        $manager = $requisition->getManager();
        $pair = $requisition->getPair();

        if ($pair->getPayment()->getPaymentSystem()->getSubName() === "CASH" || $pair->getPayout()->getPaymentSystem()->getSubName() === "CASH") {
            $percent = $manager->getPercentCash() ?? 0;
        } else {
            $managerPercentBankRecord = $this->managerPercentProfitHistoryRepository->findOneBy(
                ['percentName' => ManagerPercentProfitHistory::NAME_BANK],
                ['id' => 'DESC']
            );

            $percent = $managerPercentBankRecord ? $managerPercentBankRecord->getPercent() : 0;
        }

        return $percent;
    }

    /**
     * @param Requisition $requisition
     * @return float
     */
    public function calculateManagerProfit(Requisition $requisition): float
    {
        return $requisition->getProfit() * ($this->getManagerPercentByRequisitionType($requisition) / 100);
    }

    /**
     * @param Requisition $requisition
     */
    public function setRequisitionProfits(Requisition $requisition)
    {
        $clientCashbackProfit = $this->cashbackBalanceService->calculateCashbackBalance($requisition);
        $clientsReferralProfit = $this->referralRecountBalancesService->calculateReferralBalance($requisition);
        $managerProfit = $this->calculateManagerProfit($requisition);
        $managerPercent = $this->getManagerPercentByRequisitionType($requisition);

        $this->requisitionProfitHistoryRepository->setRequisitionProfitHistory(
            $requisition,
            RequisitionProfitHistory::CASHBACK_PROFIT_FIELD,
            $clientCashbackProfit
        );

        $this->requisitionProfitHistoryRepository->setRequisitionProfitHistory(
            $requisition,
            RequisitionProfitHistory::REFERRAL_PROFIT_FIELD,
            $clientsReferralProfit
        );

        $this->requisitionProfitHistoryRepository->setRequisitionProfitHistory(
            $requisition,
            RequisitionProfitHistory::MANAGER_PROFIT_FIELD,
            $managerProfit
        );

        $this->requisitionProfitHistoryRepository->setRequisitionProfitHistory(
            $requisition,
            RequisitionProfitHistory::MANAGER_PERCENT_FIELD,
            $managerPercent
        );

        $this->requisitionProfitHistoryRepository->setRequisitionProfitHistory(
            $requisition,
            RequisitionProfitHistory::PAYMENT_USDT_COURSE,
            $requisition->getPair()->getPayment()->getCurrency()->getPaymentRate()
        );

        $this->requisitionProfitHistoryRepository->setRequisitionProfitHistory(
            $requisition,
            RequisitionProfitHistory::PAYOUT_USDT_COURSE,
            $requisition->getPair()->getPayout()->getCurrency()->getPayoutRate()
        );

        $requisition->setCleanSystemProfit(
            $requisition->getProfit() - $clientsReferralProfit - $clientCashbackProfit - $managerProfit
        );

        $this->entityManager->flush();
    }

    /**
     * @param Requisition $requisition
     * @return array
     */
    public function convertToUsdt(Requisition $requisition)
    {
        $paymentUsdtCourse = $requisition->getRequisitionProfitHistories()->filter(
            function ($history) {
                return $history->getFieldName() === 'paymentUsdtCourse';
            }
        )->current();

        $payoutUsdtCourse = $requisition->getRequisitionProfitHistories()->filter(
            function ($history) {
                return $history->getFieldName() === 'payoutUsdtCourse';
            }
        )->current();

        if ($requisition->getStatus() === Requisition::STATUS_FINISHED) {
            $paymentCourse = $paymentUsdtCourse && $paymentUsdtCourse->getValue() !== 0.0
                ? $paymentUsdtCourse->getValue()
                : $requisition->getPair()->getPayment()->getCurrency()->getPaymentRate();

            $payoutCourse = $payoutUsdtCourse && $payoutUsdtCourse->getValue() !== 0.0
                ? $payoutUsdtCourse->getValue()
                : $requisition->getPair()->getPayout()->getCurrency()->getPayoutRate();
        } else {
            $paymentCourse = $requisition->getPair()->getPayment()->getCurrency()->getPaymentRate();
            $payoutCourse = $requisition->getPair()->getPayout()->getCurrency()->getPayoutRate();
        }

        $course = $requisition->getPair()->getPayment()->getCurrency()->getTag() === 'CURRENCY'
            ? $paymentCourse
            : $payoutCourse;

        $paymentAmount = $requisition->getPair()->getPayment()->getCurrency()->getTag() === 'CURRENCY'
            ? $requisition->getPaymentAmount() / $course
            : $requisition->getPaymentAmount();

        $payoutAmount = $requisition->getPair()->getPayment()->getCurrency()->getTag() === 'CURRENCY'
            ? $requisition->getPayoutAmount()
            : $requisition->getPayoutAmount() / $course;

        $cleanSystemProfit = $requisition->getCleanSystemProfit() / $course;
        $systemProfit = $requisition->getProfit() / $course;

        return [
            'course'            => $paymentCourse ?? 0,
            'paymentAmount'     => $paymentAmount ?? 0,
            'payoutAmount'      => $payoutAmount ?? 0,
            'systemProfit'      => $systemProfit ?? 0,
            'cleanSystemProfit' => $cleanSystemProfit ?? 0,
            'paymentCourse'     => $paymentCourse ?? 0,
            'payoutCourse'      => $payoutCourse ?? 0,
        ];
    }

}
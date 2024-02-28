<?php

namespace App\Resolver\Profit;

use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;
use App\Entity\Profit;
use App\Entity\Requisition;
use App\Entity\RequisitionFeeHistory;
use App\Entity\RequisitionProfitHistory;
use App\Service\ReferralSystem\ReferralRecountBalancesService;
use Doctrine\ORM\EntityManagerInterface;

class ManagerProfitResolver implements QueryCollectionResolverInterface
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * @var ReferralRecountBalancesService
     */
    protected ReferralRecountBalancesService $balancesService;

    /**
     * @param EntityManagerInterface $entityManager
     * @param ReferralRecountBalancesService $balancesService
     */
    public function __construct(EntityManagerInterface $entityManager, ReferralRecountBalancesService $balancesService)
    {
        $this->entityManager = $entityManager;
        $this->balancesService = $balancesService;
    }

    /**
     * @param iterable $collection
     * @param array $context
     * @return iterable
     */
    public function __invoke(iterable $collection, array $context): iterable
    {
        $args = $context['args'];
        $date_gte = $args['date_gte'];
        $date_lte = $args['date_lte'];
        if (array_key_exists('manager', $args)) {
            $requisitions = $this->entityManager->getRepository(Requisition::class)
                ->getFinishedRequisitionsByPeriod($date_gte, $date_lte, $args['manager']);
        } else {
            $requisitions = $this->entityManager->getRepository(Requisition::class)
                ->getFinishedRequisitionsByPeriod($date_gte, $date_lte);
        }
        $managerCashProfit = 0;
        $managerBankProfit = 0;
        $systemProfit = 0;
        $totalCount = 0;
        $referralProfit = 0;

        /** @var Requisition $requisition */
        foreach ($requisitions as $requisition) {
            $tag = $requisition->getPair()->getPayment()->getCurrency()->getTag();
            /** @var RequisitionFeeHistory $rate */
            $rate = $this->entityManager->getRepository(RequisitionFeeHistory::class)->findOneBy(
                ['requisition' => $requisition, 'type' => 'payment']
            );
            /** @var RequisitionProfitHistory $referral */
            $referral = $this->entityManager->getRepository(RequisitionProfitHistory::class)->findOneBy(
                [
                    'requisition' => $requisition,
                    'fieldName'   => RequisitionProfitHistory::REFERRAL_PROFIT_FIELD
                ]
            );
            if ($referral) {
                $referralProfit += $this->balancesService->convert($tag, $referral->getValue(), $rate->getRate());
            }
            $systemProfit += $this->balancesService->convert($tag, $requisition->getSystemProfit(), $rate->getRate());
            if ($requisition->getExchangePoint() == Requisition::EXCHANGE_TYPE) {
                $managerBankProfit += $this->balancesService->convert(
                    $tag,
                    $requisition->getManagerProfit(),
                    $rate->getRate()
                );
            }
            if ($requisition->getManager()) {
                $managerCashProfit += $this->balancesService->convert(
                    $tag,
                    $requisition->getManagerProfit(),
                    $rate->getRate()
                );
                $totalCount += +1;
            }
        }

        /** @var Profit $item */
        foreach ($collection as $item) {
            $item->setProfits(
                [
                    Profit::MANGER_PROFIT => $managerCashProfit + $managerBankProfit,
                    Profit::MANGER_PROFIT_BANK => $managerBankProfit,
                    Profit::MANGER_PROFIT_CASH => $managerCashProfit,
                    'totalCount' => $totalCount,
                    Profit::SYSTEM_PROFIT => $systemProfit,
                    Profit::REFERRAL_PROFIT => $referralProfit
                ]
            );
        }

        return $collection;
    }
}
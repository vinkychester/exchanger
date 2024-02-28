<?php

namespace App\Resolver\Profit;

use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;
use App\Entity\Profit;
use App\Entity\Requisition;
use App\Entity\RequisitionFeeHistory;
use App\Entity\RequisitionProfitHistory;
use App\Service\ReferralSystem\ReferralRecountBalancesService;
use Doctrine\ORM\EntityManagerInterface;

class ProfitCollectionResolver implements QueryCollectionResolverInterface
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
        $systemProfit = 0;
        $profit = 0;
        $referralProfit = 0;
        $cashbackProfit = 0;
        $managerProfit = 0;
        $requisitions = $this->entityManager->getRepository(Requisition::class)
            ->getFinishedRequisitionsByPeriod($date_gte, $date_lte);

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
            $cashback = $this->entityManager->getRepository(RequisitionProfitHistory::class)->findOneBy(
                [
                    'requisition' => $requisition,
                    'fieldName'   => RequisitionProfitHistory::CASHBACK_PROFIT_FIELD
                ]
            );
            if ($cashback) {
                $cashbackProfit += $this->balancesService->convert($tag, $cashback->getValue(), $rate->getRate());
            }
            if ($referral) {
                $referralProfit += $this->balancesService->convert($tag, $referral->getValue(), $rate->getRate());
            }
            $systemProfit += $this->balancesService->convert($tag, $requisition->getSystemProfit(), $rate->getRate());
            $profit += $this->balancesService->convert($tag, $requisition->getProfit(), $rate->getRate());
            $managerProfit += $this->balancesService->convert($tag, $requisition->getManagerProfit(), $rate->getRate());
        }
        /** @var Profit $item */
        foreach ($collection as $item) {
            if ($item->getFieldName() === Profit::PROFIT) {
                $item->setTempName(Profit::PROFIT)->setTempValue($profit);
                $item->setProfits(
                    [
                        Profit::MANGER_PROFIT   => $managerProfit,
                        Profit::CASHBACK_PROFIT => $cashbackProfit,
                        Profit::REFERRAL_PROFIT => $referralProfit
                    ]
                );
            }
            if ($item->getFieldName() === Profit::SYSTEM_PROFIT) {
                $item->setTempName(Profit::SYSTEM_PROFIT)->setTempValue($systemProfit);
            }
        }

        return $collection;
    }
}
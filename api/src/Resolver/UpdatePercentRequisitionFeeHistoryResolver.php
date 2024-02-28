<?php


namespace App\Resolver;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\Pair;
use App\Entity\RequisitionFeeHistory;
use Calculation\Service\Exchange;

/**
 * Class UpdatePercentRequisitionFeeHistoryResolver
 * @package App\Resolver
 */
class UpdatePercentRequisitionFeeHistoryResolver implements MutationResolverInterface
{
    /**
     * @param RequisitionFeeHistory|null $item
     *
     * @return RequisitionFeeHistory
     */
    public function __invoke($item, array $context): ?RequisitionFeeHistory
    {
        $requisition = $item->getRequisition();
        $pair = $requisition->getPair();
        $paymentAmount = $requisition->getPaymentAmount();

        Exchange::calculation(Pair::PAYMENT)->calculateAmount($pair, $paymentAmount, $item->getPairPercent());
        $requisition->setRecalculatedAmount(round($pair->getPayout()->getAmount(), 2));

        return $item;
    }
}
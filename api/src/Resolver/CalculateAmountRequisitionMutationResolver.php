<?php


namespace App\Resolver;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\Currency;
use App\Entity\Pair;
use App\Entity\Requisition;
use Calculation\Service\Course;
use Calculation\Service\Exchange;

class CalculateAmountRequisitionMutationResolver implements MutationResolverInterface
{
    /**
     * @param Requisition|null $item
     *
     * @return Requisition
     */
    public function __invoke($item, array $context)
    {
        $pairPercent = $context['args']['input']['tmpPercent'];
        $pair = $item->getPair();
        $paymentAmount = $item->getPaymentAmount();

        Exchange::calculation(Pair::PAYMENT)->calculateAmount($pair, $paymentAmount, $pairPercent);
        $item->setTmpCommission(Course::calculateLastFee($pair, $pairPercent));

        $amount = $pair->getPayout()->getAmount();

        if ($pair->getPayout()->getCurrency()->getTag() === Currency::TYPE_CURRENCY) {
            $item->setAmount(round($amount, 2));
        } else {
            $item->setAmount($amount);
        }

        return $item;
    }
}
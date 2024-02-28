<?php


namespace App\Resolver\Pair;

use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use App\Entity\Pair;
use Calculation\Service\Exchange;
use Calculation\Service\Limits;

/**
 * Class PairResolver
 * @package App\Resolver\Pair
 */
class PairResolver implements QueryItemResolverInterface
{
    /**
     * @param Pair|null $item
     * @param array $context
     * @return Pair
     */
    public function __invoke($item, array $context)
    {
        $amount = $context["args"]["amount"] ?? null;
        $direction = $context["args"]["direction"];

        Limits::calculateMax($item);
        Exchange::calculation($direction)->calculateAmount($item, $amount);
        $item->setPaymentRate(Exchange::calculation("payment")->calculateRates($item));
        $item->setPayoutRate(Exchange::calculation("payout")->calculateRates($item));

        return $item;
    }
}

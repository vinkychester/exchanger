<?php


namespace App\Resolver;


use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use App\Entity\Pair;
use Calculation\Service\Exchange;

/**
 * Class RatesResolver
 * @package App\Resolver
 */
class RatesResolver implements QueryItemResolverInterface
{
    /**
     * @param Pair|null $item
     * @param array $context
     * @return Pair|void
     */
    public function __invoke($item, array $context)
    {
        $item->setPaymentRate(Exchange::calculation("payment")->calculateRates($item));
        $item->setPayoutRate(Exchange::calculation("payout")->calculateRates($item));

        return $item;
    }
}
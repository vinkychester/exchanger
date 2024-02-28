<?php


namespace App\Resolver;


use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;

class CalculatorCollectionQueryResolver implements QueryCollectionResolverInterface
{
    /**
     * @param iterable $collection
     * @param array $context
     * @return iterable
     */
    public function __invoke(iterable $collection, array $context): iterable
    {
        return $collection;
    }
}
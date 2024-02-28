<?php


namespace App\Resolver;


use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;
use App\Entity\Requisition;

class CollectionQueryRequisitionResolver implements QueryCollectionResolverInterface
{
    /**
     * @param iterable<Requisition> $collection
     *
     * @return iterable<Requisition>
     */
    public function __invoke(iterable $collection, array $context): iterable
    {
        return $collection;
    }
}
<?php


namespace App\Resolver\Manager;


use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;

class GetManagersWithFilteredRequisitionsReportResolver implements QueryCollectionResolverInterface
{
    public function __invoke(iterable $collection, array $context): iterable
    {
        $args = $context['args'];

        if(isset($args['requisitionsDateFrom']) && $args['requisitionsDateTo']) {
            $dateFrom = $args['requisitionsDateFrom'];
            $dateTo = $args['requisitionsDateTo'];

            foreach($collection as $manager) {
                $manager->setRequisitions($manager->getRequisitions()->filter(function ($requisition) use($dateFrom, $dateTo) {
                    return $requisition->getCreatedAt() >= (int)$dateFrom && $requisition->getCreatedAt() <= (int)$dateTo;
                }));
            }
        }

        return $collection;
    }
}
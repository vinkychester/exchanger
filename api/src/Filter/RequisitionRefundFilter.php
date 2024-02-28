<?php


namespace App\Filter;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\AbstractContextAwareFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use Doctrine\ORM\QueryBuilder;

class RequisitionRefundFilter extends AbstractContextAwareFilter
{

    const FILTER_RESOURCE_TYPE_PROPERTY = "isPaid";

    /**
     * @param string $property
     * @param $value
     * @param QueryBuilder $queryBuilder
     * @param QueryNameGeneratorInterface $queryNameGenerator
     * @param string $resourceClass
     * @param string|null $operationName
     */
    protected function filterProperty(
        string $property,
        $value,
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        string $operationName = null
    ) {
        if ($property !== self::FILTER_RESOURCE_TYPE_PROPERTY) {
            return;
        }
        if (!$value) {
            return;
        }

        $queryBuilder->join('o.invoices', 'invoices')
            ->andWhere('invoices.direction = :direction')
            ->setParameter('direction', 'payment')
            ->andWhere('invoices.isPaid = :paid')
            ->setParameter('paid', $value);
    }

    /**
     * @param string $resourceClass
     * @return array
     */
    public function getDescription(string $resourceClass): array
    {
        if (!$this->properties) {
            return [];
        }

        $description = [];
        foreach ($this->properties as $property => $strategy) {
            $description[$property] = [
                'property' => $property,
                'type'     => 'bool',
                'required' => false,
            ];
        }

        return $description;
    }
}
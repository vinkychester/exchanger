<?php


namespace App\Filter;


use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\AbstractContextAwareFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use Doctrine\ORM\QueryBuilder;

/**
 * Class ExchangeTypeFilter
 * @package App\Filter
 */
class ExchangeTypeFilter extends AbstractContextAwareFilter
{
    const FILTER_RESOURCE_TYPE_PROPERTY = "exchangeType";

    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null)
    {
        if ($property !== self::FILTER_RESOURCE_TYPE_PROPERTY) {
            return;
        }

        if ($value === "bank") {
            $queryBuilder->andWhere('o.exchangePoint = :point')
                ->setParameter('point', "bank");
        }

        if ($value === "cash") {
            $queryBuilder->andWhere('o.exchangePoint != :point')
                ->setParameter('point', "bank");
        }
    }

    public function getDescription(string $resourceClass): array
    {
        if (!$this->properties) {
            return [];
        }

        $description = [];
        foreach ($this->properties as $property => $strategy) {
            $description[$property] = [
                'property' => $property,
                'type' => 'string',
                'required' => false,
            ];
        }

        return $description;
    }
}
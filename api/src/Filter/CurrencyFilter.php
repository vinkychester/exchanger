<?php


namespace App\Filter;


use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\AbstractContextAwareFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use Doctrine\ORM\QueryBuilder;

class CurrencyFilter extends AbstractContextAwareFilter
{


    const FILTER_RESOURCE_TYPE_PROPERTY = "currency";

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

        $queryBuilder->join('o.pair', 'pair')
            ->join('pair.payment', 'payment')
            ->join('pair.payout', 'payout')
            ->join('payment.currency', 'inCurrency')
            ->join('payout.currency', 'outCurrency')
            ->andWhere($queryBuilder->expr()->orX(
                $queryBuilder->expr()->eq('inCurrency.asset', ':value'),
                $queryBuilder->expr()->eq('outCurrency.asset', ':value')
            ))
                ->setParameter('value', $value);

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
                'type'     => 'string',
                'required' => false,
            ];
        }

        return $description;
    }
}
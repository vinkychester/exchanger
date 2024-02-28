<?php
// api/src/Filter/RegexpFilter.php

namespace App\Filter;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\AbstractContextAwareFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Entity\Pair;
use App\Entity\PairUnit;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Serializer\NameConverter\NameConverterInterface;

class PairsByPairUnitFilter extends AbstractContextAwareFilter
{
    const FILTER_RESOURCE_TYPE_PROPERTY = "pairUnitId";

    public function __construct(
        ManagerRegistry $managerRegistry,
        ?RequestStack $requestStack = null,
        LoggerInterface $logger = null,
        array $properties = null,
        NameConverterInterface $nameConverter = null
    )
    {
        parent::__construct($managerRegistry, $requestStack, $logger, $properties, $nameConverter);
    }

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
    )
    {
        // otherwise filter is applied to order and page as well
        if ($property !== self::FILTER_RESOURCE_TYPE_PROPERTY) {
            return;
        }

        $pairUnit = $this->managerRegistry->getRepository(PairUnit::class)->find($value);
        $currencyAsset = $pairUnit->getCurrency()->getAsset();
        $serviceName = $pairUnit->getService()->getName();
        $paymentSystemName = $pairUnit->getPaymentSystem()->getName();
        $queryBuilder
            ->innerJoin('o.payment', 'payment')
            ->innerJoin('o.payout', 'payout')
            ->innerJoin('payment.currency', 'paymentCurrency')
            ->innerJoin('payment.service', 'paymentService')
            ->innerJoin('payment.paymentSystem', 'paymentPaymentSystem')
            ->innerJoin('payout.currency', 'payoutCurrency')
            ->innerJoin('payout.service', 'payoutService')
            ->innerJoin('payout.paymentSystem', 'payoutPaymentSystem')
            ->Where($queryBuilder->expr()->andX(
                $queryBuilder->expr()->eq('paymentCurrency.asset', ':currencyAsset'),
                $queryBuilder->expr()->eq('paymentService.name', ':serviceName'),
                $queryBuilder->expr()->eq('paymentPaymentSystem.name', ':paymentSystemName'),
                $queryBuilder->expr()->eq('payoutCurrency.tag', ':crypto'),
            ))
            ->OrWhere($queryBuilder->expr()->andX(
                $queryBuilder->expr()->eq('payoutCurrency.asset', ':currencyAsset'),
                $queryBuilder->expr()->eq('payoutService.name', ':serviceName'),
                $queryBuilder->expr()->eq('payoutPaymentSystem.name', ':paymentSystemName'),
                $queryBuilder->expr()->eq('paymentCurrency.tag', ':crypto'),
            ))
            ->setParameter(':currencyAsset', $currencyAsset)
            ->setParameter(':serviceName', $serviceName)
            ->setParameter(':paymentSystemName', $paymentSystemName)
            ->setParameter(':crypto', 'CRYPTO');
    }

    // This function is only used to hook in documentation generators (supported by Swagger and Hydra)
    public function getDescription(string $resourceClass): array
    {
        if (!$this->properties) {
            return [];
        }

        $description = [];
        foreach ($this->properties as $property => $strategy) {
            $description[$property] = [
                'property' => $property,
                'type' => 'int',
                'required' => false,
            ];
        }

        return $description;
    }
}
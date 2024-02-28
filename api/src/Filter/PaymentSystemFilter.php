<?php


namespace App\Filter;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\AbstractContextAwareFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Serializer\NameConverter\NameConverterInterface;

class PaymentSystemFilter extends AbstractContextAwareFilter
{
    const FILTER_RESOURCE_TYPE_PROPERTY = "tag";

    public function __construct(
        ManagerRegistry $managerRegistry,
        ?RequestStack $requestStack = null,
        LoggerInterface $logger = null,
        array $properties = null,
        NameConverterInterface $nameConverter = null
    ) {
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
    ) {
        if ($property !== self::FILTER_RESOURCE_TYPE_PROPERTY) {
            return;
        }

        if ($value === "CRYPTO") {
            $queryBuilder
                ->andWhere('o.tag = :tag')
                ->setParameter('tag', $value);
        }

        if ($value === "CURRENCY") {
            $queryBuilder
                ->orWhere('o.tag != :tag')
                ->setParameter('tag', "CRYPTO");
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
                'type'     => 'string',
                'required' => false,
            ];
        }

        return $description;
    }
}
<?php


namespace App\Filter;


use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\AbstractContextAwareFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Core\Exception\ResourceClassNotFoundException;
use ApiPlatform\Core\Metadata\Resource\Factory\ResourceMetadataFactoryInterface;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectManager;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Serializer\NameConverter\NameConverterInterface;

/**
 * Class DiscriminatorFilter
 * @package App\Filter
 */
class DiscriminatorFilter extends AbstractContextAwareFilter
{
    const FILTER_RESOURCE_TYPE_PROPERTY = "discr";

    /**
     * @var ResourceMetadataFactoryInterface
     */
    private ResourceMetadataFactoryInterface $resourceMetadataFactory;

    /**
     * DiscriminatorFilter constructor.
     * @param ManagerRegistry $managerRegistry
     * @param RequestStack|null $requestStack
     * @param LoggerInterface|null $logger
     * @param array|null $properties
     * @param NameConverterInterface|null $nameConverter
     * @param ResourceMetadataFactoryInterface $resourceMetadataFactory
     */
    public function __construct(
        ManagerRegistry $managerRegistry,
        ResourceMetadataFactoryInterface $resourceMetadataFactory,
        ?RequestStack $requestStack = null,
        LoggerInterface $logger = null, array $properties = null,
        NameConverterInterface $nameConverter = null
    )
    {
        parent::__construct($managerRegistry, $requestStack, $logger, $properties, $nameConverter);
        $this->resourceMetadataFactory = $resourceMetadataFactory;
    }

    /**
     * @param string $property
     * @param $value
     * @param QueryBuilder $queryBuilder
     * @param QueryNameGeneratorInterface $queryNameGenerator
     * @param string $resourceClass
     * @param string|null $operationName
     * @throws ResourceClassNotFoundException
     */
    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null)
    {
        if ($property !== self::FILTER_RESOURCE_TYPE_PROPERTY) {
            return;
        }

        /** @var ObjectManager $manager */
        $manager = $this->managerRegistry->getManagerForClass($resourceClass);
        $classMetadataFactory = $manager->getMetadataFactory();

        $classMetadata = $classMetadataFactory->getMetadataFor($resourceClass);

        foreach ($classMetadata->discriminatorMap as $discriminator => $entityClass) {
            $metadata = $this->resourceMetadataFactory->create($entityClass);
            if (strtolower($metadata->getShortName()) === $value) {
                $alias = $queryBuilder->getAllAliases()[0];
                $queryBuilder->andWhere($alias . " INSTANCE OF :instance");
                $queryBuilder->setParameter("instance", $discriminator);
                return;
            }
        }

        $queryBuilder->where('1=0');
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
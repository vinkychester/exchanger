<?php


namespace App\Resolver;


use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;
use App\Entity\Pair;
use App\Entity\PairUnit;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Class CurrencyCollectionPairUnitResolver
 * @package App\Resolver
 */
class CurrencyCollectionPairUnitResolver implements QueryCollectionResolverInterface
{
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    /**
     * CryptoCollectionPairUnitResolver constructor.
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @param iterable<PairUnit> $collection
     *
     * @return iterable<PairUnit>
     */
    public function __invoke(iterable $collection, array $context): iterable
    {
        $repository = $this->entityManager->getRepository(PairUnit::class);

        foreach ($collection as $item) {
            $inverse = $repository->getInversePairUnit($item);

            $item->setMinPayout($item->getFee()->getMin());
            $item->setMaxPayout($item->getFee()->getMax());

            if ($inverse !== null) {
                $item->setMinPayment($inverse->getFee()->getMin());
                $item->setMaxPayment($inverse->getFee()->getMax());
            }
        }

        return $collection;
    }
}
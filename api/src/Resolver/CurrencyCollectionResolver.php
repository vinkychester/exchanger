<?php


namespace App\Resolver;


use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;
use App\Entity\Currency;
use App\Entity\RateHistory;
use Doctrine\ORM\EntityManagerInterface;

class CurrencyCollectionResolver implements QueryCollectionResolverInterface
{
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    /**
     * CurrencyCollectionResolver constructor.
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @param iterable<Currency> $collection
     *
     * @return iterable<Currency>
     */
    public function __invoke(iterable $collection, array $context): iterable
    {
        foreach ($collection as $currency) {
           dump($currency->getTag());
//           $rate = $this->entityManager->getRepository(RateHistory::class)->getRateByCurrencyAsset($currency->getAsset());
        }

        dd("hello");
    }
}
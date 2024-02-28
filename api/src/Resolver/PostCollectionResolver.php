<?php


namespace App\Resolver;


use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;
use App\Entity\Pair;
use App\Entity\Post;
use App\Utils\Base64FileExtractor;
use Calculation\Service\Exchange;
use Doctrine\ORM\EntityManagerInterface;


class PostCollectionResolver implements QueryCollectionResolverInterface
{

    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;
    /**
     * @var Base64FileExtractor
     */

    /**
     * PostCollectionResolver constructor.
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @param iterable<Post> $collection
     *
     * @return iterable<Post>
     */
    public function __invoke(iterable $collection, array $context): iterable
    {
        foreach ($collection as $item) {
            /** @var Post $prev */
            $prev = $this->entityManager->getRepository(Post::class)->getPrevious($item->getId());
            $item->setPrevElement($prev === null ? null : $prev->getMetaUrl());

            /** @var Post $next */
            $next = $this->entityManager->getRepository(Post::class)->getNext($item->getId());
            $item->setNextElement($next === null ? null : $next->getMetaUrl());

            $pairUnits = $item->getPairUnits();
            if (count($pairUnits)) {
                foreach ($pairUnits as $pairUnit) {
                    $paymentPairs = $pairUnit->getPaymentPairs();
                    foreach ($paymentPairs as $paymentPair) {
                        $payoutPair = $this->entityManager->getRepository(Pair::class)->getPairPayout($paymentPair->getPayment(),$paymentPair->getPayout());
                        $paymentPair->setPaymentRatePost(Exchange::calculation("payment")->calculateRates($paymentPair));
                        if ($payoutPair) {
                            $paymentPair->setPayoutRatePost(Exchange::calculation("payout")->calculateRates($payoutPair));
                        }
                    }
                }
            }
        }

        return $collection;
    }
}

<?php


namespace App\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;
use App\Entity\Pair;
use App\Entity\PairUnit;
use App\Entity\RateHistory;
use App\Service\RateHistory\RateHistoryService;
use Calculation\Service\Course;
use Calculation\Service\Exchange;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Class CryptoCollectionPairUnitResolver
 * @package App\Resolver
 */
class CryptoCollectionPairUnitResolver implements QueryCollectionResolverInterface
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
        $paymentSystemName = $context["args"]["paymentSystemName"];
        $currencyName = $context["args"]["currencyName"];

        $repository = $this->entityManager->getRepository(Pair::class);

        foreach ($collection as $item) {
            $paymentPairs = $repository->findPairPayment($item, $paymentSystemName, $currencyName);
            $payoutPairs = $repository->findPairPayout($item, $paymentSystemName, $currencyName);
            count($paymentPairs) === 0 ? $item->setIsPaymentExchange(false) : $item->setIsPaymentExchange(true);
            count($payoutPairs) === 0 ? $item->setIsPayoutExchange(false) : $item->setIsPayoutExchange(true);
            if (count($paymentPairs) > 0) {
                $item->setPaymentConstant($paymentPairs[0]->getPayment()->getFee()->getConstant());
                $item->setPaymentPrice($paymentPairs[0]->getPayment()->getPrice());
                $item->setPaymentRate(Exchange::calculation("payment")->calculateRates($paymentPairs[0]));
                $item->setPaymentSurcharge(Course::calculateSurcharge($paymentPairs[0]));
            }
            if (count($payoutPairs) > 0) {
                $item->setPayoutConstant($payoutPairs[0]->getPayout()->getFee()->getConstant());
                $item->setPayoutPrice($payoutPairs[0]->getPayout()->getPrice());
                $item->setPayoutRate(Exchange::calculation("payout")->calculateRates($payoutPairs[0]));
                $item->setPayoutSurcharge(Course::calculateSurcharge($payoutPairs[0]));
            }
        }
        return $collection;
    }
}
<?php


namespace App\Resolver\Pair;

use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;
use App\Entity\Currency;
use App\Entity\Pair;
use App\Service\RateHistory\RateHistoryService;
use Calculation\Service\Course;
use Calculation\Service\Exchange;

/**
 * Class PairCollectionResolver
 * @package App\Resolver
 */
class PairCollectionResolver implements QueryCollectionResolverInterface
{
    /**
     * @var RateHistoryService
     */
    protected RateHistoryService $rateHistory;
    /**
     * @var RateHistoryService
     */
    protected RateHistoryService $rateHistoryService;

    /**
     * PairCollectionResolver constructor.
     * @param RateHistoryService $rateHistoryService
     */
    public function __construct(RateHistoryService $rateHistoryService) {
        $this->rateHistoryService = $rateHistoryService;
    }

    /**
     * @param iterable<Pair> $collection
     * @param array $context
     * @return iterable<Pair>
     */
    public function __invoke(iterable $collection, array $context): iterable
    {
        foreach ($collection as $pair) {
            $pair->setPaymentRate(Exchange::calculation("payment")->calculateRates($pair));
            $pair->setPayoutRate(Exchange::calculation("payout")->calculateRates($pair));
            $pair->getPayment()->setLastFee(Course::calculateLastFee($pair));
            $pair->getPayout()->setLastFee(Course::calculateLastFee($pair));
        }

        return $collection;
    }
}

<?php


namespace App\Resolver\PairUnit;


use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;
use App\Entity\PairUnit;
use App\Service\RateHistory\RateHistoryService;
use Calculation\Service\Course;

class PairUnitsWithDayChangeResolver implements QueryCollectionResolverInterface
{
    /**
     * @var RateHistoryService
     */
    protected RateHistoryService $rateHistoryService;

    /**
     * PairUnitsWithDayChangeResolver constructor.
     * @param RateHistoryService $rateHistoryService
     */
    public function __construct(RateHistoryService $rateHistoryService)
    {
        $this->rateHistoryService = $rateHistoryService;
    }

    /**
     * @param iterable $collection
     * @param array $context
     * @return iterable
     */
    public function __invoke(iterable $collection, array $context): iterable
    {
        foreach ($collection as $pairUnit) {
            $pairUnit->setDayChange(
                number_format(
                    (float)$this->rateHistoryService->getChangePercentByTime($pairUnit),
                    5,
                    '.',
                    ''
                )
            );
        }

        return $collection;
    }
}
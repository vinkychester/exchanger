<?php


namespace App\Service\RateHistory;

use App\Repository\RateHistoryRepository;
use Calculation\Utils\Exchange\PairUnitInterface;

class RateHistoryService
{
    /**
     * @var RateHistoryRepository
     */
    protected RateHistoryRepository $rateHistoryRepository;

    /**
     * RateHistoryService constructor.
     * @param RateHistoryRepository $rateHistoryRepository
     */
    public function __construct(RateHistoryRepository $rateHistoryRepository)
    {
        $this->rateHistoryRepository = $rateHistoryRepository;
    }

    /**
     * (B-A)/A*100
     * A = Исходное значение
     * B = Конечное значение
     * @param float $initialValue
     * @param float $endValue
     * @return float|int
     */
    function calculatePercentChange(float $initialValue, float $endValue)
    {
        return (($endValue - $initialValue) / $initialValue) * 100;
    }

    /**
     * @param PairUnitInterface $pairUnit
     * @param string $timeCondition
     * @return null
     */
    function getChangePercentByTime(PairUnitInterface $pairUnit, $timeCondition = '-24 hour'): ?float
    {
        $timestampBefore = strtotime($timeCondition, time());
        $rateNow = $this->rateHistoryRepository->findOneBy(
            [
                'currencyAsset' => $pairUnit->getCurrency()->getAsset(),
                'serviceName'   => $pairUnit->getService()->getName()
            ],
            ['id' => 'DESC']
        );

        $rateBefore = $this->rateHistoryRepository->getRateByTimeStamp($pairUnit, $timestampBefore);

//        if($pairUnit->getCurrency()->getAsset() === 'ETH') {
//            dd($rateBefore->getId(), $rateNow->getId());
//        }

        if(!$rateBefore && !$rateNow) {
            return null;
        }

        if(!$rateBefore && $rateNow) {
            $rateBefore = $rateNow;
        }

        return $this->calculatePercentChange($rateBefore->getRate(), $rateNow->getRate());
    }


}
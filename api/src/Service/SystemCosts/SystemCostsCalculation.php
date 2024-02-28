<?php


namespace App\Service\SystemCosts;

use App\Entity\ManagerPercentProfitHistory;
use App\Entity\ReferralLevel;
use App\Repository\CashbackLevelRepository;
use App\Repository\ManagerPercentProfitHistoryRepository;
use App\Repository\ReferralLevelRepository;
use Doctrine\ORM\EntityManagerInterface;

class SystemCostsCalculation
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var ReferralLevelRepository
     */
    protected ReferralLevelRepository $referralLevelRepository;
    /**
     * @var CashbackLevelRepository
     */
    protected CashbackLevelRepository $cashbackLevelRepository;
    /**
     * @var ManagerPercentProfitHistoryRepository
     */
    protected ManagerPercentProfitHistoryRepository $managerPercentProfitHistoryRepository;

    /**
     * SystemCostsCalculation constructor.
     * @param EntityManagerInterface $entityManager
     * @param ReferralLevelRepository $referralLevelRepository
     * @param CashbackLevelRepository $cashbackLevelRepository
     * @param ManagerPercentProfitHistoryRepository $managerPercentProfitHistoryRepository
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        ReferralLevelRepository $referralLevelRepository,
        CashbackLevelRepository $cashbackLevelRepository,
        ManagerPercentProfitHistoryRepository $managerPercentProfitHistoryRepository
    )
    {
        $this->entityManager = $entityManager;
        $this->referralLevelRepository = $referralLevelRepository;
        $this->cashbackLevelRepository = $cashbackLevelRepository;
        $this->managerPercentProfitHistoryRepository = $managerPercentProfitHistoryRepository;
    }

    /**
     * @param $managerPercentName
     * @param $percentName
     * @return float
     */
    public function calculateOtherCostsPercent($percentName): float
    {
        $percentNames = ['referral', 'cashback', 'manager'];

        $percentSum = 0;
        $this->calculateManagerCostsPercent()
        + $this->calculateCashbackCostsPercent()
        + $this->calculateReferralCostsPercent();

        if (in_array($percentName, $percentNames, true)) {
            if ($percentName === 'manager') {
                $percentSum = $this->calculateCashbackCostsPercent() + $this->calculateReferralCostsPercent();
            }

            if ($percentName === 'cashback') {
                $percentSum = $this->calculateManagerCostsPercent() + $this->calculateReferralCostsPercent();
            }

            if ($percentName === 'referral') {
                $percentSum = $this->calculateManagerCostsPercent() + $this->calculateReferralCostsPercent();
            }
        }

        return $percentSum;
    }

    /**
     * @param $managerPercentName
     * @return float
     */
    public function calculateTotalCostsPercent(): float
    {
        return $this->calculateManagerCostsPercent()
            + $this->calculateCashbackCostsPercent()
            + $this->calculateReferralCostsPercent();
    }

    /**
     * @param ReferralLevel $referralLevel
     * @return float
     */
    public function getReferralCostsPercentWithNewPercent(ReferralLevel $referralLevel): float
    {
        $maxLevelPercents = $this->referralLevelRepository->getMaxLevelsPercents();

        if (!$maxLevelPercents) {
            return $referralLevel->getPercent();
        }

        $percent = 0;
        $index = $referralLevel->getLevel() - 1;
        if (isset($maxLevelPercents[$index])) {
            if ($referralLevel->getPercent() > (float)$maxLevelPercents[$index]['maxPercent']) {
                $maxLevelPercents[$index]['maxPercent'] = $referralLevel->getPercent();
            }
        } else {
            $percent = $referralLevel->getPercent();
        }


        foreach ($maxLevelPercents as $maxLevelPercent) {
            $percent += (float)$maxLevelPercent['maxPercent'];
        }

        return $percent;
    }

    /**
     * @return float
     */
    public function calculateReferralCostsPercent(): float
    {
        $percent = 0;
        $maxLevelPercents = $this->referralLevelRepository->getMaxLevelsPercents();

        if (!$maxLevelPercents) {
            return 0;
        }

        foreach ($maxLevelPercents as $maxLevelPercent) {
            $percent += (float)$maxLevelPercent['maxPercent'];
        }

        return $percent;
    }

    /**
     * @return int|mixed
     */
    public function calculateCashbackCostsPercent()
    {
        $percent = $this->cashbackLevelRepository->getMaxPercent()['maxPercent'];

        if (!$percent) {
            return 0;
        }

        return (float)$percent;
    }

    /**
     * @param string $managerPercentName
     * @return float|int|null
     */
    public function calculateManagerCostsPercent(): float
    {
        $managerPercentProfitHistoryBank = $this->managerPercentProfitHistoryRepository->findOneBy(
            ['percentName' => ManagerPercentProfitHistory::NAME_BANK],
            ['id' => 'DESC']
        );

        $managerPercentProfitHistoryCash = $this->managerPercentProfitHistoryRepository->findOneBy(
            ['percentName' => ManagerPercentProfitHistory::NAME_CASH],
            ['id' => 'DESC']
        );

        if (!$managerPercentProfitHistoryBank || !$managerPercentProfitHistoryCash) {
            if (!$managerPercentProfitHistoryBank && $managerPercentProfitHistoryCash) {
                return $managerPercentProfitHistoryCash->getPercent();
            }

            if ($managerPercentProfitHistoryBank && !$managerPercentProfitHistoryCash) {
                return $managerPercentProfitHistoryBank->getPercent();
            }

            return 0;
        }

        $cashPercent = $managerPercentProfitHistoryBank->getPercent();
        $bankPercent = $managerPercentProfitHistoryCash->getPercent();


        return $cashPercent > $bankPercent ? $cashPercent : $bankPercent;
    }
}
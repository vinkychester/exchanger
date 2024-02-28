<?php


namespace App\Service\CashbackSystem;


use App\Entity\Balance;
use App\Entity\CashbackClientLevel;
use App\Entity\CashbackLevel;
use App\Entity\Client;
use App\Entity\ClientBalance;
use App\Entity\Requisition;
use App\Entity\RequisitionFeeHistory;
use App\Repository\ClientBalanceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

/**
 * Class CashbackRecountBalancesService
 * @package App\Service\CashbackSystem
 */
class CashbackRecountBalancesService
{
    /**
     * @var Requisition
     */
    protected Requisition $requisition;
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * @var ArrayCollection|null $allCashbackLevels
     */
    protected ?ArrayCollection $allCashbackLevels = null;
    /**
     * @var ClientBalanceRepository
     */
    protected ClientBalanceRepository $clientBalanceRepository;

    /**
     * CashbackRecountBalancesService constructor.
     * @param EntityManagerInterface $entityManager
     * @param ClientBalanceRepository $clientBalanceRepository
     */
    public function __construct(EntityManagerInterface $entityManager, ClientBalanceRepository $clientBalanceRepository)
    {
        $this->entityManager = $entityManager;
        $this->clientBalanceRepository = $clientBalanceRepository;
    }

    /**
     * @return ArrayCollection|null
     */
    public function getAllCashbackLevels()
    {
        if (!$this->allCashbackLevels) {
            $results = $this->entityManager
                ->getRepository(CashbackLevel::class)->findBy(['isDefault' => true]);

            if (!count($results)) {
                throw new ResourceNotFoundException('Default Cashback levels not found!');
            }

            $this->allCashbackLevels = new ArrayCollection($results);
        }

        return $this->allCashbackLevels;
    }

    /**
     * @param $requisition
     */
    public function calculateCashbackBalance($requisition)
    {
        $cashbackClientLevels = $requisition->getClient()->getCashbackClientLevels();

        $fullCashbackProfit = 0;
        /** @var CashbackClientLevel $clientCashbackLevel */

        if ($cashbackClientLevels->count()) {
            $clientCashbackLevel = $cashbackClientLevels->filter(
                fn($cashbackClientLevel) => $cashbackClientLevel->getIsCurrent() === true
            )->current();
        }

        if ($clientCashbackLevel) {

            $value = ($requisition->getProfit() * $clientCashbackLevel->getCashbackLevel()->getPercent() / 100);
            $fullCashbackProfit += $value;

            $tag = $requisition->getPair()->getPayment()->getCurrency()->getTag();
            $rate = $this->entityManager->getRepository(RequisitionFeeHistory::class)->findOneBy(['requisition' => $requisition, 'type' => 'payment']);
            $value = $this->convert($tag, $value, $rate->getRate());
            $monthPaymentAmount = $this->convert($tag, $requisition->getPaymentAmount(), $rate->getRate());
            $clientCashbackLevel->setProfit(
                $clientCashbackLevel->getProfit() + $value
            );
            /** @var Client $client */
            $client = $clientCashbackLevel->getClient();
            $this->clientBalanceRepository->setClientBalance(
                $client, Balance::BALANCE_FIELD, $value, '+'
            );
            $this->clientBalanceRepository->setClientBalance(
                $client, ClientBalance::CASHBACK_PROFIT_FIELD, $value, '+'
            );
            $this->clientBalanceRepository->setClientBalance(
                $client, Balance::MONTH_PAYMENT_AMOUNT, $monthPaymentAmount, '+'
            );
            $this->entityManager->persist($clientCashbackLevel);
            $this->entityManager->flush();
        }

        return $fullCashbackProfit;
    }

    /**
     *  Used for change cashback levels for users
     *  @return null
     */
    public function checkingUsersCashbackLevelsByProfit($client)
    {
        $this->getAllCashbackLevels();

//        $clients = $this->entityManager->getRepository(Client::class)->getClientWithRequisition();
//        if (!$clients) {
//            return null;
//        }

        /** @var Client $client */
//        foreach ($clients as $client) {
            /** @var CashbackLevel $cashbackLevel */
            if ($cashbackLevel = $this->checkingClientCashbackLevel($client)) {
                $cashbackClientLevel = $this->entityManager
                    ->getRepository(CashbackClientLevel::class)->createCashbackClientLevelIfNotExist(
                        $client,
                        $cashbackLevel,
                        0,
                        true
                    );
                $this->entityManager
                    ->getRepository(CashbackClientLevel::class)->setActiveCashbackClientLevel($cashbackClientLevel);
            }
//        }
    }

    /**
     * @param Client $client
     * @return false|mixed
     */
    public static function getCurrentCashbackLevel( Client $client)
    {
        $levelCollection = $client->getCashbackClientLevels()->filter(
            function ($cashbackClientLevel) {
                return $cashbackClientLevel->getIsCurrent() === true;
            }
        );

        return $levelCollection->first();
    }

    /**
     * @param Client $client
     * @return ArrayCollection|\Doctrine\ORM\PersistentCollection|false|null
     */
    public static function getAllClientCashbackLevels(Client $client)
    {
        $levelCollection = $client->getCashbackClientLevels();

        if ($levelCollection->count()) {
            return $levelCollection;
        }

        return false;
    }

    /**
     * @param ArrayCollection $levelCollection
     * @param int $levelNum
     * @return false|mixed
     */
    public function getLevelByLevelNumber(iterable $levelCollection, int $levelNum)
    {
        $filteredCollection = $levelCollection->filter(
            function ($localCashbackClientLevel) use ($levelNum) {
                return $localCashbackClientLevel->getCashbackLevel()->getLevel() == $levelNum;
            }
        );

        if ($filteredCollection->count()) {
            return $filteredCollection->first();
        }

        return false;
    }

    /**
     * @param ArrayCollection $levelCollection
     * @param CashbackClientLevel $currentCashbackClientLevel
     * @return false|CashbackClientLevel
     */
    public function getBiggerCashbackClientLevelByCashbackClientLevel(iterable $levelCollection, CashbackClientLevel $currentCashbackClientLevel)
    {
        $filteredCollection = $levelCollection->filter(
            function ($localCashbackClientLevel) use ($currentCashbackClientLevel) {
                return $localCashbackClientLevel->getCashbackLevel()->getLevel() > $currentCashbackClientLevel->getCashbackLevel()->getLevel()
                    && $currentCashbackClientLevel->getProfit() >= $localCashbackClientLevel->getCashbackLevel()->getProfitRangeFrom()
                    && $currentCashbackClientLevel->getProfit() <= $localCashbackClientLevel->getCashbackLevel()->getProfitRangeTo();
            }
        );

        if ($filteredCollection->count()) {
            return $filteredCollection->first();
        }

        return false;
    }

    /**
     * @param iterable $levelCollection
     * @param CashbackClientLevel $currentCashbackClientLevel
     * @return false
     */
    public function getNextCashbackClientLevelByCashbackClientLevel(iterable $levelCollection, CashbackClientLevel $currentCashbackClientLevel)
    {
        $filteredCollection = $levelCollection->filter(
            function ($localCashbackClientLevel) use ($currentCashbackClientLevel) {
                return $localCashbackClientLevel->getCashbackLevel()->getLevel() > $currentCashbackClientLevel->getCashbackLevel()->getLevel();
            }
        );

        if ($filteredCollection->count()) {
            return $filteredCollection->first();
        }

        return false;
    }

    /**
     * @param iterable $cashbackLevels
     * @param CashbackClientLevel $currentCashbackClientLevel
     * @return false
     */
    public function getBiggerCashbackLevelByClientCashbackLevel(
        iterable $cashbackLevels,
        CashbackClientLevel $currentCashbackClientLevel
    )
    {
        $filteredCollection = $cashbackLevels->filter(
            function ($cashbackLevel) use ($currentCashbackClientLevel) {
                return $cashbackLevel->getLevel() > $currentCashbackClientLevel->getCashbackLevel()->getLevel()
                    && $currentCashbackClientLevel->getProfit() >= $cashbackLevel->getProfitRangeFrom()
                    && $currentCashbackClientLevel->getProfit() <= $cashbackLevel->getProfitRangeTo();
            }
        );

        if ($filteredCollection->count()) {
            return $filteredCollection->first();
        }

        return false;
    }

    public function getNextCashbackLevelByClientCashbackLevel(
        iterable $cashbackLevels,
        CashbackClientLevel $currentCashbackClientLevel
    )
    {
        $filteredCollection = $cashbackLevels->filter(
            function ($cashbackLevel) use ($currentCashbackClientLevel) {
                return $cashbackLevel->getLevel() > $currentCashbackClientLevel->getCashbackLevel()->getLevel();
            }
        );

        if ($filteredCollection->count()) {
            return $filteredCollection->first();
        }

        return false;
    }

    /**
     * @param ArrayCollection $cashbackLevels
     * @param $levelNum
     * @return false|mixed
     */
    public function getSmallerCashbackLevelByClientCashbackLevel(
        ArrayCollection $cashbackLevels,
        $levelNum
    )
    {
        $filteredCollection = $cashbackLevels->filter(
            function ($cashbackLevel) use ($levelNum) {
                return $cashbackLevel->getLevel() == $levelNum;
            }
        );

        if ($filteredCollection->count()) {
            return $filteredCollection->first();
        }

        return false;
    }

    /**
     * @param Client $client
     * @return object|null
     */
    public function checkingClientCashbackLevel( Client $client)
    {
        if ($currentCashbackClientLevel = $this->getCurrentCashbackLevel($client)) {

            if ($monthPaymentAmount = $this->entityManager->getRepository(ClientBalance::class)->findOneBy(['user' => $client, 'field' => Balance::MONTH_PAYMENT_AMOUNT])) {
                $cashbackLevel = $currentCashbackClientLevel->getCashbackLevel();

                if ($monthPaymentAmount->getValue() >= $cashbackLevel->getProfitRangeFrom() && $monthPaymentAmount->getValue() < $cashbackLevel->getProfitRangeTo()) {
                    $checkedCashbackLevel = $currentCashbackClientLevel->getCashbackLevel();
                }

                if ($monthPaymentAmount->getValue() < $cashbackLevel->getProfitRangeFrom() && $cashbackLevel->getLevel() > 1) {
                    $checkedCashbackLevel = $this->needCashBackLevel($cashbackLevel->getLevel());
                }

                if ($monthPaymentAmount->getValue() > $cashbackLevel->getProfitRangeTo()) {
                    $checkedCashbackLevel = $this->needCashBackLevel($cashbackLevel->getLevel(), $monthPaymentAmount->getValue() );
                }

                $monthPaymentAmount->setValue(0);
                $this->entityManager->persist($monthPaymentAmount);
                $this->entityManager->flush();
            }
        }


        return $checkedCashbackLevel ?? null;
    }

    /**
     * @param Client $client
     * @return CashbackLevel|null
     */
    public function decreaseCashbackLevel(Client $client): ?CashbackLevel
    {
        $this->getAllCashbackLevels();

        /** @var CashbackClientLevel $currentCashbackClientLevel */
        if (!$currentCashbackClientLevel = $this->getCurrentCashbackLevel($client)) {
            return null;
        }

        if ($currentCashbackClientLevel->getCashbackLevel()->getLevel() === 1) {
            return $currentCashbackClientLevel->getCashbackLevel();
        }

        $searchLevelInt = $currentCashbackClientLevel->getCashbackLevel()->getLevel() - 1;

        /** search by client`s levels */
        if ($clientCashbackLevels = $client->getCashbackClientLevels()) {
            if ($clientLevelsCollection = $this->getLevelByLevelNumber(
                $clientCashbackLevels,
                $searchLevelInt
            )) {
                return $clientLevelsCollection->getCashbackLevel();
            }
        }

        /** search by default levels */
        if ($defaultLevelsCollection = $this->getSmallerCashbackLevelByClientCashbackLevel(
                $this->allCashbackLevels,
                $searchLevelInt
            )) {
            return $defaultLevelsCollection;
        }

        /** return default level */
        return $currentCashbackClientLevel->getCashbackLevel();
    }

    /**
     * @param $client
     * @return CashbackLevel
     */
    public function increaseCashbackLevel($client): CashbackLevel
    {
        $this->getAllCashbackLevels();

        $currentCashbackClientLevel = self::getCurrentCashbackLevel($client);
        /** @var CashbackClientLevel $currentCashbackClientLevel */
        $biggestDefaultLevel = $this->entityManager->getRepository(CashbackLevel::class)->getBiggestDefaultLevel();
        if ($currentCashbackClientLevel->getCashbackLevel()->getLevel() === (int)$biggestDefaultLevel) {
            return $currentCashbackClientLevel->getCashbackLevel();
        }

        $increasedCashbackLevel = null;

        /** search by client`s levels */
        if ($clientCashbackLevels = $this->getAllClientCashbackLevels($client)) {
            if ($clientLevelsCollection = $this->getBiggerCashbackClientLevelByCashbackClientLevel(
                $clientCashbackLevels,
                $currentCashbackClientLevel
            )) {
                return $clientLevelsCollection->getCashbackLevel();
            }
        }

        /** search by default levels */
        if ($defaultLevelsCollection = $this->getBiggerCashbackLevelByClientCashbackLevel(
            $this->allCashbackLevels,
            $currentCashbackClientLevel
        )) {
            return $defaultLevelsCollection;
        }

        return $currentCashbackClientLevel->getCashbackLevel();
    }

    /**
     * @param $client
     * @return CashbackLevel
     */
    public function getNextCashbackLevel($client): ?CashbackLevel
    {
        $this->getAllCashbackLevels();

        $currentCashbackClientLevel = self::getCurrentCashbackLevel($client);
        /** @var CashbackClientLevel $currentCashbackClientLevel */
        $biggestDefaultLevel = $this->entityManager->getRepository(CashbackLevel::class)->getBiggestDefaultLevel();
        if ($currentCashbackClientLevel->getCashbackLevel()->getLevel() === (int)$biggestDefaultLevel) {
            return null;
        }

        $increasedCashbackLevel = null;

        /** search by client`s levels */
        if ($clientCashbackLevels = $this->getAllClientCashbackLevels($client)) {
            if ($clientLevelsCollection = $this->getNextCashbackClientLevelByCashbackClientLevel(
                $clientCashbackLevels,
                $currentCashbackClientLevel
            )) {
                return $clientLevelsCollection->getCashbackLevel();
            }
        }

        /** search by default levels */
        if ($defaultLevelsCollection = $this->getNextCashbackLevelByClientCashbackLevel(
            $this->allCashbackLevels,
            $currentCashbackClientLevel
        )) {
            return $defaultLevelsCollection;
        }

        return null;
    }

    /**
     * @param $tag
     * @param $profit
     * @param $rate
     * @return float
     */
    public function convert($tag, $profit, $rate): float
    {
        return ($tag === "CRYPTO" ? (($profit * $rate) * 100 / 100 ): (($profit / $rate) * 100) / 100);
    }

    /**
     * @param $level
     * @param null $amount
     * @return object|null
     */
    protected function needCashBackLevel($level, $amount = null): ?object
    {
        $cashbackLevelRepository = $this->entityManager->getRepository(CashbackLevel::class);
        if ($amount) {
            return $cashbackLevelRepository->getCashBackLevelByAmount($amount);
        }

        return $cashbackLevelRepository->findOneBy(['level' => $level - 1, 'isActive' => true, 'isDefault' => true]);
    }

}

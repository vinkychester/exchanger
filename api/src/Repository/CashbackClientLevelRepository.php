<?php

namespace App\Repository;

use App\Entity\CashbackClientLevel;
use App\Entity\CashbackLevel;
use App\Entity\Client;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method CashbackClientLevel|null find($id, $lockMode = null, $lockVersion = null)
 * @method CashbackClientLevel|null findOneBy(array $criteria, array $orderBy = null)
 * @method CashbackClientLevel[]    findAll()
 * @method CashbackClientLevel[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CashbackClientLevelRepository extends ServiceEntityRepository
{
    /**
     * CashbackClientLevelRepository constructor.
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CashbackClientLevel::class);
    }

    public function checkExistingCashbackClientLevel(Client $client, CashbackLevel $cashbackLevel) {
        return $this->createQueryBuilder('ccl')
            ->innerJoin('ccl.cashbackLevel', 'cl')
            ->where('cl.level = :levelCashbackLevel')
            ->andWhere('ccl.client = :client')
            ->setParameter('levelCashbackLevel', $cashbackLevel->getLevel())
            ->setParameter('client', $client)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @param $levelCashbackLevel
     * @param $idCashbackLevel
     * @param array $allCashbackLevelsByLevel
     * @return int|mixed|string
     */
    public function updateLevelForALlClients($idCashbackLevel, array $allCashbackLevelsByLevel)
    {
        $qb = $this->createQueryBuilder('cashbackClientLevel');
        return $qb->update()
            ->where(
                $qb->expr()->In(
                    'cashbackClientLevel.cashbackLevel',
                    $allCashbackLevelsByLevel
                )
            )
            ->set('cashbackClientLevel.cashbackLevel', $idCashbackLevel)
            ->set('cashbackClientLevel.isCurrent', true)
            ->getQuery()
            ->execute();
    }

    /**
     * @return int|mixed|string
     */
    public function deactivateAllCashbackClientLevels()
    {
        $qb = $this->createQueryBuilder('cashbackClientLevel');

        return $qb->update()
            ->set('cashbackClientLevel.isCurrent', 'false')
            ->getQuery()
            ->execute();
    }

    /**
     * @param $cashbackLevel
     * @param array $clients
     * @param $isCurrent
     * @return bool
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function createCashbackLevelForAllClients($cashbackLevel, array $clients, $isCurrent)
    {
        foreach ($clients as $client) {
            $clientCashbackLevel = $this->findOneBy(
                [
                    'isCurrent' => true,
                    'client'    => $client
                ]
            );

            if (!$clientCashbackLevel) {
                $this->createCashbackClientLevelIfNotExist(
                    $client,
                    $cashbackLevel,
                    0,
                    $isCurrent
                );
            }
        }

        return true;
    }

    /**
     * @param Client $client
     * @param CashbackLevel $cashbackLevel
     * @param int $profit
     * @param bool $isCurrent
     * @return null
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function createCashbackClientLevelIfNotExist(Client $client, CashbackLevel $cashbackLevel, $profit = 0, $isCurrent = false)
    {
        if ($existCashbackClientLevel = $this->checkExistingCashbackClientLevel($client, $cashbackLevel)) {
            return $existCashbackClientLevel;
        }

        /** @var CashbackClientLevel $newCashbackClientLevel */
        $newCashbackClientLevel = $this->createCashbackClientLevel($client, $cashbackLevel, $profit, $isCurrent);

        return $newCashbackClientLevel;
    }

    /**
     * @param $client
     * @param $cashbackLevel
     * @param int $profit
     * @param bool $isCurrent
     * @return CashbackClientLevel
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function createCashbackClientLevel($client, $cashbackLevel, $profit = 0, $isCurrent = false)
    {
        $cashbackClientLevel = new CashbackClientLevel();

        $cashbackClientLevel->setClient($client);
        $cashbackClientLevel->setCashbackLevel($cashbackLevel);
        $cashbackClientLevel->setProfit($profit);
        $cashbackClientLevel->setIsCurrent($isCurrent);

        $this->getEntityManager()->persist($cashbackClientLevel);
        $this->getEntityManager()->flush();

        return $cashbackClientLevel;
    }

    /**
     * @param CashbackClientLevel $cashbackClientLevel
     * @return bool|null
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function setActiveCashbackClientLevel(CashbackClientLevel $cashbackClientLevel)
    {
        $clientCashbackClientLevels = $this->findBy([
            "client" => $cashbackClientLevel->getClient()
        ]);
        if(!$clientCashbackClientLevels) {
            return null;
        }

        foreach ($clientCashbackClientLevels as $clientCashbackClientLevel) {
            if ($clientCashbackClientLevel === $cashbackClientLevel) {
                $clientCashbackClientLevel->setIsCurrent(true);
            } else {
                $clientCashbackClientLevel->setIsCurrent(false);
            }

            $this->getEntityManager()->persist($clientCashbackClientLevel);
        }

        $this->getEntityManager()->flush();

        return true;
    }

    /**
     * @return int|mixed|string
     */
    public function getAllCurrentCashbackClientLevelsId()
    {
        return $this->createQueryBuilder('ccl')
            ->select('cashbackLevel.id')
            ->innerJoin('ccl.cashbackLevel', 'cashbackLevel')
            ->where("ccl.isCurrent = true")
            ->distinct()
            ->getQuery()
            ->getResult();
    }

    public function updateCashbackLevel(Client $client, CashbackLevel $cashbackLevel)
    {
       $exist = $this->checkExistingCashbackClientLevel($client, $cashbackLevel);
       if (!$exist) {
           $clientCashbackLevel = new CashbackClientLevel();
           $clientCashbackLevel->setCashbackLevel($cashbackLevel)
               ->setIsCurrent(true)
               ->setClient($client);
       }
    }
}

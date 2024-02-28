<?php

namespace App\Repository;

use App\Entity\CashbackLevel;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method CashbackLevel|null find($id, $lockMode = null, $lockVersion = null)
 * @method CashbackLevel|null findOneBy(array $criteria, array $orderBy = null)
 * @method CashbackLevel[]    findAll()
 * @method CashbackLevel[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CashbackLevelRepository extends ServiceEntityRepository
{
    /**
     * CashbackLevelRepository constructor.
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CashbackLevel::class);
    }

    /**
     * @param $levelCashbackLevel
     * @return int|mixed[]|string
     */
    public function getAllCashbackLevelsByLevel($levelCashbackLevel)
    {
        return $this->createQueryBuilder('cashbackLevel')
            ->select('cashbackLevel.id')
            ->where('cashbackLevel.level = ' . $levelCashbackLevel)
            ->getQuery()
            ->getResult();
    }

    /**
     * @return int|mixed|string
     * @throws \Doctrine\ORM\NoResultException
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getMaxPercent()
    {
        return $this->createQueryBuilder('cashbackLevel')
            ->select('MAX(cashbackLevel.percent) AS maxPercent')
            ->distinct()
            ->getQuery()
            ->getSingleResult();
    }

    /**
     * @param $level
     * @return int|mixed|string
     */
    public function getDefaultCashbackLevelByLevel($level)
    {
        return $this->createQueryBuilder('cashbackLevel')
            ->where("cashbackLevel.level = :level")
            ->andWhere("cashbackLevel.isDefault = true")
            ->andWhere("cashbackLevel.isActive = true")
            ->setParameter('level', $level)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @param $level
     * @return int|mixed|string
     */
    public function getDefaultCashbackLevels()
    {
        return $this->createQueryBuilder('cashbackLevel')
            ->andWhere("cashbackLevel.isDefault = true")
            ->andWhere("cashbackLevel.isActive = true")
            ->getQuery()
            ->getResult();
    }

    /**
     * @param $level
     * @return int|mixed|string
     */
    public function updateDefaultLevelsToNotDefault($level)
    {
        return $this->createQueryBuilder('cashbackLevel')
            ->update()
            ->set('cashbackLevel.isActive', 'false')
            ->where("cashbackLevel.level = :level")
            ->andWhere("cashbackLevel.isDefault = true")
            ->setParameter('level', $level)
            ->getQuery()
            ->execute();
    }

    /**
     * @param array $allCurrentCashbackClientLevelsId
     * @return int|mixed|string
     */
    public function activateAllUsedCashbackLevels(array $allCurrentCashbackClientLevelsId)
    {
        if(count($allCurrentCashbackClientLevelsId)) {

            $allNotUsedCashbackLevels = array_column(
                (array)$this->getAllNotUsedCashbackLevels($allCurrentCashbackClientLevelsId),
                'id'
            );

            if(count($allNotUsedCashbackLevels) && $this->activateCashbackLevels($allNotUsedCashbackLevels)) {
                return true;
            }

        }

        return false;
    }

    /**
     * @param array $allNotUsedCashbackLevels
     * @return int|mixed|string
     */
    public function activateCashbackLevels(array $allNotUsedCashbackLevels)
    {
        $qb = $this->createQueryBuilder('cashbackLevel');

        return $qb->update()
            ->set('cashbackLevel.isActive', 'true')
            ->where('cashbackLevel.isDefault != true')
            ->andWhere(
                $qb->expr()->NotIn(
                    'cashbackLevel.id',
                    $allNotUsedCashbackLevels
                )
            )
            ->getQuery()
            ->execute();
    }


    /**
     * @param array $allCurrentCashbackClientLevelsId
     * @return int|mixed|string
     */
    public function deactivateAllNotUsedCashbackLevels(array $allCurrentCashbackClientLevelsId)
    {
        if(count($allCurrentCashbackClientLevelsId)) {

            $allNotUsedCashbackLevels = array_column(
                (array)$this->getAllNotUsedCashbackLevels($allCurrentCashbackClientLevelsId),
                'id'
            );

            if(count($allNotUsedCashbackLevels) && $this->deactivateCashbackLevels($allNotUsedCashbackLevels)) {
                return true;
            }

        }

        return false;
    }

    /**
     * @param array $cashbackLevelsId
     * @return int|mixed|string
     */
    public function deactivateCashbackLevels(array $cashbackLevelsId)
    {
        $qb = $this->createQueryBuilder('cashbackLevel');

        return $qb->update()
            ->set('cashbackLevel.isActive', 'false')
            ->set('cashbackLevel.isDefault', 'false')
            ->where('cashbackLevel.isDefault != true')
            ->andWhere(
                $qb->expr()->In(
                    'cashbackLevel.id',
                    $cashbackLevelsId
                )
            )
            ->getQuery()
            ->execute();
    }

    /**
     * @param $cashbackLevelID
     * @return int|mixed|string
     */
    public function setDefaultCashbackLevel($cashbackLevelID)
    {
        return $this->createQueryBuilder('cashbackLevel')
            ->update()
            ->set('cashbackLevel.isActive', 'true')
            ->set('cashbackLevel.isDefault', 'true')
            ->where("cashbackLevel.id = :cashbackLevelID")
            ->setParameter('cashbackLevelID', $cashbackLevelID)
            ->getQuery()
            ->execute();
    }

    /**
     * @return mixed
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getBiggestDefaultLevel()
    {
        return $this->createQueryBuilder('cashbackLevel')
                   ->where("cashbackLevel.isDefault = true")
                   ->where("cashbackLevel.isActive = true")
                   ->select('MAX(cashbackLevel.level)')
                   ->getQuery()
                   ->getOneOrNullResult()[1];
    }

    /**
     * @param array $allCurrentCashbackClientLevelsIds
     * @return string
     */
    public function getAllNotUsedCashbackLevels(array $allCurrentCashbackClientLevelsIds)
    {
        $qb = $this->createQueryBuilder('cashbackLevel');

        return $qb->select('cashbackLevel.id')
            ->where($qb->expr()->notIn('cashbackLevel.id', $allCurrentCashbackClientLevelsIds))
            ->getQuery()
            ->getResult();
    }

    /**
     * @param $level
     * @param $amount
     * @return int|mixed|string|null
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getCashBackLevelByAmount($amount)
    {
        $qb = $this->createQueryBuilder('cashbackLevel');

        return $qb
            ->where('cashbackLevel.isDefault = :default')
            ->andWhere('cashbackLevel.profitRangeFrom <= :amount')
            ->andWhere('cashbackLevel.profitRangeTo >= :amount')
            ->setParameters(
                [
                    'amount'  => $amount,
                    'default' => true
                ]
            )
            ->getQuery()
            ->getOneOrNullResult();
    }
}

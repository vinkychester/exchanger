<?php

namespace App\Repository;

use App\Entity\ReferralLevel;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ReferralLevel|null find($id, $lockMode = null, $lockVersion = null)
 * @method ReferralLevel|null findOneBy(array $criteria, array $orderBy = null)
 * @method ReferralLevel[]    findAll()
 * @method ReferralLevel[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ReferralLevelRepository extends ServiceEntityRepository
{
    /**
     * ReferralLevelRepository constructor.
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ReferralLevel::class);
    }

    /**
     * @param $level
     * @return int|mixed|string
     */
    public function getMaxLevelsPercents()
    {
        return $this->createQueryBuilder('referralLevel')
            ->select('referralLevel.level AS level, MAX(referralLevel.percent) AS maxPercent')
            ->distinct()
            ->groupBy('level')
            ->getQuery()
            ->getResult();
    }

    /**
     * @param $level
     * @return int|mixed|string
     */
    public function getDefaultReferralLevelsByLevel($level)
    {
        return $this->createQueryBuilder('referralLevel')
            ->where("referralLevel.level = :level")
            ->andWhere("referralLevel.isDefault = true")
            ->andWhere("referralLevel.isActive = true")
            ->setParameter('level', $level)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @param $level
     * @return int|mixed|string
     */
    public function setNotDefaultForDefaultLevels($level)
    {
        return $this->createQueryBuilder('referralLevel')
            ->update()
            ->set('referralLevel.isActive', 'false')
            ->where("referralLevel.level = :level")
            ->andWhere("referralLevel.isDefault = true")
            ->setParameter('level', $level)
            ->getQuery()
            ->execute();
    }

    /**
     * @param $referralLevelID
     * @return int|mixed|string
     */
    public function setDefaultReferralLevel($referralLevelID)
    {
        return $this->createQueryBuilder('referralLevel')
            ->update()
            ->set('referralLevel.isActive', 'true')
            ->set('referralLevel.isDefault', 'true')
            ->where("referralLevel.id = :referralLevelID")
            ->setParameter('referralLevelID', $referralLevelID)
            ->getQuery()
            ->execute();
    }

    /**
     * @return mixed
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getBiggestDefaultLevel()
    {
        return $this->createQueryBuilder('referralLevel')
                   ->where("referralLevel.isDefault = true")
                   ->where("referralLevel.isActive = true")
                   ->select('MAX(referralLevel.level)')
                   ->getQuery()
                   ->getOneOrNullResult()[1];
    }

    /**
     * @return string
     */
    public function activateUsedReferralLevelsSQL(): string
    {
        return "
            UPDATE referral_level
            SET referral_level.is_active = true
            WHERE referral_level.is_default != true
            AND referral_level.is_active != true
            AND referral_level.id IN (SELECT referralLevel3.id FROM (" . $this->getAllUsedReferralLevelsSQL() . " ) as referralLevel3)
        ";
    }

    /**
     * @return string
     */
    public function deactivateNotUsedReferralLevelsSQL()
    {
        return "
            UPDATE referral_level
            SET referral_level.is_active = false, referral_level.is_default = false
            WHERE referral_level.is_default != true
            AND referral_level.id IN (SELECT referralLevel3.id FROM (" . $this->getAllNotUsedReferralLevelsSQL() . " ) as referralLevel3)
        ";
    }

    /**
     * @return string
     */
    public function getAllNotUsedReferralLevelsSQL(): string
    {
        return '
            SELECT referralLevel.id
            FROM referral_level referralLevel
            WHERE referralLevel.id NOT IN (' . $this->getAllReferralClientLevelsIdSQL() . ')
        ';
    }

    /**
     * @return string
     */
    public function getAllUsedReferralLevelsSQL(): string
    {
        return '
            SELECT referralLevel.id
            FROM referral_level referralLevel
            WHERE referralLevel.id IN (' . $this->getAllReferralClientLevelsIdSQL() . ')
        ';
    }

    /**
     * @return string
     */
    public function getAllReferralClientLevelsIdSQL()
    {
        return '
            SELECT DISTINCT (referralClientLevel1.referral_level_id)
            FROM referral_client_level referralClientLevel1
        ';
    }
}

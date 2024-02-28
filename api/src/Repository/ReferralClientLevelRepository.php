<?php

namespace App\Repository;

use App\Entity\Client;
use App\Entity\ReferralClientLevel;
use App\Entity\ReferralLevel;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ReferralClientLevel|null find($id, $lockMode = null, $lockVersion = null)
 * @method ReferralClientLevel|null findOneBy(array $criteria, array $orderBy = null)
 * @method ReferralClientLevel[]    findAll()
 * @method ReferralClientLevel[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ReferralClientLevelRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ReferralClientLevel::class);
    }

    /**
     * @param $referralLevel
     * @param array $clients
     * @return bool
     */
    public function createReferralLevelForAllClients($referralLevel, array $clients)
    {
        foreach ($clients as $client) {
            $clientReferralLevel = $this->findOneBy(
                [
                    'isCurrent' => true,
                    'client'    => $client
                ]
            );

            if (!$clientReferralLevel) {
                $this->createReferralClientLevelIfNotExist(
                    $client,
                    $referralLevel
                );
            }
        }

        return true;
    }

    /**
     * @param Client $client
     * @param ReferralLevel $referralLevel
     * @param int $profit
     * @return ReferralClientLevel|int|mixed|string|null
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function createReferralClientLevelIfNotExist(Client $client, ReferralLevel $referralLevel, $profit = 0)
    {
        if ($existReferralClientLevel = $this->checkExistingReferralClientLevel($client, $referralLevel)) {

            return $existReferralClientLevel;
        }

        /** @var ReferralClientLevel $newReferralClientLevel */
        $newReferralClientLevel = $this->createReferralClientLevel($client, $referralLevel, $profit, true);

        return $newReferralClientLevel;
    }

    /**
     * @param $client
     * @param $referralLevel
     * @param int $profit
     * @param bool $isCurrent
     * @return ReferralClientLevel
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function createReferralClientLevel($client, $referralLevel, $profit = 0, $isCurrent = false): ?ReferralClientLevel
    {
        $referralClientLevel = new ReferralClientLevel();

        $referralClientLevel->setClient($client);
        $referralClientLevel->setReferralLevel($referralLevel);
        $referralClientLevel->setProfit($profit);
        $referralClientLevel->setIsCurrent($isCurrent);

        $this->_em->persist($referralClientLevel);
        $this->_em->flush();

        return $referralClientLevel;
    }

    /**
     * @param Client $client
     * @param ReferralLevel $referralLevel
     * @return int|mixed|string|null
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function checkExistingReferralClientLevel(Client $client, ReferralLevel $referralLevel) {

        return $this->createQueryBuilder('rcl')
            ->innerJoin('rcl.referralLevel', 'rl')
            ->where('rl.level = :levelReferralLevel')
            ->andWhere('rcl.client = :client')
            ->andWhere("rcl.isCurrent = 'true'")
            ->setParameter('levelReferralLevel', $referralLevel->getLevel())
            ->setParameter('client', $client)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @param $client
     * @return mixed
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getBiggestClientLevel($client)
    {
        return $this->createQueryBuilder('clientReferralLevel')
                   ->innerJoin(
                       ReferralLevel::class,
                       'referralLevel',
                       Join::WITH,
                       'referralLevel.id = clientReferralLevel.referralLevel'
                   )
                   ->where("clientReferralLevel.client = :clientId")
                   ->select('MAX(referralLevel.level)')
                   ->setParameter(':clientId', $client->getId())
                   ->getQuery()
                   ->getOneOrNullResult()[1];
    }

    /**
     * @param $clientId
     * @param $levelReferralLevel
     * @return int|mixed|string|null
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getClientReferralLevelByLevelReferralLevel($clientId, $levelReferralLevel)
    {
        $qb = $this->createQueryBuilder('rcl');

        return $qb
            ->select('rcl')
            ->innerJoin('rcl.referralLevel', 'rl')
            ->where('rcl.client = :client')
            ->andWhere('rl.level = :level')
            ->setParameter('client', $clientId)
            ->setParameter('level', $levelReferralLevel)
            ->getQuery()
            ->getOneOrNullResult();
    }


    /**
     * @param $clientsLevelsSQL
     * @param $referralLevelID
     * @return string
     * clientsLevelsSQL can be getClientVipLevelsSQL or getClientNotVipLevelsSQL
     */
    public function updateLevelForAllSelectedClientsLevelsSQL($clientsLevelsSQL, $referralLevelID)
    {
        return "
            UPDATE referral_client_level
            SET referral_level_id = " . $referralLevelID . "            
            WHERE id IN (SELECT clientVipLevel.id FROM (" . $clientsLevelsSQL . " ) as clientVipLevel)
        ";
    }

    /**
     * @param $levelReferralLevel
     * @param $referralLevelID
     * @return string
     */
    public function updateLevelForNotVipClientsSQL($levelReferralLevel, $referralLevelID)
    {
        return "
            UPDATE referral_client_level
            SET referral_level_id = " . $referralLevelID . "                        
            WHERE id IN (SELECT clientNotVipLevel.id FROM (" . $this->getClientNotVipLevelsSQL($levelReferralLevel) . " ) as clientNotVipLevel)
        ";
    }

    /**
     * @param $levelReferralLevel
     * @return string
     */
    public function getClientVipLevelsSQL($levelReferralLevel)
    {
        return '
            SELECT referralClientLevel1.id
            FROM referral_client_level referralClientLevel1
            INNER JOIN referral_level referralLevel1 ON referralClientLevel1.referral_level_id = referralLevel1.id
            WHERE referralClientLevel1.referral_level_id NOT IN (' . $this->getDefaultReferralLevelByLevelSQL(
                $levelReferralLevel
            ) . ')
            AND referralLevel1.level IN(' . $this->getDefaultReferralLevelByLevelSQL($levelReferralLevel) . ')
        ';
    }

    /**
     * @param $levelReferralLevel
     * @return string
     */
    public function getClientNotVipLevelsSQL($levelReferralLevel)
    {
        return '
            SELECT referralClientLevel1.id
            FROM referral_client_level referralClientLevel1
            INNER JOIN referral_level referralLevel1 ON referralClientLevel1.referral_level_id = referralLevel1.id
            WHERE referralClientLevel1.referral_level_id IN (' . $this->getDefaultReferralLevelByLevelSQL(
                $levelReferralLevel
            ) . ')
            AND referralLevel1.level IN(' . $levelReferralLevel . ')
        ';
    }

    /**
     * @param $levelReferralLevel
     * @return string
     */
    public function getDefaultReferralLevelByLevelSQL($levelReferralLevel)
    {
        return '
            SELECT referralLevel1.id
            FROM referral_level referralLevel1
            WHERE referralLevel1.is_default = true
            AND referralLevel1.level = ' . $levelReferralLevel . '
        ';
    }
}

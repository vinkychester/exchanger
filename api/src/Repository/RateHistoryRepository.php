<?php

namespace App\Repository;

use App\Entity\RateHistory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

use function Doctrine\ORM\QueryBuilder;

/**
 * @method RateHistory|null find($id, $lockMode = null, $lockVersion = null)
 * @method RateHistory|null findOneBy(array $criteria, array $orderBy = null)
 * @method RateHistory[]    findAll()
 * @method RateHistory[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RateHistoryRepository extends ServiceEntityRepository
{
    /**
     * RateHistoryRepository constructor.
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RateHistory::class);
    }

    /**
     * @param $pairUnit
     * @param $timestampBefore
     * @return RateHistory|null
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getRateByTimeStamp($pairUnit, $timestampBefore)
    {
        $queryBuilder = $this->createQueryBuilder('rateHistory');

        return $queryBuilder
            ->Where($queryBuilder->expr()->andX(
                $queryBuilder->expr()->eq('rateHistory.currencyAsset', ':currencyAsset'),
                $queryBuilder->expr()->eq('rateHistory.serviceName', ':serviceName'),
                'rateHistory.lastUpdate >= :lastUpdate',
            ))
            ->setParameter('currencyAsset', $pairUnit->getCurrency()->getAsset())
            ->setParameter('serviceName', $pairUnit->getService()->getName())
            ->setParameter('lastUpdate', $timestampBefore)
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @param string $currencyAsset
     * @param string $serviceName
     * @return RateHistory|null
     */
    public function getRateByCurrencyAsset(string $currencyAsset, string $serviceName): ?RateHistory
    {
        return $this->findOneBy(
            [
                'currencyAsset' => $currencyAsset,
                'serviceName'   => $serviceName
            ],
            ['id' => 'DESC']
        );
    }
}

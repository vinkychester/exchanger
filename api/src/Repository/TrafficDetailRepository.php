<?php

namespace App\Repository;

use App\Entity\TrafficDetail;
use App\Entity\TrafficLink;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method TrafficDetail|null find($id, $lockMode = null, $lockVersion = null)
 * @method TrafficDetail|null findOneBy(array $criteria, array $orderBy = null)
 * @method TrafficDetail[]    findAll()
 * @method TrafficDetail[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TrafficDetailRepository extends ServiceEntityRepository
{
    /**
     * TrafficDetailRepository constructor.
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TrafficDetail::class);
    }

    /**
     * @param $trafficDetail
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function save($trafficDetail)
    {
        $this->getEntityManager()->persist($trafficDetail);
        $this->getEntityManager()->flush();
    }

    /**
     * @param TrafficLink $site
     * @param $clientIp
     * @return mixed
     */
    public function findTrafficDetails(TrafficLink $site, $clientIp)
    {
        return $this->findBy(['trafficLink' => $site, 'ip' => $clientIp]);
    }

    /**
     * @param array $args
     * @param string $token
     * @return mixed|null
     */
    public function getFilteredTrafficLinks(array $args, string $token)
    {
        return $this->createQueryBuilder('td')
            ->join('td.trafficLink', 'trafficLink')
            ->andWhere('trafficLink.token = :token')
            ->setParameter('token', $token)
            ->andWhere('td.createdAt >= :dateFrom')
            ->andWhere('td.createdAt <= :dateTo')
            ->setParameter('dateFrom', strtotime($args['tdate_gte']))
            ->setParameter('dateTo', strtotime($args['tdate_lte'])+24*3600)
            ->getQuery()->getResult();
    }
}

<?php

namespace App\Repository;

use App\Entity\TrafficLink;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method TrafficLink|null find($id, $lockMode = null, $lockVersion = null)
 * @method TrafficLink|null findOneBy(array $criteria, array $orderBy = null)
 * @method TrafficLink[]    findAll()
 * @method TrafficLink[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TrafficLinkRepository extends ServiceEntityRepository
{
    /**
     * TrafficRepository constructor.
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TrafficLink::class);
    }

    /**
     * @param TrafficLink $traffic
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function save(TrafficLink $traffic): void
    {
        $this->getEntityManager()->persist($traffic);
        $this->getEntityManager()->flush();
    }

    /**
     * @param $token
     * @return TrafficLink|null
     */
    public function findTrafficLinkByToken($token)
    {
        return $this->findOneBy(['token' => $token]);
    }

    /**
     * @param $args
     * @return int|mixed|string
     */
    public function getTrafficLinks($args)
    {
        $queryBuilder = $this->createQueryBuilder('t');
        if (!empty($args['siteName'])) {
            $queryBuilder
                ->andWhere("t.siteName LIKE :name")
                ->setParameter('name', '%' . $args['siteName'] . '%');
        }
        return $queryBuilder->orderBy('t.createdAt', 'DESC')
            ->getQuery()->getResult();
    }
}

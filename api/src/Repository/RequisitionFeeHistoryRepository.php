<?php

namespace App\Repository;

use App\Entity\RequisitionFeeHistory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method RequisitionFeeHistory|null find($id, $lockMode = null, $lockVersion = null)
 * @method RequisitionFeeHistory|null findOneBy(array $criteria, array $orderBy = null)
 * @method RequisitionFeeHistory[]    findAll()
 * @method RequisitionFeeHistory[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RequisitionFeeHistoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RequisitionFeeHistory::class);
    }

    /**
     * @param $id
     * @param $rateType
     * @return QueryBuilder
     */
    public function getQueryBuilderRateForStatistics($id, $rateType): QueryBuilder
    {
        return $this->createQueryBuilder('requisitionFeeHistory')
            ->select('requisitionFeeHistory.rate')
            ->addSelect('requisitionFeeHistory.percent')
            ->addSelect('requisitionFeeHistory.constant')
            ->andWhere('requisitionFeeHistory.requisition = :id')
            ->setParameter('id', $id)
            ->andWhere('requisitionFeeHistory.type = :rateType')
            ->setParameter('rateType', $rateType);
    }
}

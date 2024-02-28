<?php

namespace App\Repository;

use App\Entity\Currency;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Currency|null find($id, $lockMode = null, $lockVersion = null)
 * @method Currency|null findOneBy(array $criteria, array $orderBy = null)
 * @method Currency[]    findAll()
 * @method Currency[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CurrencyRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Currency::class);
    }

    /**
     * @param $asset
     * @param $rateType
     * @return QueryBuilder
     */
    public function getQueryBuilderCourseForStatistics($asset, $rateType): QueryBuilder
    {
        return $this->createQueryBuilder('currency')
            ->select('currency.' . $rateType)
            ->andWhere('currency.asset = :asset')
            ->setParameter('asset', $asset);
    }
}

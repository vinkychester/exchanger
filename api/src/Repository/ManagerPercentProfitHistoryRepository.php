<?php

namespace App\Repository;

use App\Entity\ManagerPercentProfitHistory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ManagerPercentProfitHistory|null find($id, $lockMode = null, $lockVersion = null)
 * @method ManagerPercentProfitHistory|null findOneBy(array $criteria, array $orderBy = null)
 * @method ManagerPercentProfitHistory[]    findAll()
 * @method ManagerPercentProfitHistory[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ManagerPercentProfitHistoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ManagerPercentProfitHistory::class);
    }

    /**
     * @param $manager
     * @param $percent
     * @param $percentName
     * @return ManagerPercentProfitHistory
     */
    public function createManagerPercentProfitHistory($manager, $percent, $percentName)
    {
        $newManagerPercent = new ManagerPercentProfitHistory();

        $newManagerPercent->setManager($manager);
        $newManagerPercent->setPercent($percent);
        $newManagerPercent->setPercentName($percentName);

        return $newManagerPercent;
    }
}

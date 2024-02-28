<?php

namespace App\Repository;

use App\Entity\Manager;
use App\Entity\ManagerBalance;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ManagerBalance|null find($id, $lockMode = null, $lockVersion = null)
 * @method ManagerBalance|null findOneBy(array $criteria, array $orderBy = null)
 * @method ManagerBalance[]    findAll()
 * @method ManagerBalance[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ManagerBalanceRepository extends ServiceEntityRepository
{
    /**
     * ManagerBalanceRepository constructor.
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ManagerBalance::class);
    }

    /**
     * @param Manager $manager
     * @param $field
     * @param $value
     * @param null $operation
     * @return ManagerBalance
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function setManagerBalance(Manager $manager, $field, $value, $operation = null): ManagerBalance
    {
        $managerFieldBalance = $this->findOneBy(
            [
                'user'  => $manager,
                'field' => $field
            ]
        );

        if (!$managerFieldBalance) {
            return $this->createManagerBalance($manager, $field, $value);
        }

        return $this->updateManagerBalance($managerFieldBalance, $field, $value, $operation);
    }

    /**
     * @param Manager $manager
     * @param $field
     * @param $value
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function createManagerBalance(Manager $manager, $field, $value)
    {
        $balance = new ManagerBalance();

        $balance->setUser($manager);
        $balance->setField($field);
        $balance->setValue($value);

        $this->_em->persist($balance);
        $this->_em->flush();

        return $balance;
    }

    /**
     * @param ManagerBalance $balance
     * @param $field
     * @param $value
     * @param null $operation
     * @return ManagerBalance
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function updateManagerBalance(ManagerBalance $balance, $field, $value, $operation = null): ManagerBalance
    {
        $balance->setField($field);

        if ($operation !== '-' && $operation !== '+') {
            $balance->setValue($value);
        } else {
            if ($operation === '+') {
                $balance->setValue($balance->getValue() + $value);
            }

            if ($operation === '-') {
                $balance->setValue($balance->getValue() - $value);
            }
        }

        $this->_em->flush();

        return $balance;
    }

    // /**
    //  * @return ManagerBalance[] Returns an array of ManagerBalance objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('m.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ManagerBalance
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}

<?php

namespace App\Repository;

use App\Entity\Profit;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Profit|null find($id, $lockMode = null, $lockVersion = null)
 * @method Profit|null findOneBy(array $criteria, array $orderBy = null)
 * @method Profit[]    findAll()
 * @method Profit[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProfitRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Profit::class);
    }

    /**
     * @param $name
     * @param $value
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function setProfit($name, $value)
    {
        $profit = $this->findOneBy(
            [
                'fieldName' => $name
            ]
        );
        if ($profit) {
            $this->updateProfit($profit, $value);
        } else {
            $this->createProfit($name, $value);
        }
    }

    /**
     * @param Profit $profit
     * @param $value
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function updateProfit(Profit $profit, $value)
    {
        $profit->setValue($value);
        $this->_em->persist($profit);
        $this->_em->flush();
    }

    /**
     * @param $name
     * @param $value
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function createProfit($name, $value)
    {
        $profit = new Profit();
        $profit->setFieldName($name)->setValue($value);

        $this->_em->persist($profit);
        $this->_em->flush();
    }
}

<?php

namespace App\Repository;

use App\Entity\Currency;
use App\Entity\Pair;
use App\Entity\PairUnit;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method PairUnit|null find($id, $lockMode = null, $lockVersion = null)
 * @method PairUnit|null findOneBy(array $criteria, array $orderBy = null)
 * @method PairUnit[]    findAll()
 * @method PairUnit[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PairUnitRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PairUnit::class);
    }

    public function findSecondPairUnitByCurrencyAndPaymentSystem($pairUnitID)
    {
        $pairUnit = $this->find($pairUnitID);
        return $this->createQueryBuilder("pairUnit")
            ->innerJoin('pairUnit.currency', 'currency')
            ->innerJoin('pairUnit.paymentSystem', 'paymentSystem')
            ->Where($this->createQueryBuilder("pairUnit")->expr()->andX(
                $this->createQueryBuilder("pairUnit")->expr()->eq('currency.asset', ':currencyAsset'),
                $this->createQueryBuilder("pairUnit")->expr()->eq('paymentSystem.name', ':paymentSystemName'),
                $this->createQueryBuilder("pairUnit")->expr()->neq('pairUnit.direction', ':direction'),
            ))
            ->setParameter(':currencyAsset', $pairUnit->getCurrency()->getAsset())
            ->setParameter(':paymentSystemName', $pairUnit->getPaymentSystem()->getName())
            ->setParameter(':direction', $pairUnit->getDirection())
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function getPairUnits()
    {
        return $this->createQueryBuilder("pairUnit")
            ->andWhere('pairUnit.pairUnitTabs IS NOT NULL')
            ->getQuery()
            ->getResult();
    }

    /**
     * @param $baseFee
     * @param string $direction
     * @return int|mixed|string|null
     * @throws NonUniqueResultException
     */
    public function findPairUnit($baseFee, string $direction)
    {
        return $this->createQueryBuilder("pairUnit")
            ->innerJoin("pairUnit.currency", "currency")
            ->innerJoin("pairUnit.service", "service")
            ->innerJoin("pairUnit.paymentSystem", "payment_system")
            ->where("currency.asset = :asset")
            ->andWhere("service.name = :service_name")
            ->andWhere("payment_system.name = :payment_system_name")
            ->andWhere("pairUnit.direction = :direction")
            ->setParameter("asset", $baseFee["currency"]["asset"])//$baseFee["currency"]["asset"]
            ->setParameter("service_name", $baseFee["service"]["name"])//$baseFee["service"]["name"]
            ->setParameter("payment_system_name", $baseFee["paymentSystem"]["name"])//$baseFee["paymentSystem"]["name"]
            ->setParameter("direction", $direction)
            ->getQuery()
            ->getOneOrNullResult();

    }


    /**
     * @param $currency
     * @param $direction
     * @return int|mixed|string|null
     * @throws NonUniqueResultException
     */
    public function findPairUnitByCurrency($currency, $direction)
    {
        return $this->createQueryBuilder('pairUnit')
            ->where("pairUnit.direction = :direction")
            ->join("pairUnit.currency", "currency")
            ->join("pairUnit.service", "service")
            ->andWhere("currency.asset = :currency")
            ->andWhere("currency.serviceName = :serviceName")
            ->andWhere("service.name = :serviceName")
            ->setParameter("currency", $currency)
            ->setParameter("direction", $direction)
            ->setParameter("serviceName", 'WhiteBit')
            ->getQuery()
            ->getOneOrNullResult();
//            ->getResult();
    }

    /**
     * @return int|mixed|string
     */
    public function getAllPairsByWhiteBit()
    {
        return $this->createQueryBuilder('pairUnit')
            ->join("pairUnit.service", "service")
            ->andWhere("service.name != :serviceName")
            ->setParameter("serviceName", 'Huobi')
            ->getQuery()
            ->getResult();
    }

    public function getActivePairUnitsByCurrencyTag() {
        return $this->createQueryBuilder('pair_unit')
            ->where("pair_unit.isActive = :isActive")
            ->join("pair_unit.currency", "currency")
            ->join("pair_unit.service", "service")
            ->andWhere("currency.tag = :tag")
            ->andWhere("service.name = :name")
            ->setParameters([
                'isActive' => true,
                'tag' => Currency::TYPE_CRYPTO,
                'name' => 'WhiteBit'
            ])
            ->getQuery()->getResult();
    }

    /**
     * @throws NonUniqueResultException
     */
    public function getInversePairUnit(PairUnit $pairUnit) {
        return $this->createQueryBuilder('pair_unit')
            ->where("pair_unit.isActive = :isActive")
            ->join("pair_unit.currency", "currency")
            ->join("pair_unit.paymentSystem", "paymentSystem")
            ->andWhere("currency.asset = :asset")
            ->andWhere("paymentSystem.name = :name")
            ->andWhere("pair_unit.direction = :direction")
            ->andWhere('pair_unit.pairUnitTabs IS NOT NULL')
            ->setParameters([
                'isActive' => true,
                'asset' => $pairUnit->getCurrency()->getAsset(),
                'name' => $pairUnit->getPaymentSystem()->getName(),
                'direction' => $pairUnit->getDirection() === Pair::PAYMENT ? Pair::PAYOUT : Pair::PAYMENT
            ])
            ->getQuery()->getOneOrNullResult();
    }

}

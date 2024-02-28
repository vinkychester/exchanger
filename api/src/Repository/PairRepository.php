<?php

namespace App\Repository;

use App\Entity\Currency;
use App\Entity\Pair;
use App\Entity\PairUnit;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Pair|null find($id, $lockMode = null, $lockVersion = null)
 * @method Pair|null findOneBy(array $criteria, array $orderBy = null)
 * @method Pair[]    findAll()
 * @method Pair[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PairRepository extends ServiceEntityRepository
{

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Pair::class);
    }

    public function getSwapablePair(array $criteria)
    {
        $payment = $criteria["payment"];
        $payout = $criteria["payout"];

        $qb = $this->createQueryBuilder('pair');
        $qb->innerJoin('pair.payment', 'payment')
            ->innerJoin('pair.payout', 'payout')
            ->andWhere($qb->expr()->eq('payment.service', $payment->getService()->getId()))
            ->andWhere($qb->expr()->eq('payment.currency', $payment->getCurrency()->getId()))
            ->andWhere($qb->expr()->eq('payment.paymentSystem', $payment->getPaymentSystem()->getId()))
            ->andWhere($qb->expr()->eq('payout.service', $payout->getService()->getId()))
            ->andWhere($qb->expr()->eq('payout.currency', $payout->getCurrency()->getId()))
            ->andWhere($qb->expr()->eq('payout.paymentSystem', $payout->getPaymentSystem()->getId()))
            ->andWhere('BIT_AND(pair.flags, :flag) > 0')
            ->setParameters(
                [
                    'flag' => Pair::FLAG_ACTIVE
                ]
            );

        try {
            return $qb->getQuery()->getOneOrNullResult();
        } catch (NonUniqueResultException $e) {
            return false;
        }
    }

    public function getSimilarPairUnits(array $criteria)
    {
        $payment = $criteria["payment"];
        $payout = $criteria["payout"];

        $qb = $this->createQueryBuilder('p');
        $qb->innerJoin('p.payment', 'f')
            ->innerJoin('p.payout', 'k')
            ->andWhere($qb->expr()->eq('f.id', $payment->getId()))
            ->andWhere($qb->expr()->eq('k.id', $payout->getId()));


        try {
            return $qb->getQuery()->getOneOrNullResult();
        } catch (NonUniqueResultException $e) {
            return false;
        }
    }

    public function getPairByPairUnitsAndDirection(array $criteria)
    {
        $payment = $criteria["payment"];
        $payout = $criteria["payout"];
        $direction = $criteria["direction"];

        $qb = $this->createQueryBuilder('p');
        $qb->innerJoin('p.payment', 'payment')
            ->innerJoin('p.payout', 'payout')
            ->andWhere($qb->expr()->eq('payout.service.name', $payment->getService()->getName()))
            ->andWhere($qb->expr()->eq('payout.currency.name', $payment->getCurrency()->getAsset()))
            ->andWhere($qb->expr()->eq('payout.paymentSystem.name', $payment->getPaymentSystem()->getName()))
            ->andWhere($qb->expr()->eq('payment.service.name', $payout->getService()->getName()))
            ->andWhere($qb->expr()->eq('payment.currency.name', $payout->getCurrency()->getAsset()))
            ->andWhere($qb->expr()->eq('payment.paymentSystem.name', $payout->getPaymentSystem()->getName()))
            ->andWhere($qb->expr()->eq('flags', Pair::FLAG_ACTIVE));

        try {
            return $qb->getQuery()->getOneOrNullResult();
        } catch (NonUniqueResultException $e) {
            return false;
        }
    }

    public function getPairByPairUnits(array $criteria)
    {
        $payment = $criteria["payment"];
        $payout = $criteria["payout"];

        $qb = $this->createQueryBuilder('p');
        $qb->innerJoin('p.payment', 'payment')
            ->innerJoin('p.payout', 'payout')
            ->innerJoin('payment.service', 'paymentService')
            ->innerJoin('payment.currency', 'paymentCurrency')
            ->innerJoin('payment.paymentSystem', 'paymentPaymentSystem')
            ->innerJoin('payout.service', 'payoutService')
            ->innerJoin('payout.currency', 'payoutCurrency')
            ->innerJoin('payout.paymentSystem', 'payoutPaymentSystem')
            ->andWhere($qb->expr()->eq('paymentService.name', ':paymentServiceName'))
            ->andWhere($qb->expr()->eq('paymentCurrency.asset', ':paymentCurrencyAsset'))
            ->andWhere($qb->expr()->eq('paymentPaymentSystem.name', ':paymentPaymentSystemName'))
            ->andWhere($qb->expr()->eq('payoutService.name', ':payoutServiceName'))
            ->andWhere($qb->expr()->eq('payoutCurrency.asset', ':payoutCurrencyAsset'))
            ->andWhere($qb->expr()->eq('payoutPaymentSystem.name', ':payoutPaymentSystemName'))
            ->andWhere($qb->expr()->eq('p.isActive', true))
            ->setParameters([
               'paymentServiceName' => $payment->getService()->getName(),
               'paymentCurrencyAsset' => $payment->getCurrency()->getAsset(),
               'paymentPaymentSystemName' => $payment->getPaymentSystem()->getName(),
               'payoutServiceName' => $payout->getService()->getName(),
               'payoutCurrencyAsset' => $payout->getCurrency()->getAsset(),
               'payoutPaymentSystemName' => $payout->getPaymentSystem()->getName(),
            ]);

        try {
            return $qb->getQuery()->getOneOrNullResult();
        } catch (NonUniqueResultException $e) {
            return false;
        }
    }

    public function findPairPayment(PairUnit $pairUnit, string $paymentSystemName, string $currencyName) {
        return $this->createQueryBuilder("pair")
            ->leftJoin("pair.payment", "payment")
            ->leftJoin("pair.payout", "payout")
            ->leftJoin('payment.currency', 'paymentCurrency')
            ->leftJoin('payment.paymentSystem', 'paymentPaymentSystem')
            ->leftJoin('payout.currency', 'payoutCurrency')
            ->leftJoin('payout.paymentSystem', 'payoutPaymentSystem')
            ->andWhere("paymentCurrency.asset = :paymentCurrencyAsset")
            ->andWhere("paymentPaymentSystem.name = :paymentPaymentSystemName")
            ->andWhere("payoutCurrency.asset = :payoutCurrencyAsset")
            ->andWhere("payoutPaymentSystem.name = :payoutPaymentSystemName")
            ->andWhere("pair.isActive = :isActive")
            ->setParameters([
                "paymentCurrencyAsset" => $pairUnit->getCurrency()->getAsset(),
                "paymentPaymentSystemName" => $pairUnit->getPaymentSystem()->getName(),
                "payoutCurrencyAsset" => $currencyName,
                "payoutPaymentSystemName" => $paymentSystemName,
                "isActive" => true
            ])
            ->getQuery()->getResult();
    }

    public function findPairPayout(PairUnit $pairUnit, string $paymentSystemName, string $currencyName) {
        return $this->createQueryBuilder("pair")
            ->leftJoin("pair.payment", "payment")
            ->leftJoin("pair.payout", "payout")
            ->leftJoin('payment.currency', 'paymentCurrency')
            ->leftJoin('payment.paymentSystem', 'paymentPaymentSystem')
            ->leftJoin('payout.currency', 'payoutCurrency')
            ->leftJoin('payout.paymentSystem', 'payoutPaymentSystem')
            ->andWhere("paymentCurrency.asset = :paymentCurrencyAsset")
            ->andWhere("paymentPaymentSystem.name = :paymentPaymentSystemName")
            ->andWhere("payoutCurrency.asset = :payoutCurrencyAsset")
            ->andWhere("payoutPaymentSystem.name = :payoutPaymentSystemName")
            ->andWhere("pair.isActive = :isActive")
            ->setParameters([
                "paymentCurrencyAsset" => $currencyName,
                "paymentPaymentSystemName" => $paymentSystemName,
                "payoutCurrencyAsset" => $pairUnit->getCurrency()->getAsset(),
                "payoutPaymentSystemName" => $pairUnit->getPaymentSystem()->getName(),
                "isActive" => true
            ])
            ->getQuery()->getResult();
    }

    /**
     * @param $paymentPairUnit
     * @param $payoutPairUnit
     * @return int|mixed|string|null
     * @throws NonUniqueResultException
     */
    public function getPairPayout($paymentPairUnit, $payoutPairUnit)
    {
        return $this->createQueryBuilder("pair")
            ->where("pair.isActive = :isActive")
            ->leftJoin("pair.payment", "payment")
            ->leftJoin("pair.payout", "payout")
            ->leftJoin('payment.currency', 'paymentCurrency')
            ->leftJoin('payment.paymentSystem', 'paymentPaymentSystem')
            ->leftJoin('payout.currency', 'payoutCurrency')
            ->leftJoin('payout.paymentSystem', 'payoutPaymentSystem')
            ->andWhere("paymentCurrency.asset = :paymentCurrencyAsset")
            ->andWhere("paymentPaymentSystem.name = :paymentPaymentSystemName")
            ->andWhere("payoutCurrency.asset = :payoutCurrencyAsset")
            ->andWhere("payoutPaymentSystem.name = :payoutPaymentSystemName")
            ->setParameters(
                [
                    "paymentCurrencyAsset"     => $payoutPairUnit->getCurrency()->getAsset(),
                    "paymentPaymentSystemName" => $payoutPairUnit->getPaymentSystem()->getName(),
                    "payoutCurrencyAsset"      => $paymentPairUnit->getCurrency()->getAsset(),
                    "payoutPaymentSystemName"  => $paymentPairUnit->getPaymentSystem()->getName(),
                    "isActive"                 => true
                ]
            )
            ->getQuery()
            ->getOneOrNullResult();
    }
    /**
     * @return int|mixed|string
     */
    public function getActivePairWithActivePairUnitBank()
    {
        $queryBuilder = $this->createQueryBuilder('pair');

        $queryBuilder->where('pair.isActive = true')
            ->innerJoin('pair.payment', 'payment')
            ->innerJoin('pair.payout', 'payout')
            ->andWhere('payment.isActive = true')
            ->andWhere('payout.isActive = true')
            ->innerJoin('payment.service', 'paymentService')
            ->innerJoin('payout.service', 'payoutService')
            ->andWhere('payoutService.tag != :payoutTag')
            ->andWhere('paymentService.tag != :paymentTag')
            ->setParameters(
                [
                    'paymentTag' => "msc",
                    'payoutTag'  => "msc",
                ]
            );

       return $queryBuilder->getQuery()->getResult();
    }

    /**
     * @return int|mixed|string
     */
    public function getActivePairWithActivePairUnitCash()
    {
        $queryBuilder = $this->createQueryBuilder('pair');

        $queryBuilder->where('pair.isActive = true')
            ->innerJoin('pair.payment', 'payment')
            ->innerJoin('pair.payout', 'payout')
            ->andWhere('payment.isActive = true')
            ->andWhere('payout.isActive = true')
            ->innerJoin('payment.currency', 'paymentCurrency')
            ->innerJoin('payment.paymentSystem', 'paymentPaymentSystem')
            ->innerJoin('payout.currency', 'payoutCurrency')
            ->innerJoin('payout.paymentSystem', 'payoutPaymentSystem')
            ->andWhere($queryBuilder->expr()->orX(
                $queryBuilder->expr()->eq('payoutCurrency.tag', ':tag'),
                $queryBuilder->expr()->eq('paymentCurrency.tag', ':tag')
            ))
            ->andWhere($queryBuilder->expr()->orX(
                $queryBuilder->expr()->eq('payoutPaymentSystem.subName', ':payoutSubName'),
                $queryBuilder->expr()->eq('paymentPaymentSystem.subName', ':paymentSubName')
            ))
            ->setParameters(
                [
                    'tag'            => Currency::TYPE_CURRENCY,
                    'paymentSubName' => "CASH",
                    'payoutSubName'  => "CASH",
                ]
            );

       return $queryBuilder->getQuery()->getResult();
    }

}

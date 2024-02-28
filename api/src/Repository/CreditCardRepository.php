<?php

namespace App\Repository;

use App\Entity\CreditCard;
use DateTime;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\Persistence\ManagerRegistry;
use Exception;

/**
 * @method CreditCard|null find($id, $lockMode = null, $lockVersion = null)
 * @method CreditCard|null findOneBy(array $criteria, array $orderBy = null)
 * @method CreditCard[]    findAll()
 * @method CreditCard[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CreditCardRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CreditCard::class);
    }

    /**
     * @param array $criteria
     * @return false|int|mixed|string|null
     */
    public function uniqueCreditCard(array $criteria)
    {
        // add or on status if need
        $creditCard = $criteria['cardNumber'];
        $qb = $this->createQueryBuilder('credit_card');
        $qb->where("credit_card.cardNumber = :cardNumber")
            ->andWhere("credit_card.status = :status_verified or credit_card.status = :status_approved")
            ->setParameter("cardNumber", $creditCard)
            ->setParameter("status_verified", CreditCard::NOT_VERIFIED)
            ->setParameter("status_approved", CreditCard::VERIFIED);
        try {
            return $qb->getQuery()->getOneOrNullResult();
        } catch (NonUniqueResultException $e) {
            return false;
        }
    }

    /**
     * @param $interval
     * @return int|mixed|string
     * @throws Exception
     */
    public function expireDate($interval)
    {
        $date = new DateTime($interval);
        $date->setTime('00', '00', '00');
        $start_day = $date->getTimestamp();
        $date->setTime('23', '59', '00');
        $end_day = $date->getTimestamp();

        return $this->createQueryBuilder('card')
            ->where('card.status = :verified')
            ->andWhere('card.expireDateTime >= :date_start')
            ->andWhere('card.expireDateTime <= :date_end')
            ->setParameters(
                [
                    'verified'   => CreditCard::VERIFIED,
                    'date_start' => $start_day,
                    'date_end'   => $end_day
                ]
            )
            ->getQuery()
            ->getResult();
    }
}

<?php

namespace App\Repository;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Paginator;
use App\Entity\Attribute;
use App\Entity\BankDetail;
use App\Entity\Currency;
use App\Entity\Requisition;
use DateTime;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\ORM\Tools\Pagination\Paginator as ToolPaginator;
use Doctrine\Persistence\ManagerRegistry;
use Exception;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @method Requisition|null find($id, $lockMode = null, $lockVersion = null)
 * @method Requisition|null findOneBy(array $criteria, array $orderBy = null)
 * @method Requisition[]    findAll()
 * @method Requisition[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RequisitionRepository extends ServiceEntityRepository
{

    /**
     * RequisitionRepository constructor.
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Requisition::class);
    }

    /**
     * @param $user
     * @return QueryBuilder
     */
    public function getQueryBuilderRequisitionsByClient($user): QueryBuilder
    {
        return $this->createQueryBuilder('requisitions')
            ->where('requisitions.client = :userUUID')
            ->setParameter('userUUID', $user->getId())
            ->groupBy('requisitions.id');
    }

    /**
     * @param UserInterface $user
     * @return QueryBuilder
     */
    public function getQueryBuilderRequisitionsByManager(UserInterface $user): QueryBuilder
    {
        $managersCitiesIds = $user->getCities()->map(
            function ($obj) {
                return $obj->getExternalId();
            }
        )->getValues();

        $queryBuilder = $this->createQueryBuilder('requisitions');
        $queryBuilder
            ->join(BankDetail::class, 'bankDetails')
            ->join(Attribute::class, 'attributes')
            ->where('attributes.name = "cityId"')
            ->where($queryBuilder->expr()->in('attributes.value', ':cities'))
            ->setParameter('cities', $managersCitiesIds)
            ->groupBy('requisitions.id');

        return $queryBuilder;
    }

    /**
     * @return QueryBuilder
     */
    public function getQueryBuilderRequisitionsByAdmin(): QueryBuilder
    {
        return $this->createQueryBuilder('requisitions');
    }

    /**
     * @param $args
     * @return QueryBuilder
     */
    public function getQueryBuilderRequisitionsByAdminForStatistics($args): QueryBuilder
    {
        $queryBuilder = $this->createQueryBuilder('requisitions')
            ->where('requisitions.status = :status')
            ->setParameter('status', Requisition::STATUS_FINISHED)
            ->andWhere('requisitions.createdAt >= :dateGte')
            ->setParameter('dateGte', strtotime($args['rdate_gte']) - 3600 * 24)
            ->andWhere('requisitions.createdAt <= :dateLte')
            ->setParameter('dateLte', strtotime($args['rdate_lte']) + 3600 * 24);
        if (isset($args['type'])) {
            if ($args['type'] == Requisition::EXCHANGE_TYPE) {
                $queryBuilder->andWhere('requisitions.exchangePoint = :bank');
            } else {
                $queryBuilder->andWhere('requisitions.exchangePoint != :bank');
            }
            $queryBuilder->setParameter('bank', Requisition::EXCHANGE_TYPE);
        }
        if (isset($args['manager'])) {
            $queryBuilder->andWhere('requisitions.manager = :manager')
                ->setParameter('manager', $args['manager']);
        }

        return $queryBuilder->orderBy('requisitions.createdAt', 'DESC');
    }

    /**
     * @param UserInterface $user
     * @return QueryBuilder
     */
    public function getQueryBuilderManagersRequisitionsStatistics(): QueryBuilder
    {
        $queryBuilder = $this->createQueryBuilder('requisitions');
        $queryBuilder->where('requisitions.manager IS NOT NULL')
            ->groupBy('requisitions.id');

        return $queryBuilder;
    }

    /**
     * @param $user
     * @param $args
     * @return QueryBuilder
     */
    public function getClientsRequisitionsBuilder($user, $args): QueryBuilder
    {
        $queryBuilder = $this->createQueryBuilder('requisitions');
        if (isset($args['id'])) {
            $queryBuilder
                ->andWhere('requisitions.id LIKE :id')
                ->setParameter('id', '%' . $args['id'] . '%');
        }
        if (isset($args['status'])) {
            $queryBuilder
                ->andWhere('requisitions.status = :status')
                ->setParameter('status', $args['status']);
        }
        if (isset($args['pair_payment_paymentSystem_id'])) {
            $queryBuilder
                ->andWhere('paymentSystem.id = :pId')
                ->setParameter('pId', $args['pair_payment_paymentSystem_id']);
        }
        if (isset($args['paymentAmount'][0]['gte'])) {
            $queryBuilder
                ->andWhere('requisitions.paymentAmount >= :pAfrom')
                ->setParameter('pAfrom', $args['paymentAmount'][0]['gte']);
        }
        if (isset($args['paymentAmount'][0]['lte'])) {
            $queryBuilder
                ->andWhere('requisitions.paymentAmount <= :pATo')
                ->setParameter('pATo', $args['paymentAmount'][0]['lte']);
        }
        if (isset($args['payoutAmount'][0]['gte'])) {
            $queryBuilder
                ->andWhere('requisitions.payoutAmount >= :paAfrom')
                ->setParameter('paAfrom', $args['payoutAmount'][0]['gte']);
        }
        if (isset($args['payoutAmount'][0]['lte'])) {
            $queryBuilder
                ->andWhere('requisitions.payoutAmount <= :paATo')
                ->setParameter('paATo', $args['payoutAmount'][0]['lte']);
        }
        if (isset($args['createdAt'][0]['gte'])) {
            $queryBuilder
                ->andWhere('requisitions.createdAt >= :dateFrom')
                ->setParameter('dateFrom', $args['createdAt'][0]['gte']);
        }
        if (isset($args['createdAt'][1]['lte'])) {
            $queryBuilder
                ->andWhere('requisitions.createdAt <= :dateTo')
                ->setParameter('dateTo', $args['createdAt'][1]['lte']);
        }

        return $queryBuilder
            ->andWhere('clientAlias = :clientToRequisition')
            ->setParameter('clientToRequisition', $user)
            ->join('requisitions.client', 'clientAlias')
            ->join('requisitions.pair', 'pair')
            ->join('pair.payment', 'payment')
            ->join('payment.paymentSystem', 'paymentSystem');
    }

    /**
     * @param $args
     * @param $user
     * @return Paginator
     */
    public function getClientsRequisitionsBuilderPagination($args, $user): Paginator
    {
        $firstResult = (($args['page'] ?? 1) - 1) * $args['itemsPerPage'];

        return new Paginator(
            (new ToolPaginator(
                $this->getClientsRequisitionsBuilder($user, $args)->setFirstResult($firstResult)->setMaxResults(
                    $args['itemsPerPage']
                )
            ))->setUseOutputWalkers(false)
        );
    }


    /**
     * @param $interval
     * @param $type
     * @param $tag
     * @return int|mixed|string
     * @throws Exception
     */
    public function requisitionTimer($interval, $type, $tag)
    {
        date_default_timezone_set('Europe/Kiev');
        $date = new DateTime($interval);
        $date->setTime(date('H'), date('i'), '00');
        $start_day = $date->getTimestamp();
        $date->setTime(date('H'), date('i') + 1, '00');
        $end_day = $date->getTimestamp();

        $queryBuilder = $this->createQueryBuilder('requisition');

        $queryBuilder->where('requisition.status = :status')
            ->innerJoin('requisition.pair', 'pair')
            ->innerJoin('pair.payment', 'payment')
            ->innerJoin('pair.payout', 'payout')
            ->innerJoin('payment.currency', 'paymentCurrency')
            ->innerJoin('payment.paymentSystem', 'paymentPaymentSystem')
            ->innerJoin('payout.currency', 'payoutCurrency')
            ->innerJoin('payout.paymentSystem', 'payoutPaymentSystem')
            ->andWhere($queryBuilder->expr()->orX(
                $queryBuilder->expr()->eq('payoutCurrency.tag', ':tag'),
                $queryBuilder->expr()->eq('paymentCurrency.tag', ':tag')
            ));

        if ($type == 'cash') {
            $queryBuilder->andWhere($queryBuilder->expr()->orX(
                $queryBuilder->expr()->eq('payoutPaymentSystem.subName', ':payoutSubName'),
                $queryBuilder->expr()->eq('paymentPaymentSystem.subName', ':paymentSubName')
            ));
        } else {
            $queryBuilder->andWhere($queryBuilder->expr()->orX(
                $queryBuilder->expr()->neq('payoutPaymentSystem.subName', ':payoutSubName'),
                $queryBuilder->expr()->neq('paymentPaymentSystem.subName', ':paymentSubName')
            ));
        }
        $queryBuilder->andWhere('requisition.createdAt >= :date_start')
            ->andWhere('requisition.createdAt <= :date_end')
            ->setParameters(
                [
                    'date_start'     => $start_day,
                    'date_end'       => $end_day,
                    'status'         => Requisition::STATUS_NEW,
                    'tag'            => $tag,
                    'paymentSubName' => "CASH",
                    'payoutSubName'  => "CASH",
                ]
            );

        return $queryBuilder->getQuery()->getResult();
    }


    /**
     * @return int|mixed|string
     */
    public function requisitionTimerFiveDays()
    {
        date_default_timezone_set('Europe/Kiev');
        $date = new DateTime("-5 days");
        $date->setTime(date('H'), date('i'), '00');
        $start_day = $date->getTimestamp();
        $date->setTime(date('H'), date('i') + 1, '00');
        $end_day = $date->getTimestamp();

        $queryBuilder = $this->createQueryBuilder('requisition');

        $queryBuilder->where($queryBuilder->expr()->notIn('requisition.status', ':status'))
            ->andWhere('requisition.exchangePoint = :bank')
            ->innerJoin('requisition.pair', 'pair')
            ->innerJoin('requisition.invoices', 'invoice')
            ->innerJoin('pair.payment', 'payment')
            ->innerJoin('pair.payout', 'payout')
            ->innerJoin('payment.currency', 'paymentCurrency')
            ->innerJoin('payment.paymentSystem', 'paymentPaymentSystem')
            ->innerJoin('payout.currency', 'payoutCurrency')
            ->innerJoin('payout.paymentSystem', 'payoutPaymentSystem')
            ->andWhere('invoice.direction = :payment')
            ->andWhere('invoice.isPaid = :paid')
            ->andWhere(
                $queryBuilder->expr()->orX(
                    $queryBuilder->expr()->eq('payoutCurrency.tag', ':tag'),
                    $queryBuilder->expr()->eq('paymentCurrency.tag', ':tag')
                )
            )
            ->andWhere('payoutPaymentSystem.subName != :payoutSubName')
            ->andWhere('paymentPaymentSystem.subName != :paymentSubName')
            ->andWhere('requisition.createdAt >= :date_start')
            ->andWhere('requisition.createdAt <= :date_end')
            ->setParameters(
                [
                    'date_start'     => $start_day,
                    'date_end'       => $end_day,
                    'status'         => [Requisition::STATUS_FINISHED, Requisition::STATUS_CANCELED, Requisition::STATUS_ERROR, Requisition::STATUS_DISABLED],
                    'tag'            => Currency::TYPE_CRYPTO,
                    'paymentSubName' => "CASH",
                    'payoutSubName'  => "CASH",
                    'bank'           => Requisition::EXCHANGE_TYPE,
                    'payment'        => "payment",
                    'paid'           => false
                ]
            );

        return $queryBuilder->getQuery()->getResult();
    }

    /**
     * @param $date_gte
     * @param $date_lte
     * @param false $manager
     * @return int|mixed|string
     */
    public function getFinishedRequisitionsByPeriod($date_gte, $date_lte, $manager = false)
    {

        $queryBuilder = $this->createQueryBuilder('requisition')
            ->where('requisition.status = :status')
            ->andWhere('requisition.createdAt >= :date_gte')
            ->andWhere('requisition.createdAt <= :date_lte')
            ->setParameters(
                [
                    'status' => Requisition::STATUS_FINISHED,
                    'date_gte' => $date_gte,
                    'date_lte' => $date_lte
                ]
            );

        if ($manager) {
            $queryBuilder->andWhere('requisition.manager = :manager')
                ->setParameter('manager', $manager);
        }

       return $queryBuilder->getQuery()->getResult();
    }
}

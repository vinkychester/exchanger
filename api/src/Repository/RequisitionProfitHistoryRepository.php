<?php

namespace App\Repository;

use App\Entity\Requisition;
use App\Entity\RequisitionProfitHistory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method RequisitionProfitHistory|null find($id, $lockMode = null, $lockVersion = null)
 * @method RequisitionProfitHistory|null findOneBy(array $criteria, array $orderBy = null)
 * @method RequisitionProfitHistory[]    findAll()
 * @method RequisitionProfitHistory[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RequisitionProfitHistoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RequisitionProfitHistory::class);
    }

    /**
     * @param Requisition $requisition
     * @param $field
     * @param $value
     * @param null $operation
     * @return RequisitionProfitHistory
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function setRequisitionProfitHistory(Requisition $requisition, $field, $value, $operation = null): RequisitionProfitHistory
    {
        $requisitionProfitHistory = $this->findOneBy(
            [
                'requisition' => $requisition,
                'fieldName'   => $field
            ]
        );

        if (!$requisitionProfitHistory) {
            return $this->createRequisitionProfitHistory($requisition, $field, $value);
        }

        return $this->updateRequisitionProfitHistory($requisitionProfitHistory, $field, $value, $operation);
    }

    /**
     * @param Requisition $requisition
     * @param $field
     * @param $value
     * @return RequisitionProfitHistory
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function createRequisitionProfitHistory(Requisition $requisition, $field, $value): RequisitionProfitHistory
    {
        $requisitionProfitHistory = new RequisitionProfitHistory();

        $requisitionProfitHistory->setRequisition($requisition);
        $requisitionProfitHistory->setFieldName($field);
        $requisitionProfitHistory->setValue($value);

        $this->_em->persist($requisitionProfitHistory);
        $this->_em->flush();

        return $requisitionProfitHistory;
    }

    /**
     * @param RequisitionProfitHistory $requisitionProfitHistory
     * @param $field
     * @param $value
     * @param null $operation
     * @return RequisitionProfitHistory
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function updateRequisitionProfitHistory(
        RequisitionProfitHistory $requisitionProfitHistory,
        $field,
        $value,
        $operation = null
    ) {
        $requisitionProfitHistory->setFieldName($field);

        if ($operation !== '-' && $operation !== '+') {
            $requisitionProfitHistory->setValue($value);
        } else {
            if ($operation === '+') {
                $requisitionProfitHistory->setValue($requisitionProfitHistory->getValue() + $value);
            }

            if ($operation === '-') {
                $requisitionProfitHistory->setValue($requisitionProfitHistory->getValue() - $value);
            }
        }

        $this->_em->flush();

        return $requisitionProfitHistory;
    }
}

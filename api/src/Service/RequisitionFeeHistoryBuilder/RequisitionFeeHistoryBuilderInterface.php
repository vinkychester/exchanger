<?php


namespace App\Service\RequisitionFeeHistoryBuilder;


use App\Entity\Requisition;
use Calculation\Utils\Exchange\PairUnitInterface;

/**
 * Interface RequisitionFeeHistoryBuilderInterface
 * @package App\Service\RequisitionFeeHistoryHistoryBuilder
 */
interface RequisitionFeeHistoryBuilderInterface
{
    /**
     * @param Requisition $requisition
     * @param PairUnitInterface $pairUnit
     * @return mixed
     */
    public function setFee(Requisition $requisition, PairUnitInterface $pairUnit);

    /**
     * @return mixed
     */
    public function storeItem();
}
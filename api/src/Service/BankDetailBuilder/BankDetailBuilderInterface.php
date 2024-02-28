<?php


namespace App\Service\BankDetailBuilder;


use App\Entity\PairUnit;
use App\Entity\Requisition;
use Calculation\Utils\Exchange\PairUnitInterface;

/**
 * Interface BankDetailBuilderInterface
 * @package App\Service\BankDetailBuilder
 */
interface BankDetailBuilderInterface
{
    /**
     * @param Requisition $requisition
     * @param PairUnitInterface $pairUnit
     * @param array $attributes
     * @param string $direction
     * @param bool $isSaveDetails
     * @return mixed
     */
    public function setBankDetail(
        Requisition $requisition,
        PairUnitInterface $pairUnit,
        array $attributes,
        string $direction,
        bool $isSaveDetails
    );

    /**
     * @return mixed
     */
    public function storeBankDetail();
}
<?php


namespace App\Service;

/**
 * Interface RateHistoryBuilderInterface
 * @package App\Service\RateBuilder
 */
interface EntityBuilderInterface
{
    /**
     * @param $rates
     * @return mixed
     */
    public function setItems($rates);

    public function storeItems();

}

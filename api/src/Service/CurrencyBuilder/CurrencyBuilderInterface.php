<?php


namespace App\Service\CurrencyBuilder;


use App\Entity\Currency;

interface CurrencyBuilderInterface
{
//    public function createCurrency(): CurrencyBuilderInterface;

    public function addCurrencyName(string $name): CurrencyBuilderInterface;

    public function addCurrencyRates(float $rate, float $ratePayIn, float $ratePayOut): CurrencyBuilderInterface;

    public function addCurrencyTag(string $tag): CurrencyBuilderInterface;

    public function buildCurrency(): Currency;
}
<?php

namespace App\Service\ExchangeAttributeBuilder;

use App\Entity\Currency;
use App\Entity\PairUnit;
use App\Entity\PaymentSystem;
use App\Entity\Service;

/**
 * Interface ExchangeAttributeBuilderInterface
 * @package App\Service\ExchangeAttributeBuilder
 */
interface ExchangeAttributeBuilderInterface
{
    /**
     * @return Currency
     */
    public function buildCurrency(): Currency;

    /**
     * @return PaymentSystem
     */
    public function buildPaymentSystem(): PaymentSystem;

    /**
     * @return Service
     */
    public function buildService(): Service;

    /**
     * @return PairUnit
     */
    public function buildExchangeAttribute(): PairUnit;

    /**
     * @param string $asset
     * @return ExchangeAttributeBuilderInterface
     */
    public function addCurrencyName(string $asset): ExchangeAttributeBuilderInterface;

    /**
     * @param string $tag
     * @return ExchangeAttributeBuilderInterface
     */
    public function addCurrencyTag(string $tag): ExchangeAttributeBuilderInterface;

    /**
     * @param string $token
     * @return ExchangeAttributeBuilderInterface
     */
    public function addCurrencyRates(string $token): ExchangeAttributeBuilderInterface;

    /**
     * @param string $tag
     * @return ExchangeAttributeBuilderInterface
     */
    public function addPaymentSystemName(string $tag): ExchangeAttributeBuilderInterface;

    /**
     * @param string $subName
     * @return ExchangeAttributeBuilderInterface
     */
    public function addPaymentSystemSubName(string $subName): ExchangeAttributeBuilderInterface;

    /**
     * @param string $title
     * @return ExchangeAttributeBuilderInterface
     */
    public function addServiceName(string $title): ExchangeAttributeBuilderInterface;

    /**
     * @param string $name
     * @return ExchangeAttributeBuilderInterface
     */
    public function addServiceTag(string $name): ExchangeAttributeBuilderInterface;

    /**
     * @param float $percent
     * @param float $constant
     * @param float $min
     * @param float $max
     * @param string $exchange
     * @return ExchangeAttributeBuilderInterface
     */
    public function addServiceCommission(
        float $percent,
        float $constant,
        float $min,
        float $max,
        string $exchange
    ): ExchangeAttributeBuilderInterface;

    /**
     * @return ExchangeAttributeBuilderInterface
     */
    public function createExchangeAttribute(): ExchangeAttributeBuilderInterface;
}
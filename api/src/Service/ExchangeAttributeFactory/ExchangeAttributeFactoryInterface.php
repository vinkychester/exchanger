<?php

namespace App\Service\ExchangeAttributeFactory;

use App\Entity\Currency;
use App\Entity\PairUnit;
use App\Entity\PaymentSystem;
use App\Entity\Service;

/**
 * Interface ExchangeAttributeFactoryInterface
 * @package App\Service\ExchangeAttributeFactory
 */
interface ExchangeAttributeFactoryInterface
{
    public function createCurrency(): Currency;

    public function createPaymentSystem(): PaymentSystem;

    public function createService(): Service;

    public function createExchangeAttribute(): PairUnit;
}
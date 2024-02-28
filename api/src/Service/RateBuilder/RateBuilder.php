<?php

namespace App\Service\RateBuilder;

ini_set("serialize_precision", -1);

use App\Entity\Currency;
use App\Entity\RateHistory;
use App\Service\EntityBuilderInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use ItlabStudio\ApiClient\CodeBase\ApiResources\ControlPanel\Responses\Rate\getAll;

/**
 * Class CurrencyBuilder
 * @package App\Service\CurrencyBuilder
 */
class RateBuilder implements EntityBuilderInterface
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * @var ArrayCollection
     */
    protected ArrayCollection $availableCurrencies;

    /**
     * CurrencyBuilder constructor.
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @param Currency[] $currencies
     * @return $this
     */
    public function setAvailableCurrencies(array $currencies)
    {
        $this->availableCurrencies = new ArrayCollection($currencies);

        return $this;
    }

    /**
     * @param $name
     * @return string
     */
    protected function convertTitle($name)
    {
        return [
                   'WhiteBit'         => 'Crypto2 Service',
                   'Huobi'            => 'Crypto1 Service',
                   'UaPay'            => 'Uah1 Service',
                   'Decta'            => 'Usd1 Service',
                   'ADG'              => 'Rub2 Service',
                   'AdvCash'          => 'Rub1 Service',
                   'MicroserviceCash' => 'Cash Service',
                   'Kuna'             => 'Uah2 Service',
               ][$name] ?? $name;
    }

    /**
     * @param $rates
     * @return $this
     */
    public function setItems($rates): RateBuilder
    {
        foreach ($rates as $rate) {
            if (!$rate instanceof getAll) {
                continue;
            }

            if ($this->availableCurrencies->count()
                && !$currencyForUpdate = $this->availableCurrencies->filter(
                    function ($item) use ($rate) {
                        if ($item->getAsset() === $rate->getCurrency()->getAsset()
                            && $this->convertTitle($item->getServiceName()) === $rate->getService()->getTitle()
                        ) {
                            return !($item->getRate() == $rate->getRate()
                                || $item->getPaymentRate() == $rate->getPurchase()
                                || $item->getPayoutRate() == $rate->getSelling());
                        }

                        return false;
                    }
                )
            ) {
                continue;
            }

            if (!$currencyForUpdate->isEmpty()) {
                $currentCurrency = $currencyForUpdate->first();

                $currentCurrency->setRate($rate->getRate())
                    ->setPaymentRate($rate->getPurchase())
                    ->setPayoutRate($rate->getSelling());

                $this->entityManager->persist($currentCurrency);

                $this->entityManager->persist(
                    (new RateHistory())
                        ->setServiceName($rate->getService()->getTitle())
                        ->setCurrencyAsset($rate->getCurrency()->getAsset())
                        ->setRate($rate->getRate())
                        ->setPaymentRate($rate->getPurchase())
                        ->setPayoutRate($rate->getSelling())
                        ->setLastUpdate(time())
                );
            }
        }

        return $this;
    }

    /**
     * @return $this
     */
    public function storeItems(): RateBuilder
    {
        $this->entityManager->flush();

        return $this;
    }
}

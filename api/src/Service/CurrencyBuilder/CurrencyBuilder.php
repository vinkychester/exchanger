<?php


namespace App\Service\CurrencyBuilder;


use App\Entity\Currency;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Class CurrencyBuilder
 * @package App\Service\CurrencyBuilder
 */
class CurrencyBuilder implements CurrencyBuilderInterface
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var Currency
     */
    private Currency $currency;

    /**
     * CurrencyBuilder constructor.
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @return $this|CurrencyBuilderInterface
     */
    public function reset(): CurrencyBuilderInterface
    {
        $this->currency = new Currency;

        return $this;
    }

    /**
     * @param string $type
     * @throws \Exception
     */
    private function setCurrencyType(string $type): void
    {
        $currencyType = $this->entityManager->getRepository(CurrencyType::class)->findOneBy(['type' => $type]);
        if (!$currencyType instanceof CurrencyType) {
            throw new \Exception();
        }
        $this->currency->setCurrencyType($currencyType);
    }

    /**
     * @return CurrencyBuilderInterface
     * @throws \Exception
     */
    public function createFiatCurrency(): CurrencyBuilderInterface
    {
        $this->setCurrencyType(CurrencyType::FIAT);

        return $this;
    }

    /**
     * @return CurrencyBuilderInterface
     * @throws \Exception
     */
    public function createCryptoCurrency(): CurrencyBuilderInterface
    {
        $this->setCurrencyType(CurrencyType::CRYPTO);

        return $this;
    }

    /**
     * @return Currency
     */
    public function buildCurrency(): Currency
    {
        return $this->currency;
    }

    /**
     * @param string $abbreviation
     * @return $this|CurrencyBuilderInterface
     */
    public function addCurrencyName(string $name): CurrencyBuilderInterface
    {
        if (null === $name) {
            throw new \RuntimeException();
        }

        $this->currency->setName($name);

        return $this;
    }

    /**
     * @param string $tag
     * @return CurrencyBuilderInterface
     */
    public function addCurrencyTag(string $tag): CurrencyBuilderInterface
    {
        if (null === $tag) {
            throw new \RuntimeException();
        }

        $this->currency->setTag($tag);

        return $this;
    }

    /**
     * @param float $rate
     * @param float $ratePayIn
     * @param float $ratePayOut
     * @return $this|CurrencyBuilderInterface
     */
    public function addCurrencyRates(float $rate, float $ratePayIn, float $ratePayOut): CurrencyBuilderInterface
    {
        if (null === ($rate && $ratePayIn && $ratePayOut)) {
            throw new \RuntimeException();
        }

        $this->currency->setCourse($course);
        $this->currency->setPercentPayin($percentPayin);
        $this->currency->setPercentPayout($percentPayout);

        return $this;
    }
}
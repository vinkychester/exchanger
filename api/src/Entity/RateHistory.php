<?php

namespace App\Entity;

use App\Repository\RateHistoryRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=RateHistoryRepository::class)
 */
class RateHistory
{
    public const RATES_TOPIC = "http://coin24/rates";

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="bigint")
     */
    private ?int $id;

    /**
     * @var string|null
     * @ORM\Column(type="string")
     */
    private ?string $currencyAsset;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     */
    private ?float $rate = 0;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     */
    private ?float $paymentRate = 0;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     */
    private ?float $payoutRate = 0;

    /**
     * @var int|null
     * @ORM\Column(type="integer")
     */
    private ?int $lastUpdate;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=50)
     */
    private ?string $serviceName;

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return float
     */
    public function getRate(): float
    {
        return $this->rate;
    }

    /**
     * @param float $rate
     * @return $this
     */
    public function setRate(float $rate): self
    {
        $this->rate = $rate;

        return $this;
    }

    /**
     * @return float
     */
    public function getPaymentRate(): float
    {
        return $this->paymentRate;
    }

    /**
     * @param float $paymentRate
     * @return $this
     */
    public function setPaymentRate(float $paymentRate): self
    {
        $this->paymentRate = $paymentRate;

        return $this;
    }

    /**
     * @return float
     */
    public function getPayoutRate(): float
    {
        return $this->payoutRate;
    }

    /**
     * @param float $payoutRate
     * @return $this
     */
    public function setPayoutRate(float $payoutRate): self
    {
        $this->payoutRate = $payoutRate;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getCurrencyAsset(): ?string
    {
        return $this->currencyAsset;
    }

    /**
     * @param string|null $currencyAsset
     * @return RateHistory
     */
    public function setCurrencyAsset(?string $currencyAsset): RateHistory
    {
        $this->currencyAsset = $currencyAsset;

        return $this;
    }

    /**
     * @param int|null $lastUpdate
     * @return RateHistory
     */
    public function setLastUpdate(?int $lastUpdate): RateHistory
    {
        $this->lastUpdate = $lastUpdate;

        return $this;
    }

    /**
     * @return int|null
     */
    public function getLastUpdate(): ?int
    {
        return $this->lastUpdate;
    }

    /**
     * @return string|null
     */
    public function getServiceName(): ?string
    {
        return $this->serviceName;
    }

    /**
     * @param string $serviceName
     * @return $this
     */
    public function setServiceName(string $serviceName): self
    {
        $this->serviceName = $serviceName;

        return $this;
    }
}

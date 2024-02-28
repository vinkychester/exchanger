<?php


namespace App\Service\ExchangeAttributeBuilder;

use App\Entity\Currency;
use App\Entity\PairUnit;
use App\Entity\PaymentSystem;
use App\Entity\Service;
use App\Utils\RequestManager;
use Doctrine\ORM\EntityManagerInterface;
use ReflectionClass;
use ReflectionException;
use RuntimeException;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

/**
 * Class ExchangeAttributeBuilder
 * @package App\Service\ExchangeAttributeBuilder
 */
class ExchangeAttributeBuilder implements ExchangeAttributeBuilderInterface
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var Currency
     */
    protected Currency $currency;
    /**
     * @var PaymentSystem
     */
    protected PaymentSystem $paymentSystem;
    /**
     * @var Service
     */
    protected Service $service;
    /**
     * @var PairUnit
     */
    protected PairUnit $exchangeAttribute;
    /**
     * @var RequestManager
     */
    protected RequestManager $requestManager;

    /**
     * CurrencyBuilder constructor.
     * @param EntityManagerInterface $entityManager
     * @param RequestManager $requestManager
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        RequestManager $requestManager
    )
    {
        $this->entityManager = $entityManager;
        $this->requestManager = $requestManager;
    }

    /**
     * @param string $object
     * @param string $tag
     * @throws ReflectionException
     */
    public function reset(string $object, string $tag): void
    {
        if (null === $tag) {
            throw new RuntimeException("The $tag does not exist");
        }

        // Find entity by field
        $entity = $this->entityManager->getRepository($object)->findOneBy(['name' => $tag]);
        // Get entity class name to find field
        $class = strtolower((new ReflectionClass($object))->getShortName());
        // Check if object exist
        null === $entity ? $this->$class = new $object() : $this->$class = $entity;
    }

    /**
     * @param string $name
     * @return $this|ExchangeAttributeBuilderInterface
     * @throws ReflectionException
     */
    public function resetCurrency(string $name): ExchangeAttributeBuilderInterface
    {
        $this->reset(Currency::class, $name);

        return $this;
    }

    /**
     * @param string $tag
     * @return $this|ExchangeAttributeBuilderInterface
     * @throws ReflectionException
     */
    public function resetPaymentSystem(string $tag): ExchangeAttributeBuilderInterface
    {
        $this->reset(PaymentSystem::class, $tag);

        return $this;
    }

    /**
     * @param string $title
     * @return $this|ExchangeAttributeBuilderInterface
     * @throws ReflectionException
     */
    public function resetService(string $title): ExchangeAttributeBuilderInterface
    {
        $this->reset(Service::class, $title);

        return $this;
    }

    /**
     * @return $this|ExchangeAttributeBuilderInterface
     */
    public function resetExchangeAttribute(): ExchangeAttributeBuilderInterface
    {
        $this->exchangeAttribute = new PairUnit();

        return $this;
    }

    /**
     * @param string $asset
     * @return $this|ExchangeAttributeBuilderInterface
     */
    public function addCurrencyName(string $asset): ExchangeAttributeBuilderInterface
    {
        if (null === $asset) {
            throw new RuntimeException("The $asset does not exist");
        }

        $this->currency->setName($asset);

        return $this;
    }

    /**
     * @param string $tag
     * @return $this|ExchangeAttributeBuilderInterface
     */
    public function addCurrencyTag(string $tag): ExchangeAttributeBuilderInterface
    {
        if (null === $tag) {
            throw new RuntimeException("The $tag does not exist");
        }

        $this->currency->setTag($tag);

        return $this;
    }

    /**
     * @param string $token
     * @return $this|ExchangeAttributeBuilderInterface
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function addCurrencyRates(string $token): ExchangeAttributeBuilderInterface
    {
        if (null === $token) {
            throw new RuntimeException("The $token does not exist");
        }

        $response = $this->requestManager->getResponse(
            "https://dev9.itlab-studio.com/api/private/rates?currency.asset={$this->currency->getName()}&page=1",
            $token
        )[0];

        $this->currency->setRate($response['rate']);
        $this->currency->setRatePayIn($response['purchase']);
        $this->currency->setRatePayOut($response['selling']);

        return $this;
    }

    /**
     * @param string $tag
     * @return $this|ExchangeAttributeBuilderInterface
     */
    public function addPaymentSystemName(string $tag): ExchangeAttributeBuilderInterface
    {
        $this->paymentSystem->setName($tag);

        return $this;
    }

    /**
     * @param string $subName
     * @return $this|ExchangeAttributeBuilderInterface
     */
    public function addPaymentSystemSubName(string $subName): ExchangeAttributeBuilderInterface
    {
        $this->paymentSystem->setSubName($subName);

        return $this;
    }

    /**
     * @param string $title
     * @return $this|ExchangeAttributeBuilderInterface
     */
    public function addServiceName(string $title): ExchangeAttributeBuilderInterface
    {
        $this->service->setName($title);

        return $this;
    }

    /**
     * @param string $name
     * @return $this|ExchangeAttributeBuilderInterface
     */
    public function addServiceTag(string $name): ExchangeAttributeBuilderInterface
    {
        $this->service->setTag($name);

        return $this;
    }

    public function addServiceCommission(
        float $percent,
        float $constant,
        float $min,
        float $max,
        string $exchange
    ): ExchangeAttributeBuilderInterface
    {
        $commission = [
            "percent" => $percent,
            "constant" => $constant,
            "limits" => [
                "min" => $min,
                "max" => $max
            ]
        ];

        if ($exchange === "payment") {
            $this->service->setInFee($commission);
        } elseif ($exchange === "payout") {
            $this->service->setOutFee($commission);
        }

        return $this;
    }

    public function createExchangeAttribute(): ExchangeAttributeBuilderInterface
    {
        $this->exchangeAttribute->setCurrency($this->currency);
        $this->exchangeAttribute->setPaymentSystem($this->paymentSystem);
        $this->exchangeAttribute->setService($this->service);

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
     * @return PaymentSystem
     */
    public function buildPaymentSystem(): PaymentSystem
    {
        return $this->paymentSystem;
    }

    /**
     * @return Service
     */
    public function buildService(): Service
    {
        return $this->service;
    }

    public function buildExchangeAttribute(): PairUnit
    {
        return $this->exchangeAttribute;
    }
}
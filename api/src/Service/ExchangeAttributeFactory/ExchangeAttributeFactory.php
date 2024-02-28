<?php


namespace App\Service\ExchangeAttributeFactory;

use App\Entity\Currency;
use App\Entity\PairUnit;
use App\Entity\PaymentSystem;
use App\Entity\Service;
use App\Utils\RequestManager;
use Doctrine\ORM\EntityManagerInterface;
use RuntimeException;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

/**
 * Class ExchangeAttributeFactory
 * @package App\Service\ExchangeAttributeFactory
 */
class ExchangeAttributeFactory implements ExchangeAttributeFactoryInterface
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var RequestManager
     */
    protected RequestManager $requestManager;
    /**
     * @var string
     */
    protected string $token;
    /**
     * @var array
     */
    private array $data;

    /**
     * ExchangeAttributeFactory constructor.
     * @param EntityManagerInterface $entityManager
     * @param RequestManager $requestManager
     * @param string $token
     * @param array $data
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        RequestManager $requestManager,
        string $token,
        array $data)
    {
        if ($this->support($data)) {
            $this->data = $data;
        }
        $this->entityManager = $entityManager;
        $this->requestManager = $requestManager;
        $this->token = $token;
    }

    /**
     * @param array $data
     * @return bool
     */
    private function support(array $data): bool
    {
        return empty(array_diff_key(array_flip(['currency', 'paymentSystem', 'service']), $data));
    }

    /**
     * @param string $object
     * @param string $tag
     * @return bool
     */
    private function isObject(string $object, string $tag): bool
    {
        if (null === $tag) {
            throw new RuntimeException("The $tag does not exist");
        }

        // Find entity by field
        $entity = $this->entityManager->getRepository($object)->findOneBy(['name' => $tag]);
        // Check if object exist
        return null === $entity;
    }

    /**
     * @return Currency
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function createCurrency(): Currency
    {
        if ($this->isObject(Currency::class, $this->data['currency']['asset'])) {
            $currency = new Currency();
            $currency->setName($this->data['currency']['asset']);
            $currency->setTag($this->data['currency']['type']);

            $response = $this->requestManager->getResponse(
                "https://dev9.itlab-studio.com/api/private/rates?currency.asset={$currency->getName()}&page=1",
                $this->token
            )[0];

            $currency->setRate($response['rate']);
            $currency->setRatePayIn($response['purchase']);
            $currency->setRatePayOut($response['selling']);
        }
    }

    public function createPaymentSystem(): PaymentSystem
    {
        // TODO: Implement createPaymentSystem() method.
    }

    public function createService(): Service
    {
        // TODO: Implement createService() method.
    }

    public function createExchangeAttribute(): PairUnit
    {
        // TODO: Implement createExchangeAttribute() method.
    }
}
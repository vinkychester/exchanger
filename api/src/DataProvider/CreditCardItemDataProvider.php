<?php


namespace App\DataProvider;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\CreditCard;
use App\Utils\Base64FileExtractor;
use Doctrine\Persistence\ManagerRegistry;

/**
 * Class CreditCardItemDataProvider
 * @package App\DataProvider
 */
class CreditCardItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{
    /**
     * @var iterable
     */
    private iterable $itemExtensions;
    /**
     * @var ManagerRegistry
     */
    private ManagerRegistry $managerRegistry;
    /**
     * @var Base64FileExtractor
     */
    private Base64FileExtractor $base64FileExtractor;
    /**
     * @var string
     */
    private string $creditDir;

    /**
     * CreditCardItemDataProvider constructor.
     * @param ManagerRegistry $managerRegistry
     * @param Base64FileExtractor $base64FileExtractor
     * @param string $creditDir
     * @param iterable $itemExtensions
     */
    public function __construct(
        ManagerRegistry $managerRegistry,
        Base64FileExtractor $base64FileExtractor,
        string $creditDir,
        iterable $itemExtensions = [])
    {
        $this->managerRegistry = $managerRegistry;
        $this->itemExtensions = $itemExtensions;
        $this->base64FileExtractor = $base64FileExtractor;
        $this->creditDir = $creditDir;
    }

    /**
     * @param string $resourceClass
     * @param string|null $operationName
     * @param array $context
     * @return bool
     */
    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return CreditCard::class === $resourceClass;
    }

    /**
     * @param string $resourceClass
     * @param array|int|string $id
     * @param string|null $operationName
     * @param array $context
     * @return object|void|null
     */
    public function getItem(string $resourceClass, $id, string $operationName = null, array $context = []): ?object
    {
        $manager = $this->managerRegistry->getManagerForClass($resourceClass);
        $base64FileExtractor = $this->base64FileExtractor;
        $storageDir = $this->creditDir;
        /** @var CreditCard $creditCard */
        $creditCard = $manager->getRepository($resourceClass)->find($id);
        $attachments = $creditCard->getMediaObjects()->getValues();
        array_walk($attachments, static function ($value) use ($base64FileExtractor, $storageDir) {
            $value->setBase64($base64FileExtractor->convertToBase64($storageDir . $value->getStorage() . '/' . $value->getContentUrl()));
        });
        return $creditCard;
    }

}
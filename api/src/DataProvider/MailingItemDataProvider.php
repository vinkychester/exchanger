<?php


namespace App\DataProvider;


use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\Mailing;
use App\Utils\Base64FileExtractor;
use Doctrine\Persistence\ManagerRegistry;

class MailingItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{

    /**
     * @var ManagerRegistry
     */
    protected ManagerRegistry $managerRegistry;
    /**
     * @var Base64FileExtractor
     */
    protected Base64FileExtractor $base64FileExtractor;

    /**
     * @var iterable
     */
    protected iterable $itemExtensions;
    /**
     * @var string
     */
    protected string $mailingFileDir;

    public function __construct(
        ManagerRegistry $managerRegistry,
        Base64FileExtractor $base64FileExtractor,
        string $mailingFileDir,
        iterable $itemExtensions = []
    ) {
        $this->managerRegistry = $managerRegistry;
        $this->base64FileExtractor = $base64FileExtractor;
        $this->itemExtensions = $itemExtensions;
        $this->mailingFileDir = $mailingFileDir;
    }

    /**
     * @param string $resourceClass
     * @param string|null $operationName
     * @param array $context
     * @return bool
     */
    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return Mailing::class === $resourceClass;
    }

    /**
     * @param string $resourceClass
     * @param array|int|string $id
     * @param string|null $operationName
     * @param array $context
     * @return object|null
     */
    public function getItem(string $resourceClass, $id, string $operationName = null, array $context = []): ?object
    {
        $manager = $this->managerRegistry->getManagerForClass($resourceClass);
        $base64FileExtractor = $this->base64FileExtractor;
        $storageDir = $this->mailingFileDir;
        /** @var Mailing $mailingMessage */
        $mailingMessage = $manager->getRepository($resourceClass)->find($id);
        if ($mailingMessage->getFile()) {
            $mailingMessage->setBase64($base64FileExtractor->convertToBase64($storageDir . $mailingMessage->getFile()));
        }
        return $mailingMessage;
    }
}
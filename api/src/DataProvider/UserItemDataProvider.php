<?php


namespace App\DataProvider;


use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\Admin;
use App\Entity\Client;
use App\Entity\Manager;
use App\Entity\Seo;
use App\Entity\User;
use App\Utils\Base64FileExtractor;
use Doctrine\Persistence\ManagerRegistry;
use ReflectionClass;
use stdClass;

class UserItemDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
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
     * @var string
     */
    protected string $accountStorageDir;
    /**
     * @var array|iterable
     */
    protected $itemExtensions;

    public function __construct(
        ManagerRegistry $managerRegistry,
        Base64FileExtractor $base64FileExtractor,
        string $accountStorageDir,
        iterable $itemExtensions = []
    ) {
        $this->managerRegistry = $managerRegistry;
        $this->base64FileExtractor = $base64FileExtractor;
        $this->accountStorageDir = $accountStorageDir;
        $this->itemExtensions = $itemExtensions;
    }

    /**
     * @return stdClass
     */
    protected function roleAccess(): stdClass
    {
        $list = new stdClass();

        $list->admin = new Admin();
        $list->client = new Client();
        $list->manager = new Manager();
        $list->seo = new Seo();

        return $list;

    }

    /**
     * @param string $resourceClass
     * @param string|null $operationName
     * @param array $context
     * @return bool
     * @throws \ReflectionException
     */
    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        $class = strtolower((new ReflectionClass($resourceClass))->getShortName());

        return $resourceClass === Client::class || $resourceClass === Manager::class || $resourceClass === Seo::class || $resourceClass === Admin::class;

//        return $this->roleAccess()->$class instanceof User;
    }

    /**
     * @param string $resourceClass
     * @param array|int|object|string $id
     * @param string|null $operationName
     * @param array $context
     * @return object|null
     */
    public function getItem(string $resourceClass, $id, string $operationName = null, array $context = []): ?object
    {
        $manager = $this->managerRegistry->getManagerForClass($resourceClass);
        $user = $manager->getRepository($resourceClass)->find($id);
        if ($mediaObject = $user->getMediaObject()) {
            $mediaObject->setBase64(
                $this->base64FileExtractor->convertToBase64(
                    $this->accountStorageDir . $mediaObject->getStorage() . '/' . $mediaObject->getContentUrl()
                )
            );
        }
        return $user;
    }
}
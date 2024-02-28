<?php


namespace App\Resolver;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\MediaObject;
use App\Entity\User;
use App\Service\Media\FileUploader;
use App\Service\Media\UploadedBase64File;
use App\Utils\Base64FileExtractor;
use App\Utils\FileSingleton;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * Class ChangeMediaObjectMutationResolver
 * @package App\Resolver
 */
class ChangeMediaObjectMutationResolver implements MutationResolverInterface
{
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;
    /**
     * @var TokenStorageInterface
     */
    private TokenStorageInterface $storage;
    /**
     * @var string
     */
    private string $accountStorageDir;
    /**
     * @var Filesystem
     */
    private Filesystem $filesystem;
    /**
     * @var FileSingleton
     */
    private FileSingleton $fileSingleton;
    /**
     * @var FileUploader
     */
    private FileUploader $fileUploader;
    /**
     * @var Base64FileExtractor
     */
    private Base64FileExtractor $base64FileExtractor;

    /**
     * ChangeMediaObjectMutationResolver constructor.
     * @param EntityManagerInterface $entityManager
     * @param Base64FileExtractor $base64FileExtractor
     * @param TokenStorageInterface $storage
     * @param FileSingleton $fileSingleton
     * @param Filesystem $filesystem
     * @param FileUploader $fileUploader
     * @param string $accountStorageDir
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        Base64FileExtractor $base64FileExtractor,
        TokenStorageInterface $storage,
        FileSingleton $fileSingleton,
        Filesystem $filesystem,
        FileUploader $fileUploader,
        string $accountStorageDir)
    {
        $this->entityManager = $entityManager;
        $this->storage = $storage;
        $this->accountStorageDir = $accountStorageDir;
        $this->filesystem = $filesystem;
        $this->fileSingleton = $fileSingleton;
        $this->fileUploader = $fileUploader;
        $this->base64FileExtractor = $base64FileExtractor;
    }

    /**
     * @param MediaObject|null $item
     *
     * @return MediaObject
     * @throws Exception
     */
    public function __invoke($item, array $context)
    {
        $file = $context['args']['input']['mediaFile'];
        /** @var MediaObject $mediaObject */
        $mediaObject = $this->storage->getToken()->getUser()->getMediaObject();

        if (!$mediaObject) {
            $path = $this->fileSingleton->generateRandomPath(3);
            $directory = $this->fileSingleton->createDirectory($this->filesystem, $this->accountStorageDir . $path);
            $this->fileUploader->setTargetDirectory($directory);
            $base64Image = $this->base64FileExtractor->extractBase64String($file);
            $imageFile = new UploadedBase64File($base64Image);

            $mediaObject = new MediaObject();
            $mediaObject
                ->setStorage($path)
                ->setContentUrl($this->fileUploader->upload($imageFile))
                ->setType(MediaObject::AVATAR_TYPE)
                ->setUser($this->storage->getToken()->getUser());
        } else {
            $directory = $this->accountStorageDir . $mediaObject->getStorage();
            // delete old file
            unlink($directory . '/' . $mediaObject->getContentUrl());

            // set new file to database and storage folder
            $this->fileUploader->setTargetDirectory($directory);
            $base64Image = $this->base64FileExtractor->extractBase64String($file);
            $imageFile = new UploadedBase64File($base64Image);

            $mediaObject->setContentUrl($this->fileUploader->upload($imageFile));
        }

        $this->entityManager->persist($mediaObject);
        $this->entityManager->flush();

        return null;
    }
}
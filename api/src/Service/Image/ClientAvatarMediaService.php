<?php


namespace App\Service\Image;

use App\Entity\UserImage;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Class ClientAvatarMediaService
 * @package App\Service\Image
 */
class ClientAvatarMediaService implements MediaServiceInterface
{
    public static $defaultPath = '%s/images/user/profile/image.png';
    public static $defaultStoragePath = '%s/images/original/user/profile/image.png';

    /**
     * @var ImageService
     */
    protected ImageService $imageService;
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /** @var string */
    protected string $filePath;
    /** @var string */
    protected string $fakeFilePath;

    /**
     * ClientAvatarMediaService constructor.
     * @param ImageService $imageService
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(
        ImageService $imageService,
        EntityManagerInterface $entityManager
    ) {
        $this->imageService = $imageService;
        $this->entityManager = $entityManager;
        $this->fakeFilePath = 'images/user/profile/';
        $this->filePath = 'images/original/user/profile/';
    }

    /**
     * @param $content
     * @param $type
     * @param null $object
     * @param null $mediaId
     * @param null $filePath
     * @return UserImage
     * @throws \Safe\Exceptions\FilesystemException
     */
    public function upload($content, $type, $object = null, $mediaId = null, $filePath = null)
    {
        $collection = $object->getImageMedia($type);

        if (!$collection->isEmpty()) {
            $avatar = $collection->first();
            if ($avatar->getFilePath() !== self::$defaultPath) {
                $this->imageService->remove(
                    $this->imageService->getStorageDir() . $avatar->getStorageFilePath()
                );
            }
        } else {
            $avatar = (new UserImage())->setType('avatar');
        }

        $uploaded = $this->imageService->uploadContentUrl($content, $this->filePath);

        $object->addImage(
            $avatar
                ->setFilePath(
                    str_replace(
                        $this->filePath,
                        $this->fakeFilePath,
                        $uploaded['filePath']
                    )
                )
                ->setStorageFilePath($uploaded['storagePath'])
        );

        $this->entityManager->persist($avatar);
        $this->entityManager->flush();

        return $avatar;
    }
}

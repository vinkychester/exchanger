<?php


namespace App\Service\Image;

use App\Entity\SystemImage;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Class ClientAvatarMediaService
 * @package App\Service\Image
 */
class SystemImageMediaService implements MediaServiceInterface
{
    public static $defaultPath = 'images/%s/content/image.png';
    public static $defaultStoragePath = 'images/original/%s/content/image.png';

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
        $this->fakeFilePath = 'images/%s/content/';
        $this->filePath = 'images/original/%s/content/';
    }

    /**
     * @param $content
     * @param $type
     * @param null $object
     * @param null $mediaId
     * @param null $filePath
     * @return SystemImage
     * @throws \Safe\Exceptions\FilesystemException
     */
    public function upload($content, $type, $object = null, $mediaId = null, $filePath = null)
    {
        $collection = $object->getImage()->filter(
            function ($imageItem) use ($mediaId, $filePath) {
                return $imageItem->getId() === $mediaId || $imageItem->getFilePath() === $filePath;
            }
        );

        if (!$collection->isEmpty()) {
            $imageItem = $collection->first();
            if ($imageItem->getFilePath() !== sprintf(self::$defaultPath, $type)) {
                $this->imageService->remove(
                    $this->imageService->getStorageDir() . $imageItem->getStorageFilePath()
                );
            }
        } else {
            $imageItem = (new SystemImage())->setType($type);
        }

        $uploaded = $this->imageService->uploadContentUrl($content, sprintf($this->filePath, $type));

        $object->addImage(
            $imageItem
                ->setFilePath(
                    str_replace(
                        sprintf($this->filePath, $type),
                        sprintf($this->fakeFilePath, $type),
                        $uploaded['filePath']
                    )
                )
                ->setStorageFilePath($uploaded['storagePath'])
        );

        $this->entityManager->persist($imageItem);
        $this->entityManager->flush();

        return $imageItem;
    }
}

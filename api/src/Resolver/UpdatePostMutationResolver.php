<?php


namespace App\Resolver;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\MediaObject;
use App\Entity\Post;
use App\Service\Image\ImageOptimizerService;
use App\Service\Media\FileUploader;
use App\Service\Media\UploadedBase64File;
use App\Utils\Base64FileExtractor;
use App\Utils\FileSingleton;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Filesystem\Filesystem;

class UpdatePostMutationResolver implements MutationResolverInterface
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var Base64FileExtractor
     */
    private Base64FileExtractor $base64FileExtractor;
    /**
     * @var FileSingleton
     */
    private FileSingleton $fileSingleton;
    /**
     * @var FileUploader
     */
    private FileUploader $fileUploader;
    /**
     * @var string
     */
    private string $postDir;
    /**
     * @var Filesystem
     */
    private Filesystem $filesystem;

    /**
     * CreateCreditCardMutationResolver constructor.
     * @param EntityManagerInterface $entityManager
     * @param Base64FileExtractor $base64FileExtractor
     * @param FileSingleton $fileSingleton
     * @param FileUploader $fileUploader
     * @param Filesystem $filesystem
     * @param string $postDir
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        Base64FileExtractor $base64FileExtractor,
        FileSingleton $fileSingleton,
        FileUploader $fileUploader,
        Filesystem $filesystem,
        string $postDir
    ) {
        $this->base64FileExtractor = $base64FileExtractor;
        $this->fileSingleton = $fileSingleton;
        $this->fileUploader = $fileUploader;
        $this->postDir = $postDir;
        $this->filesystem = $filesystem;
        $this->entityManager = $entityManager;
    }

    /**
     * @param Post|null $item
     *
     * @return Post
     * @throws \Exception
     */
    public function __invoke($item, array $context)
    {
        $mediaObjectCropped = $this->entityManager->getRepository(MediaObject::class)->findOneBy(
            ['post' => $item->getId(), 'newsImageType' => 'detail']
        );
        $mediaObjectOriginal = $this->entityManager->getRepository(MediaObject::class)->findOneBy(
            ['post' => $item->getId(), 'newsImageType' => 'preview']
        );
        if ($mediaObjectCropped && $mediaObjectOriginal) {
            $uploadedCroppedFile = $item->getFileCropped();
            $uploadedOriginalFile = $item->getFileOriginal();

            if ($uploadedCroppedFile && $uploadedOriginalFile) {
                $dir = $this->postDir . $mediaObjectCropped->getStorage();
                array_map('unlink', glob("$dir/*.*"));
                $this->fileUploader->setTargetDirectory($dir);
                $fileUploader = $this->fileUploader;
                $base64FileExtractor = $this->base64FileExtractor;
                $base64Image = $base64FileExtractor->extractBase64String($uploadedCroppedFile);
                $imageFile = new UploadedBase64File($base64Image);
                $mediaObjectCropped->setContentUrl($fileUploader->upload($imageFile));

                $base64ImageOriginal = $base64FileExtractor->extractBase64String($uploadedOriginalFile);
                $imageFileOriginal = new UploadedBase64File($base64ImageOriginal);
                $mediaObjectOriginal->setContentUrl($fileUploader->upload($imageFileOriginal));
                $imageOptimizerService = new ImageOptimizerService();
                $imageOptimizerService->resize($dir . "/" . $mediaObjectOriginal->getContentUrl(), 600, 300);
            }
        } else {
            $uploadedCroppedFile = $item->getFileCropped();
            $uploadedOriginalFile = $item->getFileOriginal();

            if ($uploadedCroppedFile && $uploadedOriginalFile) {
                $base64FileExtractor = $this->base64FileExtractor;
                $randomFolder = bin2hex(random_bytes(3));
                $directory = $this->fileSingleton->createDirectory(
                    $this->filesystem,
                    $this->postDir . $randomFolder
                );
                $this->fileUploader->setTargetDirectory($directory);
                $fileUploader = $this->fileUploader;
                $mediaObject = new MediaObject();
                $mediaObjectOriginal = new MediaObject();


                $base64CroppedImage = $base64FileExtractor->extractBase64String($uploadedCroppedFile);
                $base64ImageOriginal = $base64FileExtractor->extractBase64String($uploadedOriginalFile);
                $imageCroppedFile = new UploadedBase64File($base64CroppedImage);
                $imageOriginalFile = new UploadedBase64File($base64ImageOriginal);
                $croppedImageName = $fileUploader->upload($imageCroppedFile);
                $originalImageName = $fileUploader->upload($imageOriginalFile);
                $mediaObject->setContentUrl($croppedImageName);
                $mediaObjectOriginal->setContentUrl($originalImageName);


                $imageOptimizerService = new ImageOptimizerService();
                $imageOptimizerService->resize($this->postDir . $randomFolder . "/" . $originalImageName, 600, 300);

                $mediaObject->setStorage($randomFolder);
                $mediaObjectOriginal->setStorage($randomFolder);
                $mediaObject->setType(MediaObject::POST_TYPE);
                $mediaObjectOriginal->setType(MediaObject::POST_TYPE);
                $mediaObject->setPost($item);
                $mediaObjectOriginal->setPost($item);
                $mediaObject->setNewsImageType(MediaObject::DETAIL_TYPE);
                $mediaObjectOriginal->setNewsImageType(MediaObject::PREVIEW_TYPE);
                $this->entityManager->persist($mediaObject);
                $this->entityManager->persist($mediaObjectOriginal);
                $this->entityManager->flush();
            }
        }

        return $item;
    }
}
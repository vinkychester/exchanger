<?php


namespace App\Resolver;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\CreditCard;
use App\Entity\CreditCardAttachment;
use App\Entity\MediaObject;
use App\Service\Media\FileUploader;
use App\Service\Media\UploadedBase64File;
use App\Utils\Base64FileExtractor;
use App\Utils\FileSingleton;
use Exception;
use Symfony\Component\Filesystem\Filesystem;

class CreateCreditCardMutationResolver implements MutationResolverInterface
{
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
    private string $creditDir;
    /**
     * @var Filesystem
     */
    private Filesystem $filesystem;

    /**
     * CreateCreditCardMutationResolver constructor.
     * @param Base64FileExtractor $base64FileExtractor
     * @param FileSingleton $fileSingleton
     * @param FileUploader $fileUploader
     * @param Filesystem $filesystem
     * @param string $creditDir
     */
    public function __construct(
        Base64FileExtractor $base64FileExtractor,
        FileSingleton $fileSingleton,
        FileUploader $fileUploader,
        Filesystem $filesystem,
        string $creditDir
    )
    {
        $this->base64FileExtractor = $base64FileExtractor;
        $this->fileSingleton = $fileSingleton;
        $this->fileUploader = $fileUploader;
        $this->creditDir = $creditDir;
        $this->filesystem = $filesystem;
    }

    /**
     * @param CreditCard|null $item
     *
     * @return CreditCard
     * @throws Exception
     */
    public function __invoke($item, array $context)
    {
        $uploadedFiles = $item->getFiles();
        $base64FileExtractor = $this->base64FileExtractor;
        $path = $this->fileSingleton->generateRandomPath(3);
        $directory = $this->fileSingleton->createDirectory($this->filesystem, $this->creditDir . $path);
        $this->fileUploader->setTargetDirectory($directory);
        $fileUploader = $this->fileUploader;
        array_walk($uploadedFiles, static function ($value) use ($item, $base64FileExtractor, $fileUploader, $path) {
            $mediaObject = new MediaObject();
            $base64Image = $value['data_url'];
            $base64Image = $base64FileExtractor->extractBase64String($base64Image);
            $imageFile = new UploadedBase64File($base64Image);
            $mediaObject->setStorage($path);
            $mediaObject->setType(MediaObject::CREDIT_TYPE);
            $mediaObject->setContentUrl($fileUploader->upload($imageFile));
            $item->addMediaObject($mediaObject);
        });

        return $item;
    }
}
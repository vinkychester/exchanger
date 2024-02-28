<?php


namespace App\Resolver;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\Mailing;
use App\Service\Media\FileUploader;
use App\Service\Media\UploadedBase64File;
use App\Utils\Base64FileExtractor;
use Symfony\Component\Filesystem\Filesystem;

class CreateMailingMutationResolver implements MutationResolverInterface
{

    /**
     * @var Base64FileExtractor
     */
    protected Base64FileExtractor $base64FileExtractor;
    /**
     * @var FileUploader
     */
    protected FileUploader $fileUploader;
    /**
     * @var Filesystem
     */
    protected Filesystem $filesystem;
    /**
     * @var string
     */
    protected string $mailingFileDir;

    public function __construct(
        Base64FileExtractor $base64FileExtractor,
        FileUploader $fileUploader,
        Filesystem $filesystem,
        string $mailingFileDir
    ) {
        $this->base64FileExtractor = $base64FileExtractor;
        $this->fileUploader = $fileUploader;
        $this->filesystem = $filesystem;
        $this->mailingFileDir = $mailingFileDir;
    }

    /**
     * @param Mailing|null $item
     * @param array $context
     * @return Mailing
     */
    public function __invoke($item, array $context)
    {
        if (isset($context['args']['input']['file'])) {
            if ($uploadedFiles = $context['args']['input']['file']) {
                $base64FileExtractor = $this->base64FileExtractor;
                $this->fileUploader->setTargetDirectory($this->mailingFileDir);
                $base64Image = $base64FileExtractor->extractBase64String($uploadedFiles[0]['data_url']);
                $imageFile = new UploadedBase64File($base64Image);
                $item->setFile($this->fileUploader->upload($imageFile));
            }
        }
        return $item;
    }
}
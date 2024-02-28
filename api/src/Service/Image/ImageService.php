<?php

namespace App\Service\Image;

use Safe\Exceptions\FilesystemException;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Class ImageService
 * @package App\Service\Image
 */
class ImageService extends Filesystem
{
    /**
     * @var ValidatorInterface
     */
    protected ValidatorInterface $validator;
    /**
     * @var string $storageDir
     */
    protected string $storageDir;
    /**
     * @var string $imageStorageDir
     */
    protected string $imageStorageDir;

    /**
     * ImageService constructor.
     * @param ValidatorInterface $validator
     * @param string $storageDir
     * @param string $imageStorageDir
     */
    public function __construct(
        ValidatorInterface $validator,
        string $storageDir,
        string $imageStorageDir
    ) {
        $this->validator = $validator;
        $this->storageDir = $storageDir;
        $this->imageStorageDir = $imageStorageDir;
    }

    /**
     * @param string $storagePath
     * @return string
     */
    public function getContentUrlFile(string $storagePath): string
    {
        try {
            return 'data:image/' . pathinfo($this->storageDir . $storagePath, PATHINFO_EXTENSION) . ';base64,' .
                base64_encode(
                    file_get_contents($this->storageDir . $storagePath)
                );
        } catch (\Exception $exception) {
        }

        return '';
    }

    /**
     * @param string $base64Image
     * @param string $directory
     * @return array
     * @throws FilesystemException
     */
    public function uploadContentUrl(string $base64Image, string $directory)
    {
        $image = $this->extractBase64String($base64Image);

        $fileName = $this->generateFileName($image['extension']);
        $imageFile = new UploadedBase64File($image['content'], $fileName, $image['mimeType']);

        return $this->uploadFile($imageFile, $directory, $fileName);
    }

    /**
     * @param string $base64Content
     * @return mixed
     */
    protected function extractBase64String(string $base64Content)
    {
        preg_match("/data:([a-zA-Z0-9]+\/([a-zA-Z0-9-.+]+)).*,(.*)/", $base64Content, $matches);

        return ['mimeType' => $matches[1], 'extension' => $matches[2], 'content' => $matches[3]];
    }

    /**
     * @param UploadedFile $file
     * @param string $directory
     * @param string $fileName
     * @return array
     * @throws FilesystemException
     */
    public function uploadFile(UploadedFile $file, string $directory, ?string $fileName = null)
    {
        $randomPath = $this->generateRandomPath();
        $fileName = $fileName ?? $this->generateFileName($file->getExtension());
        $storagePath = $this->getStorageDir() . $directory . $randomPath;

        try {
            $file->move($storagePath, $fileName);
        } catch (\Exception $exception) {
            throw new FilesystemException($exception->getMessage(), 204);
        }

        return [
            'filePath'    => $directory . $fileName,
            'storagePath' => $directory . $randomPath . $fileName,
            'object'      => $file
        ];
    }

    /**
     * @return string
     */
    public function getStorageDir(): string
    {
        return $this->storageDir;
    }

    /**
     * @param int $length
     * @return string
     * @throws \Exception
     */
    protected function generateRandomPath($length = 1): string
    {
        return bin2hex(random_bytes($length)) . '/' . bin2hex(random_bytes($length)) . '/';
    }

    /**+
     * @param string $extension
     * @return string
     */
    protected function generateFileName(string $extension)
    {
        return uniqid('', true) . '.' . $extension;
    }
}

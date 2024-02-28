<?php


namespace App\Service\Image;


use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * Class UploadedBase64File
 * @package App\Service
 */
class UploadedBase64File extends UploadedFile
{
    /**
     * UploadedBase64File constructor.
     * @param string $base64String
     * @param string $originalName
     * @param string|null $mimeType
     */
    public function __construct(string $base64String, $originalName, string $mimeType = null)
    {
        $filePath = tempnam(sys_get_temp_dir(), 'UploadedFile');
        $data = base64_decode($base64String);
        file_put_contents($filePath, $data);

        parent::__construct($filePath, $originalName, $mimeType, null, true);
    }
}

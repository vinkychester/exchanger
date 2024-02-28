<?php


namespace App\Service\Media;

use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * Class UploadedBase64File
 * @package App\Service\Media
 */
class UploadedBase64File extends UploadedFile
{
    /**
     * UploadedBase64File constructor.
     * @param string $base64String
     * @param string $originalName
     */
    public function __construct(string $base64String, string $originalName = "")
    {
        $filePath = tempnam(sys_get_temp_dir(), 'UploadedFile');
        $data = base64_decode($base64String);
        file_put_contents($filePath, $data);
        $error = null;
        $mimeType = null;
        $test = true;

        parent::__construct($filePath, $originalName, $mimeType, $error, $test);
    }

}
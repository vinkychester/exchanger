<?php


namespace App\Utils;

/**
 * Class Base64FileExtractor
 * @package App\Utils
 */
class Base64FileExtractor
{
    /**
     * @param string $base64Content
     * @return string
     */
    public function extractBase64String(string $base64Content): string
    {
        $data = explode( ';base64,', $base64Content);
        return $data[1];
    }

    /**
     * @param string $file
     * @return string
     */
    public function convertToBase64(string $file): string
    {
        $type = pathinfo($file, PATHINFO_EXTENSION);
        $data = file_get_contents($file);
        return 'data:image/' . $type . ';base64,' . base64_encode($data);
    }
}
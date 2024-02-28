<?php


namespace App\Service\Image;

/**
 * Interface MediaServiceInterface
 * @package App\Service\Image
 */
interface MediaServiceInterface
{
    /**
     * @param $content
     * @param $type
     * @param null $object
     * @param null $mediaId
     * @param null $filePath
     * @return mixed
     */
    public function upload($content, $type, $object = null, $mediaId = null, $filePath=null);
}

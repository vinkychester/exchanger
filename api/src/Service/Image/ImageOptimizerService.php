<?php

namespace App\Service\Image;


use Imagine\Image\Box;
use Imagine\Imagick\Imagine;

class ImageOptimizerService
{
    private $imagine;


    public function __construct()
    {
        $this->imagine = new Imagine();
    }

    public function resize(string $filename, $width, $height)
    {
        list($iwidth, $iheight) = getimagesize($filename);

        $ratio = $iwidth / $iheight;

        if ($width / $height > $ratio) {
            $width = $height * $ratio;
        } else {
            $height = $width / $ratio;
        }


        $photo = $this->imagine->open($filename);

        $photo->resize(new Box($width, $height))->save($filename);
    }
}
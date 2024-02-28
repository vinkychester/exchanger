<?php


namespace App\Utils;


use Exception;
use Symfony\Component\Filesystem\Filesystem;

/**
 * Class FileSingleton
 * @package App\Utils
 */
class FileSingleton
{
    private static FileSingleton $instance;

    /**
     * @return FileSingleton
     */
    public static function getInstance(): FileSingleton
    {
        if (null === static::$instance) {
            static::$instance = new static();
        }

        return static::$instance;
    }

    /**
     * @param Filesystem $filesystem
     * @param string $directory
     * @return string
     */
    public function createDirectory(Filesystem $filesystem, string $directory): string
    {
        if (!$filesystem->exists($directory)) {
            $filesystem->mkdir($directory, $mode = 0777);
            chmod($directory, 0777);
        }

        return $directory;
    }

    /**
     * @param $image
     * @param string $directory
     */
    public function deleteImage($image, string $directory): void
    {
        if (file_exists($directory . '/' . $image)) {
            unlink($directory . '/' . $image);
        }
    }

    /**
     * @param int $length
     * @return string
     * @throws Exception
     */
    public function generateRandomPath(int $length = 1): string
    {
        return bin2hex(random_bytes($length));
    }
}
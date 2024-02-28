<?php


namespace App\Utils;

/**
 * Class Signature
 * @package App\Utils
 */
class Signature
{
    /**
     * @param string $data
     * @param string $signature
     * @param string $key
     * @return bool
     */
    public static function check(string $data, string $signature, string $key)
    {
        $hash = base64_encode(hash_hmac('sha256', $data, $key, true));

        if ($hash != $signature) {
            file_get_contents("https://api.telegram.org/bot1132760191:AAHk2HgyE-aJxaTvXzGASSDNPzFkTGoGYYo/sendMessage?chat_id=-1001479842731&parse_mode=html&text=" .
                "ERROR Signature"
            );

            return false;
        }
        return true;
    }
}
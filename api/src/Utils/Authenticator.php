<?php


namespace App\Utils;

use Symfony\Component\HttpClient\NativeHttpClient;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

/**
 * Class Authenticator
 * @package App\Utils
 */
class Authenticator
{
    /**
     * @param string $type
     * @param array $params
     * @param string $publicKey
     * @param string $secretKey
     * @return array
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public static function login(string $type, string $publicKey, string $secretKey, array $params = [])
    {
        $client = new NativeHttpClient();

        $response = $client->request(
            'POST',
            'https://controlpanel.crpt.trading/v1/auth',
            [
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
                'json'    => [
                    'username' => $publicKey,
                    'password' => $secretKey,
                    'type'     => $type,
                    'params'   => $params
                ]
            ]
        );

        return $response->toArray();
    }
}

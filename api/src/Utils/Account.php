<?php


namespace App\Utils;


use Symfony\Component\HttpClient\NativeHttpClient;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

/**
 * Class Account
 * @package App\Utils
 */
class Account
{
    /**
     * @param string $name
     * @param string $publicKey
     * @param string $secretKey
     * @return array
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public static function settings(string $name, string $publicKey, string $secretKey)
    {
        $client = new NativeHttpClient();

        $response = $client->request(
            'GET',
            'https://controlpanel.crpt.trading/project-settings/provider-crypto/' . $name,
            [
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
                'json'    => [
                    'username' => $publicKey,
                    'password' => $secretKey,
                ]
            ]
        );

        return $response->toArray();
    }
}

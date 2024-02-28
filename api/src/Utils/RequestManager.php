<?php


namespace App\Utils;

use Symfony\Component\HttpClient\NativeHttpClient;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

/**
 * Class RequestManager
 * @package App\Utils
 */
class RequestManager
{
    /**
     * @param string $url
     * @param string $token
     * @return array
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function getResponse(string $url, string $token): array
    {
        $client = new NativeHttpClient();

        return $client->request(
            'GET',
            $url,
            [
                'headers' => [
                    'Content-Type'  => 'application/json',
                    'Authorization' => 'JWS-AUTH-TOKEN ' . $token
                ]
            ]
        )->toArray();
    }
}
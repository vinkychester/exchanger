<?php


namespace App\Utils;


use Jose\Component\Core\AlgorithmManager;
use Jose\Component\KeyManagement\JWKFactory;
use Jose\Component\Signature\Algorithm\HS256;
use Jose\Component\Signature\JWSBuilder;
use Jose\Component\Signature\Serializer\CompactSerializer;

class EncryptionManager
{
    /**
     * @param string $controlPanelID
     * @param string $controlPanelSecret
     * @return string
     * @throws \JsonException
     */
    public static function encodeSecretKey(string $controlPanelID, string $controlPanelSecret): string
    {
        $algorithmManager = new AlgorithmManager([new HS256()]);

        $jwk = JWKFactory::createFromSecret(
            $controlPanelSecret, // The shared secret
            [
                'alg' => 'HS256',
                'use' => 'sig'
            ]
        );

        $jwsBuilder = new JWSBuilder($algorithmManager);

        $payload = json_encode(
            [
                "projectId" => $controlPanelID,
                'iat'       => time(),
                'exp'       => time() + 3600
            ],
            JSON_THROW_ON_ERROR
        );

        $jws = $jwsBuilder
            ->create()                               // We want to create a new JWS
            ->withPayload($payload)                  // We set the payload
            ->addSignature($jwk, ['alg' => 'HS256']) // We add a signature with a simple protected header
            ->build();
        $serializer = new CompactSerializer(); // The serializer

        return $serializer->serialize($jws, 0);
    }
}
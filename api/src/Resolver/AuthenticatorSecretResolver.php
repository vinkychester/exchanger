<?php

namespace App\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use App\Service\GoogleTwoFactorAuth;
use Sonata\GoogleAuthenticator\GoogleAuthenticator;

/**
 * Class AuthenticatorSecretResolver
 * @package App\Resolver
 */
class AuthenticatorSecretResolver implements QueryItemResolverInterface
{

    public function __invoke($item, array $context)
    {
        $google = new GoogleAuthenticator();
        $item->setTempSecret($google->generateSecret());
        $item->setTempQRCode(GoogleTwoFactorAuth::generateTempQrCode($item));

        return $item;
    }
}
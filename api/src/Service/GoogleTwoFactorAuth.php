<?php


namespace App\Service;


use Sonata\GoogleAuthenticator\GoogleQrUrl;

/**
 * Class GoogleTwoFactorAuth
 * @package App\Service
 */
class GoogleTwoFactorAuth
{
    /**
     * @param object $user
     * @return string|null
     */
    public static function generateQrCode(object $user): ?string
    {
        if ($user->isGoogleAuthenticatorEnabled()) {
            return GoogleQrUrl::generate($_ENV['GOOGLE_QR_CODE_HOST'], $user->getGoogleAuthenticatorSecret());
        }

        return null;
    }

    /**
     * @param object $client
     * @return string
     */
    public static function generateTempQrCode(object $client): string
    {
        return GoogleQrUrl::generate($_ENV['GOOGLE_QR_CODE_HOST'], $client->getTempSecret());
    }
}

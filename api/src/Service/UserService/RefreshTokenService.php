<?php


namespace App\Service\UserService;


use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Gesdinet\JWTRefreshTokenBundle\Entity\RefreshToken;
use Gesdinet\JWTRefreshTokenBundle\Model\RefreshTokenManagerInterface;

class RefreshTokenService
{

    /**
     * @var RefreshTokenManagerInterface
     */
    protected RefreshTokenManagerInterface $refreshTokenManager;
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * RefreshTokenService constructor.
     * @param RefreshTokenManagerInterface $refreshTokenManager
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(
        RefreshTokenManagerInterface $refreshTokenManager,
        EntityManagerInterface $entityManager
    ) {
        $this->refreshTokenManager = $refreshTokenManager;
        $this->entityManager = $entityManager;
    }


    /**
     * @param $userName
     * @return string
     */
    public function getRefreshToken($userName): string
    {
        date_default_timezone_set('Europe/Kiev');

        $refreshToken = $this->entityManager->getRepository(RefreshToken::class)->findOneBy(['username' => $userName]);

        if (!$refreshToken) {
            $refreshToken = $this->refreshTokenManager->create();;
        }
        $refreshToken->setRefreshToken();
        $datetime = new DateTime();
        $datetime->modify('+28800 seconds');
        $refreshToken->setValid($datetime);
        $refreshToken->setUsername($userName);
        $this->entityManager->persist($refreshToken);
        $this->entityManager->flush();

        return $refreshToken->getRefreshToken();
    }
}
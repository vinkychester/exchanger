<?php

namespace App\Security;

use App\Entity\Client;
use App\Entity\User;
use App\Events\LoginGoogle2FactorFailedAttemptEvent;
use App\Events\LoginUserWithBannEvent;
use App\Events\UserAuthorizationSuccessEvent;
use App\Service\Log\LogServiceODM;
use App\Service\UserService\RefreshTokenService;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Google_Client;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Sonata\GoogleAuthenticator\GoogleAuthenticator;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;

/**
 * Class TokenAuthenticator
 * @package App\Security
 */
class GoogleTwoFactorsAuthenticator extends AbstractGuardAuthenticator
{
    /**
     * @var JWTTokenManagerInterface
     */
    protected JWTTokenManagerInterface $tokenManager;
    /**
     * @var LogServiceODM
     */
    protected LogServiceODM $LogServiceODM;
    /**
     * @var RefreshTokenService
     */
    protected RefreshTokenService $refreshTokenService;
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $em;

    /**
     * @var EventDispatcherInterface
     */
    private EventDispatcherInterface $eventDispatcher;

    /**
     * @var Google_Client
     */
    protected Google_Client $googleClient;

    /**
     * GoogleTwoFactorsAuthenticator constructor.
     * @param RefreshTokenService $refreshTokenService
     * @param JWTTokenManagerInterface $tokenManager
     * @param EntityManagerInterface $em
     * @param Google_Client $googleClient
     * @param EventDispatcherInterface $eventDispatcher
     * @param LogServiceODM $LogServiceODM
     */
    public function __construct(
        RefreshTokenService $refreshTokenService,
        JWTTokenManagerInterface $tokenManager,
        EntityManagerInterface $em,
        Google_Client $googleClient,
        EventDispatcherInterface $eventDispatcher,
        LogServiceODM $LogServiceODM
    ) {
        $this->em = $em;
        $this->googleClient = $googleClient;
        $this->tokenManager = $tokenManager;
        $this->eventDispatcher = $eventDispatcher;
        $this->LogServiceODM = $LogServiceODM;
        $this->refreshTokenService = $refreshTokenService;
    }

    /**
     * Called on every request to decide if this authenticator should be
     * used for the request. Returning `false` will cause this authenticator
     * to be skipped.
     * @param Request $request
     * @return bool
     */
    public function supports(Request $request)
    {
        $response = json_decode($request->getContent());

        return isset($response->id, $response->code);
    }

    /**
     * Called on every request. Return whatever credentials you want to
     * be passed to getUser() as $credentials.
     * @param Request $request
     * @return array
     */
    public function getCredentials(Request $request)
    {
        $response = json_decode($request->getContent());

        return array(
            'id'   => $response->id,
            'code' => $response->code
        );
    }

    /**
     * @param mixed $credentials
     * @param UserProviderInterface $userProvider
     * @return UserInterface|null|object
     */
    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        if (null === $credentials) {
            return null;
        }

        return $this->em->getRepository(User::class)->findOneBy(['id' => $credentials['id']]);
    }

    /**
     * @param mixed $credentials
     * @param UserInterface $user
     * @return bool
     * @throws Exception
     */
    public function checkCredentials($credentials, UserInterface $user)
    {
        $google = new GoogleAuthenticator();

        if ($google->checkCode($user->getGoogleAuthenticatorSecret(), $credentials['code'])) {
            setcookie('F', '', 10);   // remove cookies after login
            $user->setLastActivity(time());
            $this->em->persist($user);
            $this->em->flush();

            return true;
        }

        if ($user instanceof Client) {
            return false;
        }

        if (isset($_COOKIE['F'])) {
            $decodeCountEnters = json_decode(base64_decode($_COOKIE['F']))->data + 1;

            $this->eventDispatcher->dispatch(new LoginGoogle2FactorFailedAttemptEvent($user, $decodeCountEnters));

            if ($decodeCountEnters >= 10) {
                $user->setIsBanned(true);
                $this->em->persist($user);
                $this->em->flush();

                setcookie('F', '', 10);   // remove cookies after ban.
                $this->eventDispatcher->dispatch(new LoginUserWithBannEvent($user));

                throw new HttpException(409);
            } else {
                $expiry = json_decode(base64_decode($_COOKIE['F']))->expiry;
                $cookieData = (object)array("data" => $decodeCountEnters, "expiry" => $expiry);
                setcookie('F', base64_encode(json_encode($cookieData)), $expiry);
            }
        } else {
            $expiry = time() + 3600 * 24;
            $cookieData = (object)array("data" => 1, "expiry" => $expiry);
            setcookie('F', base64_encode(json_encode($cookieData)), $expiry);

            $this->eventDispatcher->dispatch(new LoginGoogle2FactorFailedAttemptEvent($user));
        }

        return false;
    }

    /**
     * @param Request $request
     * @param TokenInterface $token
     * @param string $providerKey
     * @return JsonResponse
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $providerKey)
    {
        $this->eventDispatcher->dispatch(new UserAuthorizationSuccessEvent($token->getUser(), get_class($this)));

        if (in_array(User::MANAGER, $token->getUser()->getRoles())) {
            $refreshToken = $this->refreshTokenService->getRefreshToken($token->getUsername());
            return new JsonResponse(['token' => $this->tokenManager->create($token->getUser()), 'refresh_token' => $refreshToken], Response::HTTP_OK);
        }

        return new JsonResponse(['token' => $this->tokenManager->create($token->getUser())], Response::HTTP_OK);
    }

    /**
     * @param Request $request
     * @param AuthenticationException $exception
     * @return void
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        throw new AccessDeniedHttpException('Invalid auth code');
    }

    /**
     * Called when authentication is needed, but it's not sent
     * @param Request $request
     * @param AuthenticationException|null $authException
     * @return JsonResponse
     */
    public function start(Request $request, AuthenticationException $authException = null)
    {
        $data = [
            'message' => 'Authentication Required'
        ];

        return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }

    /**
     * @return bool
     */
    public function supportsRememberMe()
    {
        return false;
    }
}

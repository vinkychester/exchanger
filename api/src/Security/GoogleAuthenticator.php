<?php


namespace App\Security;

use App\Entity\Client;
use App\Entity\User;
use App\Events\UserAuthorizationSuccessEvent;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Google\Client as GoogleClient;
use JsonException;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
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
 * Class GoogleAuthenticator
 * @package App\Security
 */
class GoogleAuthenticator extends AbstractGuardAuthenticator
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var JWTTokenManagerInterface
     */
    protected JWTTokenManagerInterface $tokenManager;
    /**
     * @var EventDispatcherInterface
     */
    protected EventDispatcherInterface $eventDispatcher;
    /**
     * @var GoogleClient
     */
    private GoogleClient $googleClient;

    /**
     * GoogleAuthenticator constructor.
     * @param EntityManagerInterface $entityManager
     * @param JWTTokenManagerInterface $tokenManager
     * @param EventDispatcherInterface $eventDispatcher
     * @param string $googleClientId
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        JWTTokenManagerInterface $tokenManager,
        EventDispatcherInterface $eventDispatcher,
        string $googleClientId
    ) {
        $this->entityManager = $entityManager;
        $this->tokenManager = $tokenManager;
        $this->googleClient = new GoogleClient(['client_id' => $googleClientId]);
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * @param Request $request
     * @return bool|void
     * @throws JsonException
     */
    public function supports(Request $request)
    {
        $response = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);

        return isset($response["tokenId"], $response["email"]);
    }

    /**
     * @param Request $request
     * @return array|mixed
     * @throws JsonException
     */
    public function getCredentials(Request $request)
    {
        $response = json_decode($request->getContent(), true, 512, JSON_THROW_ON_ERROR);

        return [
            'email'   => $response["email"],
            'tokenId' => $response["tokenId"]
        ];
    }

    /**
     * @param mixed $credentials
     * @param UserProviderInterface $userProvider
     * @return UserInterface|null
     */
    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        if (null === $credentials) {
            return null;
        }

        $email = $credentials['email'];
        $tokenId = $credentials['tokenId'];

        $payload = $this->googleClient->verifyIdToken($tokenId);

        if (!$payload || $email !== $payload['email']) {
            return null;
        }

        /** @var User $user */
        $user = null;

        try {
            $user = $userProvider->loadUserByUsername($email);
            if (!$user->getIsEnabled()) {
                $user->setIsEnabled(true);
                $this->entityManager->persist($user);
                $this->entityManager->flush();
            }
            if ($user->isGoogleAuthenticatorEnabled()) {
                return $user;
            }
            if (!$user instanceof Client) {
                $this->entityManager->getRepository(User::class)->updateUserInfoFromGooglePayload($user, $payload);
                $this->entityManager->persist($user);
                $this->entityManager->flush();
            }
        } catch (Exception $exception) {
            if (isset($payload["hd"]) && $payload["hd"] === "crpt.trading") {
                throw new AccessDeniedHttpException(
                    "Если вы пытаетесь войти как менеджер - вас нет в системе. 
                    Обратитесь к администрации сайта"
                );
            }

            $user = $this->entityManager->getRepository(User::class)->createClientFromGooglePayload($payload);
        }

        return $user;
    }

    /**
     * @param mixed $credentials
     * @param UserInterface $user
     * @return bool
     */
    public function checkCredentials($credentials, UserInterface $user)
    {
        if ($user->getIsBanned()) {
            throw new HttpException(409);
        }

        return true;
    }

    /**
     * @param Request $request
     * @param AuthenticationException $exception
     * @return JsonResponse|Response|null
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        $data = [
            'message' => strtr($exception->getMessageKey(), $exception->getMessageData())
        ];

        return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }

    /**
     * @param Request $request
     * @param TokenInterface $token
     * @param string $providerKey
     * @return JsonResponse|Response|null
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $providerKey)
    {
        if ($token->getUser() instanceof Client) {
            if (!$token->getUser()->isGoogleAuthenticatorEnabled()) {
                $this->eventDispatcher->dispatch(new UserAuthorizationSuccessEvent($token->getUser(), get_class($this)));
                return new JsonResponse(['token' => $this->tokenManager->create($token->getUser())], Response::HTTP_OK);
            } else {
                return new JsonResponse(['id' => $token->getUser()->getId()], Response::HTTP_OK);
            }
        }
        if (!$token->getUser()->isGoogleAuthenticatorEnabled()) {
            return new JsonResponse(['message' => 'Обратитесь в службу поддержки чтоб получить код'], 201);
        }

        return new JsonResponse(['id' => $token->getUser()->getId()], Response::HTTP_OK);
    }

    /**
     * @return bool
     */
    public function supportsRememberMe(): bool
    {
        return false;
    }

    /**
     * @param Request $request
     * @param AuthenticationException|null $authException
     * @return JsonResponse|Response
     */
    public function start(Request $request, AuthenticationException $authException = null)
    {
        return new JsonResponse(['message' => 'Authentication Required'], Response::HTTP_UNAUTHORIZED);
    }
}

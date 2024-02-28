<?php


namespace App\Security;


use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Sonata\GoogleAuthenticator\GoogleAuthenticator;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;

class GoogleTwoFactorsAuthenticatorConfirm extends AbstractGuardAuthenticator
{

    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $em;

    /**
     * GoogleTwoFactorsAuthenticator constructor.
     * @param EntityManagerInterface $em
     */
    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
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

        return isset($response->id, $response->code, $response->tempSecret, $response->on);
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
            'id'         => $response->id,
            'code'       => $response->code,
            'tempSecret' => $response->tempSecret,
            'on'         => $response->on
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
        if ($credentials['on']) {
            if ($google->checkCode($credentials['tempSecret'], $credentials['code'])) {
                return true;
            }
        } else {
            if ($google->checkCode($user->getGoogleAuthenticatorSecret(), $credentials['code'])) {
                return true;
            }
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
        return new JsonResponse(['status' => 'success'], Response::HTTP_OK);
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
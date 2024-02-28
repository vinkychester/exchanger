<?php


namespace App\Security;


use App\Entity\Client;
use App\Entity\User;
use Exception;
use Sonata\GoogleAuthenticator\GoogleAuthenticator;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Security\Core\Exception\LazyResponseException;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * Class UserChecker
 * @package App\Security
 */
class UserChecker implements UserCheckerInterface
{
    /**
     * @var Session
     */
    protected Session $session;

    /**
     * @var RequestStack
     */
    protected RequestStack $requestStack;

    /**
     * @param Session $session
     * @param RequestStack $requestStack
     */
    public function __construct(Session $session, RequestStack $requestStack)
    {
        $this->session = $session;
        $this->requestStack = $requestStack;
    }

    /**
     * @inheritDoc
     * @throws Exception
     */
    public function checkPreAuth(UserInterface $user)
    {
        if (!$user instanceof UserInterface) {
            return null;
        }

        if ($user instanceof Client && !$user->getIsEnabled()) {
            throw new AccessDeniedHttpException(
                'Ваш аккаунт не активирован, пройдите по ссылке, указаной в письме регистрации или обратитесь к администратору'
            );
        }

        if ($user instanceof Client && $user->getIsDeleted()) {
            throw new AccessDeniedHttpException(
                'Ваш аккаунт был удален'
            );
        }
    }

    /**
     * @inheritDoc
     */
    public function checkPostAuth(UserInterface $user)
    {
//        $post_data = json_decode($this->requestStack->getCurrentRequest()->getContent(), true);
//        if ($user->isGoogleAuthenticatorEnabled()) {
//            if (isset($post_data['code']) && isset($post_data['token'])) {
//                if ($this->session->get('tokenTwoAuth') !== $post_data['token']) {
//                    throw new AccessDeniedHttpException(
//                        'Неверны даные авторизации'
//                    );
//                }
//
//                $google = new GoogleAuthenticator();
//
//                if (!$google->checkCode($user->getGoogleAuthenticatorSecret(), $post_data['code'])) {
//                    throw new AccessDeniedHttpException(
//                        'Неверный код подтверждения'
//                    );
//                }
//            } else {
//                $tokenTwoAuth = bin2hex(random_bytes(20));
//
//                $this->session->set('tokenTwoAuth', $tokenTwoAuth);
//
//                throw new LazyResponseException(
//                    new JsonResponse(
//                        [
//                            'tokenTwoAuth' => $tokenTwoAuth,
//                            'username'     => $post_data['username'],
//                            'password'     => $post_data['password']
//                        ], 407
//                    )
//                );
//            }
//        }
    }
}

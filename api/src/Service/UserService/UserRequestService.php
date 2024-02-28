<?php


namespace App\Service\UserService;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * Class UserRequestService
 * @package App\Service\UserService
 */
class UserRequestService
{
    /**
     * @var RequestStack
     */
    protected RequestStack $requestStack;
    protected ?Request $request;

    /**
     * UserRequestService constructor.
     * @param RequestStack $requestStack
     */
    public function __construct(RequestStack $requestStack)
    {
        $this->request = $requestStack->getCurrentRequest();
    }

    /**
     * @return mixed
     */
    public function getIp()
    {
        if ($this->request) {
            if (empty($_SERVER['HTTP_CLIENT_IP']) === false) {
                $ip = $_SERVER['HTTP_CLIENT_IP'];
            } elseif (empty($_SERVER['HTTP_X_FORWARDED_FOR']) === false) {
                $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
            } else {
                $ip = $_SERVER['REMOTE_ADDR'];
            }

            return $ip;
        }

        return 'local command';
    }
}

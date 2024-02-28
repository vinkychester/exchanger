<?php


namespace App\Service\Log;


use Symfony\Component\Security\Core\User\UserInterface;

/**
 * Class UserObjectAdapter
 * @package App\Service\Log
 */
class UserObjectAdapter
{

    /**
     * @var UserInterface| string
     */
    protected $user;

    /**
     * UserObjectAdapter constructor.
     * @param $user
     */
    public function __construct($user)
    {
        $this->user = $user;
    }

    /**
     * @return false|string|UserInterface
     */
    public function getClass()
    {
        return is_object($this->user) ? get_class($this->user) : $this->user . '_systemEvent';
    }

    /**
     * @return string|UserInterface
     */
    public function getEmail()
    {
        return is_object($this->user) ? $this->user->getEmail() : $this->user . '_systemEvent';
    }
}

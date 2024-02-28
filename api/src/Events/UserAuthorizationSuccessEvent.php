<?php

namespace App\Events;

use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Contracts\EventDispatcher\Event;

/**
 * Class UserAuthorizationSuccessEvent
 * @package App\Events
 */
class UserAuthorizationSuccessEvent extends Event
{
    /**
     * @var string $referrer
     */
    protected string $referrer;
    /**
     * @var UserInterface
     */
    private UserInterface $user;

    /**
     * TwoWeekClientNotificationEvent constructor.
     * @param UserInterface $user
     * @param $referrer
     */
    final public function __construct(UserInterface $user, $referrer = 'LoginForm')
    {
        $this->user = $user;
        $this->referrer = $referrer;
    }

    /**
     * @return UserInterface
     */
    final public function getUser()
    {
        return $this->user;
    }

    /**
     * @return mixed
     */
    public function getReferrer()
    {
        return $this->referrer;
    }
}

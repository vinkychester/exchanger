<?php


namespace App\Events;


use App\Entity\User;
use Symfony\Contracts\EventDispatcher\Event;

/**
 * Class UserRegisteredEvent
 * @package App\Events
 */
class UserRegisteredEvent extends Event
{
    /**
     * @var User
     */
    private User $user;

    /**
     * ClientEnabledEvent constructor.
     * @param User $user
     */
    final public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * @return User
     */
    final public function getUser(): User
    {
        return $this->user;
    }
}

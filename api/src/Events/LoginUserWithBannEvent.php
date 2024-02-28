<?php

namespace App\Events;

use Doctrine\Common\Collections\Collection;
use Symfony\Contracts\EventDispatcher\Event;

/**
 * Class TwoWeekClientNotificationEvent
 * @package App\Events
 */
class LoginUserWithBannEvent extends Event
{
    /**
     * @var
     */
    private $user;

    /**
     * TwoWeekClientNotificationEvent constructor.
     * @param $user
     */
    final public function __construct($user)
    {
        $this->user = $user;
    }

    /**
     * @return Collection|iterable
     */
    final public function getUser()
    {
        return $this->user;
    }
}
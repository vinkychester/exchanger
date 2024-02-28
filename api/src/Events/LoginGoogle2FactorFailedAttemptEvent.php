<?php

namespace App\Events;

use Doctrine\Common\Collections\Collection;
use Symfony\Contracts\EventDispatcher\Event;

/**
 * Class TwoWeekClientNotificationEvent
 * @package App\Events
 */
class LoginGoogle2FactorFailedAttemptEvent extends Event
{
    /**
     * @var int
     */
    protected int $attempt;
    /**
     * @var
     */
    private $user;

    /**
     * TwoWeekClientNotificationEvent constructor.
     * @param $user
     * @param $attempt
     */
    final public function __construct($user, $attempt = 1)
    {
        $this->user = $user;
        $this->attempt = $attempt;
    }

    /**
     * @return Collection|iterable
     */
    final public function getUser()
    {
        return $this->user;
    }

    /**
     * @return int
     */
    final public function getAttempt()
    {
        return $this->attempt;
    }
}

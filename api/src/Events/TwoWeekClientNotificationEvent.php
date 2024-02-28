<?php


namespace App\Events;

use Doctrine\Common\Collections\Collection;
use Symfony\Contracts\EventDispatcher\Event;

/**
 * Class TwoWeekClientNotificationEvent
 * @package App\Events
 */
class TwoWeekClientNotificationEvent extends Event
{
    /**
     * @var iterable
     */
    private iterable $users;

    /**
     * TwoWeekClientNotificationEvent constructor.
     * @param iterable $users
     */
    final public function __construct(iterable $users)
    {
        $this->users = $users;
    }

    /**
     * @return Collection|iterable
     */
    final public function getUserCollection()
    {
        return $this->users;
    }

}
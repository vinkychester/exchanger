<?php


namespace App\Events;

use Symfony\Contracts\EventDispatcher\Event;

class TenDaysClientCreditCardNotificationEvent extends Event
{
    /**
     * @var iterable
     */
    private iterable $cards;

    /**
     * ClientCreditCardNotificationEvent constructor.
     * @param iterable $cards
     */
    final public function __construct(iterable $cards)
    {
        $this->cards = $cards;
    }

    /**
     * @return iterable
     */
    final public function getCardCollection()
    {
        return $this->cards;
    }
}
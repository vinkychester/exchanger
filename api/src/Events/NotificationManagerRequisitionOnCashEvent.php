<?php


namespace App\Events;


use Symfony\Contracts\EventDispatcher\Event;

class NotificationManagerRequisitionOnCashEvent extends Event
{
    /**
     * @var array
     */
    private array $requisitions;

    final public function __construct(array $requisitions)
    {
        $this->requisitions = $requisitions;
    }

    /**
     * @return array
     */
    final public function getRequisitionsCollection()
    {
        return $this->requisitions;
    }
}
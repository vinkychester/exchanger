<?php


namespace App\Events;


use App\Entity\Client;
use App\Entity\Requisition;
use Symfony\Contracts\EventDispatcher\Event;

/**
 * Class ChangePasswordEvent
 * @package App\Events
 */
class PayoutRequisitionFinishedEvent extends Event
{
    /**
     * @var Requisition
     */
    protected Requisition $requisition;

    /**
     * @var Client
     */
    private Client $client;

    /**
     * ChangePasswordEvent constructor.
     * @param Requisition $requisition
     * @param Client $client
     */
    public function __construct(
        Requisition $requisition,
        Client $client
    ) {
        $this->requisition = $requisition;
        $this->client = $client;
    }

    /**
     * @return Requisition
     */
    public function getRequisition(): Requisition
    {
        return $this->requisition;
    }

    /**
     * @return Client
     */
    final public function getClient(): Client
    {
        return $this->client;
    }

}
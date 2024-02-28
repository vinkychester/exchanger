<?php


namespace App\Events;


use App\Entity\Client;
use App\Entity\Requisition;
use Symfony\Contracts\EventDispatcher\Event;

/**
 * Class MCCashSecretCodeEvent
 * @package App\Events
 */
class MCCashSecretCodeEvent extends Event
{
    /**
     * @var string
     */
    private string $code;
    /**
     * @var Client
     */
    private Client $client;
    /**
     * @var Requisition
     */
    private Requisition $requisition;

    /**
     * MCCashSecretCodeEvent constructor.
     * @param string $code
     * @param Client $client
     * @param Requisition $requisition
     */
    public function __construct(string $code, Client $client, Requisition $requisition)
    {
        $this->code = $code;
        $this->client = $client;
        $this->requisition = $requisition;
    }

    /**
     * @return string
     */
    public function getCode(): string
    {
        return $this->code;
    }

    /**
     * @param string $code
     */
    public function setCode(string $code): void
    {
        $this->code = $code;
    }

    /**
     * @return Client
     */
    public function getClient(): Client
    {
        return $this->client;
    }

    /**
     * @return Requisition
     */
    public function getRequisition(): Requisition
    {
        return $this->requisition;
    }
}
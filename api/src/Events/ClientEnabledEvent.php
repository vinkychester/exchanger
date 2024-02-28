<?php


namespace App\Events;

use App\Entity\Client;
use Symfony\Contracts\EventDispatcher\Event;

/**
 * Class ClientEnabledEvent
 * @package App\Events
 */
class ClientEnabledEvent extends Event
{
    /**
     * @var Client
     */
    private Client $client;

    /**
     * ClientEnabledEvent constructor.
     * @param Client $client
     */
    final public function __construct(Client $client)
    {
        $this->client = $client;
    }

    /**
     * @return Client
     */
    final public function getClient(): Client
    {
        return $this->client;
    }
}

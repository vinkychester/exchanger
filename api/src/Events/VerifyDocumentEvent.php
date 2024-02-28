<?php


namespace App\Events;

use App\Entity\Client;
use Symfony\Contracts\EventDispatcher\Event;

/**
 * Class DocumentEvent
 * @package App\Events
 */
class VerifyDocumentEvent extends Event
{
    /**
     * @var Client
     */
    private Client $client;

    /**
     * DocumentEvent constructor.
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

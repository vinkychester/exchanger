<?php


namespace App\Events;


use App\Entity\Client;
use Symfony\Contracts\EventDispatcher\Event;

/**
 * Class ChangePasswordEvent
 * @package App\Events
 */
class ChangePasswordEvent extends Event
{
    /**
     * @var Client
     */
    protected Client $client;

    /**
     * ChangePasswordEvent constructor.
     * @param Client $client
     */
    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    /**
     * @return Client
     */
    public function getClient(): Client
    {
        return $this->client;
    }
}
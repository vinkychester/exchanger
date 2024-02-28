<?php


namespace App\Events;


use App\Entity\Client;
use Symfony\Contracts\EventDispatcher\Event;

/**
 * Class ForgotPasswordEvent
 * @package App\Events
 */
class ForgotPasswordEvent extends Event
{
    /**
     * @var Client
     */
    private Client $client;

    /**
     * ForgotPasswordEvent constructor.
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
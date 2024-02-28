<?php


namespace App\EventSubscriber;


use ItlabStudio\ApiClient\Events\AfterRequestEvent;
use ItlabStudio\ApiClient\Events\ApiClientEvents;
use ItlabStudio\ApiClient\Events\MappingFailedEvent;
use ItlabStudio\ApiClient\Events\RequestFailedEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class ApiClientEventSubscriber
 * @package App\EventSubscriber
 */
class ApiClientEventSubscriber implements EventSubscriberInterface
{
    /**
     * @var array
     */
    public static array $CODES = [
        Response::HTTP_CONFLICT, // 409
        Response::HTTP_INTERNAL_SERVER_ERROR, // 500
        Response::HTTP_UNPROCESSABLE_ENTITY, // 422
        Response::HTTP_BAD_REQUEST, // 400
        Response::HTTP_NOT_FOUND, // 400
        Response::HTTP_GATEWAY_TIMEOUT,
        499,
        504,
        429

    ];

    /**
     * @return array
     */
    public static function getSubscribedEvents(): array
    {
        return [
            ApiClientEvents::REQUEST_FAILED => ['onApiClientRequestFailed', 50],
            ApiClientEvents::MAPPING_FAILED => "mappingFailed",
            ApiClientEvents::AFTER_REQUEST  => "afterRequest"
        ];
    }

    /**
     * @param RequestFailedEvent $event
     */
    public function onApiClientRequestFailed(RequestFailedEvent $event)
    {
//        dd($event->getException());
        //@TODO: Do something with exception;
    }

    /**
     * @param MappingFailedEvent $event
     */
    public function mappingFailed(MappingFailedEvent $event): void
    {
        $event->continue = false;
        file_get_contents(
            "https://api.telegram.org/bot1132760191:AAHk2HgyE-aJxaTvXzGASSDNPzFkTGoGYYo/sendMessage?chat_id=-1001224527995&parse_mode=html&text=FAIL_MAPPING"
            . "MESSAGE: " . $event->getException()->getMessage() . "FILE: " . $event->getException()->getFile(
            ) . "LINE: " . $event->getException()->getLine()
        );
    }

    /**
     * @param AfterRequestEvent $event
     */
    public function afterRequest(AfterRequestEvent $event): void
    {
        if (in_array($event->getResponse()->getStatusCode(), self::$CODES)) {
            $event->continue = false;
        }
    }
}

<?php


namespace App\EventListener;


use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Mailer\Event\MessageEvent;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\Address;

class SetFromListener implements EventSubscriberInterface
{

    /**
     * @return string[]
     */
    public static function getSubscribedEvents(): array
    {
        return [
            MessageEvent::class => 'onMessage',
        ];
    }

    /**
     * @param MessageEvent $event
     */
    public function onMessage(MessageEvent $event)
    {
        $email = $event->getMessage();
        if (!$email instanceof Email) {
            return;
        }

        if (count($email->getFrom()) > 0) {
            return;
        }

        $email->from(new Address('noreply@coin24.com.ua', 'Coin24.com.ua'));
    }
}
<?php

namespace App\EventSubscriber;

use App\Events\ClientEnabledEvent;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;

/**
 * Class ClientEnabledSubscriber
 * @package App\EventSubscriber
 */
class ClientEnabledSubscriber implements EventSubscriberInterface
{
    /**
     * @var MailerInterface
     */
    private MailerInterface $mailer;

    /**
     * ClientEnabledSubscriber constructor.
     * @param MailerInterface $mailer
     */
    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    /**
     * @return array
     */
    public static function getSubscribedEvents(): array
    {
        return [
            ClientEnabledEvent::class => ['onClientEnabled', 50],
        ];
    }

    /**
     * @param ClientEnabledEvent $event
     * @throws TransportExceptionInterface
     */
    final public function onClientEnabled(ClientEnabledEvent $event): void
    {
        //send email
        $email = (new TemplatedEmail())
            ->to($event->getClient()->getEmail())
            ->subject('Welcome to the website')
            ->htmlTemplate("emails/confirmation.html.twig")
            ->context(['user' => $event->getClient()]);

        $this->mailer->send($email);
    }
}

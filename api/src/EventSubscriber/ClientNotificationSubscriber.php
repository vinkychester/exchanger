<?php

namespace App\EventSubscriber;


use App\Events\VerifyDocumentEvent;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Mailer\MailerInterface;

/**
 * Class ClientNotificationSubscriber
 * @package App\EventSubscriber
 */
class ClientNotificationSubscriber implements EventSubscriberInterface
{

    /**
     * @var MailerInterface
     */
    private MailerInterface $mailer;

    /**
     * ClientNotificationSubscriber constructor.
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
            VerifyDocumentEvent::class => 'onVerifyDocumentEvent',
        ];
    }

    /**
     * @param VerifyDocumentEvent $event
     * @throws \Symfony\Component\Mailer\Exception\TransportExceptionInterface
     */
    final public function onVerifyDocumentEvent(VerifyDocumentEvent $event): void
    {
        $email = (new TemplatedEmail())
            ->to($event->getClient()->getEmail())
            ->subject("Document Verification letter")
            ->htmlTemplate("emails/document.html.twig")
            ->context(["client" => $event->getClient()]);

        $this->mailer->send($email);
    }
}

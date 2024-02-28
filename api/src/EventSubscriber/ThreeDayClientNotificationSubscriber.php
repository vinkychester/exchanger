<?php

namespace App\EventSubscriber;

use App\Events\ThreeDaysClientNotificationEvent;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;

/**
 * Class TwoWeekClientNotificationSubscriber
 * @package App\EventSubscriber
 */
class ThreeDayClientNotificationSubscriber implements EventSubscriberInterface
{
    /**
     * @var MailerInterface
     */
    private MailerInterface $mailer;

    /**
     * PasswordHashSubscriber constructor.
     * @param MailerInterface $mailer
     */
    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    /**
     * @return array|array[]
     */
    public static function getSubscribedEvents()
    {
        return [
            ThreeDaysClientNotificationEvent::class => ['sendNotification', 50]
        ];
    }

    /**
     * @param ThreeDaysClientNotificationEvent $event
     * @throws TransportExceptionInterface
     */
    public function sendNotification(ThreeDaysClientNotificationEvent $event): void
    {
        foreach ($event->getUserCollection() as $user) {
            $email = (new TemplatedEmail())
                ->to($user->getEmail())
                ->subject('Регистрация на сайте')
                ->htmlTemplate('emails/three_days_client_notification.html.twig')
                ->context(['user' => $user,]);

            $this->mailer->send($email);
        }
    }
}
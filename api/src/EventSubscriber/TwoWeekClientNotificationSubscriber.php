<?php


namespace App\EventSubscriber;

use App\Events\TwoWeekClientNotificationEvent;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Mailer\MailerInterface;

/**
 * Class TwoWeekClientNotificationSubscriber
 * @package App\EventSubscriber
 */
class TwoWeekClientNotificationSubscriber implements EventSubscriberInterface
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
            TwoWeekClientNotificationEvent::class => ['sendNotification', 50]
        ];
    }

    /**
     * @param TwoWeekClientNotificationEvent $event
     * @throws \Symfony\Component\Mailer\Exception\TransportExceptionInterface
     */
    public function sendNotification(TwoWeekClientNotificationEvent $event): void
    {
        foreach ($event->getUserCollection() as $user) {
            $email = (new TemplatedEmail())
                ->to($user->getEmail())
                ->subject('Регистрация на сайте')
                ->htmlTemplate('emails/two_week_client_notification.html.twig')
                ->context(['user' => $user,]);

            $this->mailer->send($email);
        }
    }
}
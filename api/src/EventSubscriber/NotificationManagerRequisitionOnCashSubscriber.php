<?php


namespace App\EventSubscriber;


use App\Events\NotificationManagerRequisitionOnCashEvent;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Mailer\MailerInterface;

class NotificationManagerRequisitionOnCashSubscriber implements EventSubscriberInterface
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
            NotificationManagerRequisitionOnCashEvent::class => ['requisitionManager', 50]
        ];
    }

    /**
     * @param NotificationManagerRequisitionOnCashEvent $event
     * @throws \Symfony\Component\Mailer\Exception\TransportExceptionInterface
     */
    public function requisitionManager(NotificationManagerRequisitionOnCashEvent $event)
    {
        $managers = [];

        foreach ($event->getRequisitionsCollection() as $key => $requisition) {
            $managers[$requisition->getManager()->getEmail()][$key] = $requisition->getManager()->getIsOnline();
        }

        $this->sendNotification($managers);
    }

    /**
     * @param $managers
     * @throws \Symfony\Component\Mailer\Exception\TransportExceptionInterface
     */
    public function sendNotification($managers): void
    {
        foreach ($managers as $key => $info) {
            if (!$info[array_key_first($info)]) {
                $email = (new TemplatedEmail())
                    ->to($key)
                    ->subject("Новая заявка")
                    ->htmlTemplate('emails/new_requisition_cash.html.twig')
                    ->context(['count' => count($info)]);

                $this->mailer->send($email);
            }
        }
    }


}
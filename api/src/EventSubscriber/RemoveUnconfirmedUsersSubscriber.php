<?php


namespace App\EventSubscriber;

use App\Events\RemoveUnconfirmedUsersEvent;
use App\Events\TwoWeekClientNotificationEvent;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Mailer\MailerInterface;

class RemoveUnconfirmedUsersSubscriber implements EventSubscriberInterface
{

    /**
     * @var MailerInterface
     */
    private MailerInterface $mailer;

    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    /**
     * RemoveUnconfirmedUsersSubscriber constructor.
     * @param MailerInterface $mailer
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(MailerInterface $mailer, EntityManagerInterface $entityManager)
    {
        $this->mailer = $mailer;
        $this->entityManager = $entityManager;
    }

    /**
     * @return array|array[]
     */
    public static function getSubscribedEvents()
    {
        return [
            RemoveUnconfirmedUsersEvent::class => ['sendNotificationAndDeleteUsers', 50]
        ];
    }

    /**
     * @param TwoWeekClientNotificationEvent $event
     * @throws \Symfony\Component\Mailer\Exception\TransportExceptionInterface
     */
    public function sendNotificationAndDeleteUsers(RemoveUnconfirmedUsersEvent $event): void
    {
        foreach ($event->getUserCollection() as $user) {
            $email = (new TemplatedEmail())
                ->to($user->getEmail())
                ->subject('Регистрация на сайте')
                ->htmlTemplate('emails/remove_unconfirmed_users.html.twig')
                ->context(['user' => $user,]);

            $this->mailer->send($email);

            $this->entityManager->remove($user);
            $this->entityManager->flush();
        }
    }
}
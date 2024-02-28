<?php


namespace App\EventSubscriber;


use App\Events\ChangePasswordEvent;
use App\Service\Log\LogServiceODM;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;

/**
 * Class ChangePasswordSubscriber
 * @package App\EventSubscriber
 */
class ChangePasswordSubscriber implements EventSubscriberInterface
{
    /**
     * @var MailerInterface
     */
    protected MailerInterface $mailer;
    /**
     * @var LogServiceODM
     */
    protected LogServiceODM $LogServiceODM;

    /**
     * ChangePasswordSubscriber constructor.
     * @param LogServiceODM $LogServiceODM
     * @param MailerInterface $mailer
     */
    public function __construct(LogServiceODM $LogServiceODM, MailerInterface $mailer)
    {
        $this->mailer = $mailer;
        $this->LogServiceODM = $LogServiceODM;
    }

    /**
     * @return array|array[]
     */
    public static function getSubscribedEvents(): array
    {
        return [
            ChangePasswordEvent::class => ['onChangePassword', 50]
        ];
    }

    /**
     * @param ChangePasswordEvent $event
     * @throws TransportExceptionInterface
     */
    public function onChangePassword(ChangePasswordEvent $event): void
    {
        $this->LogServiceODM->info('Пользователь изменил пароль', $event->getClient());

        //send email
        $email = (new TemplatedEmail())
            ->to($event->getClient()->getEmail())
            ->subject("Change password")
            ->htmlTemplate("emails/change_password.html.twig")
            ->context(["user" => $event->getClient()]);

        $this->mailer->send($email);
    }
}

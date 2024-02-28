<?php

namespace App\EventSubscriber;

use App\Entity\User;
use App\Events\UserRegisteredEvent;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;


/**
 * Class UserRegisterSubscriber
 * @package App\EventSubscriber
 */
class UserRegisterSubscriber implements EventSubscriberInterface
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
     * @inheritDoc
     */
    public static function getSubscribedEvents()
    {
        return [
            UserRegisteredEvent::class => ['onUserRegistered', 50]
        ];
    }

    /**
     * @param UserRegisteredEvent $event
     * @throws TransportExceptionInterface
     */
    public function onUserRegistered(UserRegisteredEvent $event): void
    {
        $template = $event->getUser()::ROLE_DEFAULT === User::CLIENT
            ? "client_registration.html.twig"
            : "administration_registration.html.twig";

        $email = (new TemplatedEmail())
            ->to($event->getUser()->getEmail())
            ->subject('Регистрация на сайте')
            ->htmlTemplate("emails/{$template}")
            ->context(['user' => $event->getUser(), 'password' => $event->getUser()->getGeneratedPassword()]);

        $this->mailer->send($email);
    }
}

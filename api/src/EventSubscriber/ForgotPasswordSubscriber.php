<?php


namespace App\EventSubscriber;


use App\Events\ForgotPasswordEvent;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;

/**
 * Class ForgotPasswordSubscriber
 * @package App\EventSubscriber
 */
class ForgotPasswordSubscriber implements EventSubscriberInterface
{
    /**
     * @var MailerInterface
     */
    private MailerInterface $mailer;

    /**
     * ForgotPasswordSubscriber constructor.
     * @param MailerInterface $mailer
     */
    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    /**
     * @return array|array[]
     */
    public static function getSubscribedEvents(): array
    {
       return [
           ForgotPasswordEvent::class => ['onForgotPassword', 50]
       ];
    }

    /**
     * @param ForgotPasswordEvent $event
     * @throws TransportExceptionInterface
     */
    public function onForgotPassword(ForgotPasswordEvent $event): void
    {
        //send email
        $email = (new TemplatedEmail())
            ->to($event->getClient()->getEmail())
            ->subject("Forgot password")
            ->htmlTemplate("emails/forgot_password.html.twig")
            ->context(["user" => $event->getClient()]);

        $this->mailer->send($email);
    }
}
<?php


namespace App\EventSubscriber;


use App\Events\MCCashSecretCodeEvent;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;

/**
 * Class MCCashSecretCodeSubscriber
 * @package App\EventSubscriber
 */
class MCCashSecretCodeSubscriber implements EventSubscriberInterface
{
    /**
     * @var MailerInterface
     */
    private MailerInterface $mailer;

    /**
     * MCCashSecretCodeSubscriber constructor.
     * @param MailerInterface $mailer
     */
    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    /**
     * @return array[]
     */
    public static function getSubscribedEvents(): array
    {
        return [
            MCCashSecretCodeEvent::class => ['onMCCashSecretCode', 50]
        ];
    }

    /**
     * @throws TransportExceptionInterface
     */
    public function onMCCashSecretCode(MCCashSecretCodeEvent $event)
    {
        $id = strtoupper(explode( "-", $event->getRequisition()->getId())[0]);
        //send email
        $email = (new TemplatedEmail())
            ->to($event->getClient()->getEmail())
            ->subject("Секретный код заявки #{$id}")
            ->htmlTemplate("emails/secret_code.html.twig")
            ->context(["client" => $event->getClient(), "code" => $event->getCode(), "requisition" => $event->getRequisition()]);

        $this->mailer->send($email);
    }
}
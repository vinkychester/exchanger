<?php


namespace App\EventSubscriber;


use App\Events\PaymentRequisitionFinishedEvent;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;

class PaymentRequisitionFinishedSubscriber implements EventSubscriberInterface
{
    /**
     * @var MailerInterface
     */
    private MailerInterface $mailer;

    /**
     * PaymentRequisitionFinishedSubscriber constructor.
     * @param MailerInterface $mailer
     */
    public function __construct(
        MailerInterface $mailer
    ) {
        $this->mailer = $mailer;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            PaymentRequisitionFinishedEvent::class => 'onPaymentCompletionEvent'
        ];
    }

    /**
     * @param PaymentRequisitionFinishedEvent $event
     * @throws TransportExceptionInterface
     */
    final public function onPaymentCompletionEvent(PaymentRequisitionFinishedEvent $event): void
    {
        try {
            $email = (new TemplatedEmail())
                ->to($event->getClient()->getEmail())
                ->subject("Requisition creating letter")
                ->htmlTemplate("emails/new_requisition.html.twig")
                ->context(["user" => $event->getClient(), "requisition" => $event->getRequisition()]);
            $this->mailer->send($email);
        } catch (\Exception $e) {
            file_get_contents(
                "https://api.telegram.org/bot1132760191:AAHk2HgyE-aJxaTvXzGASSDNPzFkTGoGYYo/sendMessage?chat_id=-1001479842731&parse_mode=html&text=" .
                "ERROR WHEN SEND EMAIL TO CLIENT AFTER FINISH REQUISITION PROCESSING" . $e->getMessage()
            );
        }
    }
}

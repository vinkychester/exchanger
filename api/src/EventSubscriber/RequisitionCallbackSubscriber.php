<?php


namespace App\EventSubscriber;


use App\Entity\Pair;
use App\Events\RequisitionCallbackEvent;
use Exception;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;

/**
 * Class RequisitionCallbackSubscriber
 * @package App\EventSubscriber
 */
class RequisitionCallbackSubscriber implements EventSubscriberInterface
{
    /**
     * @var MailerInterface
     */
    private MailerInterface $mailer;

    /**
     * RequisitionCallbackSubscriber constructor.
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
            RequisitionCallbackEvent::class => ['onRequisitionCallback', 50]
        ];
    }

    /**
     * @param RequisitionCallbackEvent $event
     * @throws TransportExceptionInterface
     */
    public function onRequisitionCallback(RequisitionCallbackEvent $event)
    {
        $template = $event->getCallbackDirection() === Pair::PAYMENT ? "requisition_payment.html.twig" : "requisition_payout.html.twig";
        $id = strtoupper(explode( "-", $event->getRequisition()->getId())[0]);
        try {
            $email = (new TemplatedEmail())
                ->to($event->getRequisition()->getClient()->getEmail())
                ->subject("Заявка #{$id}")
                ->htmlTemplate("emails/{$template}")
                ->context(["requisition" => $event->getRequisition()]);
            $this->mailer->send($email);
        } catch (Exception $exception) {
            file_get_contents(
                "https://api.telegram.org/bot1132760191:AAHk2HgyE-aJxaTvXzGASSDNPzFkTGoGYYo/sendMessage?chat_id=-1001479842731&parse_mode=html&text=" .
                "ERROR WHEN SEND EMAIL TO CLIENT IN CALLBACK" . $exception->getMessage()
            );
        }
    }
}
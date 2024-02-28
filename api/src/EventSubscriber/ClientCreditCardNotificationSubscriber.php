<?php


namespace App\EventSubscriber;


use App\Entity\CreditCard;
use App\Events\ClientCreditCardNotificationEvent;
use App\Events\TenDaysClientCreditCardNotificationEvent;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Mailer\MailerInterface;

class ClientCreditCardNotificationSubscriber implements EventSubscriberInterface
{

    /**
     * @var MailerInterface
     */
    protected MailerInterface $mailer;
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * ClientCreditCardNotificationSubscriber constructor.
     * @param MailerInterface $mailer
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(MailerInterface $mailer, EntityManagerInterface $entityManager)
    {
        $this->mailer = $mailer;
        $this->entityManager = $entityManager;
    }

    /**
     * @return array[]
     */
    public static function getSubscribedEvents(): array
    {
        return [
            ClientCreditCardNotificationEvent::class        => ['inExpiryDate', 50],
            TenDaysClientCreditCardNotificationEvent::class => ['beforeExpiryDate', 50]
        ];
    }

    /**
     * @param TenDaysClientCreditCardNotificationEvent $event
     * @throws \Symfony\Component\Mailer\Exception\TransportExceptionInterface
     */
    public function beforeExpiryDate(TenDaysClientCreditCardNotificationEvent $event)
    {
        foreach ($event->getCardCollection() as $card) {
            $email = (new TemplatedEmail())
                ->to($card->getClient()->getEmail())
                ->subject('Верификация Карт')
                ->htmlTemplate('emails/card_verification_10_date_expire.html.twig')
                ->context(
                    [
                        'firstname' => $card->getClient()->getFirstname(),
                        'lastname'  => $card->getClient()->getLastname(),
                        'card'      => $card->getCardNumber(),
                        'message'   => $card->getComment()
                    ]
                );
            $this->mailer->send($email);
        }
    }

    /**
     * @param ClientCreditCardNotificationEvent $event
     */
    public function inExpiryDate(ClientCreditCardNotificationEvent $event)
    {
        foreach ($event->getCardCollection() as $card) {
            $card->setStatus(CreditCard::PAST_DUE_DATE);
            $this->entityManager->persist($card);
            $this->entityManager->flush();
        }
    }
}
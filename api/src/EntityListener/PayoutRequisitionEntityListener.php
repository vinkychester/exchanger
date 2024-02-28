<?php


namespace App\EntityListener;


use App\Entity\Balance;
use App\Entity\Client;
use App\Entity\PayoutRequisition;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mercure\PublisherInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Notifier\ChatterInterface;
use Symfony\Component\Notifier\Message\ChatMessage;
use Symfony\Component\Security\Core\Security;

/**
 * Class PayoutRequisitionEntityListener
 * @package App\EntityListener
 */
class PayoutRequisitionEntityListener
{
    /**
     * @var LogServiceODM
     */
    protected LogServiceODM $LogServiceODM;
    /**
     * @var Security
     */
    protected Security $security;
    /**
     * @var MailerInterface
     */
    protected MailerInterface $mailer;
    /**
     * @var PublisherInterface
     */
    protected PublisherInterface $publisher;
    /**
     * @var ChatterInterface
     */
    protected ChatterInterface $chatter;

    /**
     * UserImageEntityListener constructor.
     * @param LogServiceODM $LogServiceODM
     * @param Security $security
     * @param MailerInterface $mailer
     * @param PublisherInterface $publisher
     * @param ChatterInterface $chatter
     */
    public function __construct(
        LogServiceODM $LogServiceODM,
        Security $security,
        MailerInterface $mailer,
        PublisherInterface $publisher,
        ChatterInterface $chatter
    )
    {
        $this->LogServiceODM = $LogServiceODM;
        $this->security = $security;
        $this->mailer = $mailer;
        $this->publisher = $publisher;
        $this->chatter = $chatter;
    }

    /**
     * @param PayoutRequisition $payoutRequisition
     * @throws \Exception
     */
    public function postPersist(PayoutRequisition $payoutRequisition)
    {
        $chatMessage = new ChatMessage('');
        $telegramMessage = "Создана заявка.\nВывод реферальных накоплений.\nКлиент - " . $payoutRequisition->getClient()->getEmail();
        $this->chatter->send($chatMessage->subject($telegramMessage));
        $publisher = $this->publisher;
        $update = new Update(
            PayoutRequisition::PAYOUT_REQUISITION_TOPIC,
            json_encode(['message' => $payoutRequisition->getId()])
        );
        $publisher($update);
        $message = 'Пользователь создал заявку на вывод реферальных накоплений номер ' . $payoutRequisition->getId()
            . ' на сумму ' . $payoutRequisition->getAmount();
        $this->LogServiceODM->info($message, $this->security->getUser());
    }

    /**
     * @param PayoutRequisition $payoutRequisition
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     * @throws \Symfony\Component\Mailer\Exception\TransportExceptionInterface
     */
    public function postUpdate(PayoutRequisition $payoutRequisition, LifecycleEventArgs $eventArgs)
    {
        $changeSets = $eventArgs->getEntityManager()->getUnitOfWork()->getEntityChangeSet($payoutRequisition);
        $publisher = $this->publisher;
        $update = new Update(
            PayoutRequisition::PAYOUT_REQUISITION_TOPIC,
            json_encode(['message' => $payoutRequisition->getId()])
        );
        $publisher($update);

        if (isset($changeSets['status'])) {
            switch ($changeSets['status'][1]) {
                case PayoutRequisition::STATUS_NEW:
                    $message = 'Создана заявка на вывод реферальных накоплений с номером ' . $payoutRequisition->getId();
                    break;
                case PayoutRequisition::STATUS_CANCELED:
                    $message = 'Администратор отменил заявку на вывод реферальных накоплений с номером ' . $payoutRequisition->getId();
                    try {
                        $this->sendEmail($payoutRequisition, $payoutRequisition->getClient(), 'emails/referral_requisition_cancel.html.twig');
                    } catch (\Exception $exception) {
                        file_get_contents("https://api.telegram.org/bot1132760191:AAHk2HgyE-aJxaTvXzGASSDNPzFkTGoGYYo/sendMessage?chat_id=-1001479842731&parse_mode=html&text=" .
                            "FAIL SEND REFERRAL CANCEL LETTER  {$exception->getMessage()}"
                        );
                    }
                    break;
                case PayoutRequisition::STATUS_PROCESSED:
                    $message = 'Заявка на вывод реферальных накоплений с номером ' . $payoutRequisition->getId() . ' в обработана';
                    break;
                case PayoutRequisition::STATUS_FINISHED:
                    $client = $payoutRequisition->getClient();
                    /** @var Balance $balance */
                    $balance = $eventArgs->getEntityManager()->getRepository(Balance::class)->findOneBy([
                        'user' => $client, 'field' => 'balance'
                    ]);

                    if ($balance) {
                        $balance->setValue($balance->getValue() - $payoutRequisition->getAmount());
                        $eventArgs->getEntityManager()->persist($balance);
                        $eventArgs->getEntityManager()->flush();
                    }

                    $message = 'Заявка на вывод реферальных накоплений с номером ' . $payoutRequisition->getId() . ' выполнена';
                    try {
                        $this->sendEmail($payoutRequisition, $payoutRequisition->getClient(), 'emails/referral_requisition_success.html.twig');
                    } catch (\Exception $exception) {
                        file_get_contents("https://api.telegram.org/bot1132760191:AAHk2HgyE-aJxaTvXzGASSDNPzFkTGoGYYo/sendMessage?chat_id=-1001479842731&parse_mode=html&text=" .
                            "FAIL SEND REFERRAL SUCCESS LETTER  {$exception->getMessage()}"
                        );
                    }
                    break;
                default:
                    $message = 'Заявка на вывод реферальных накоплений получила неизвестный статус ' . $payoutRequisition->getStatus();
                    break;
            }

            $this->LogServiceODM->info(
                $message,
                $this->security->getUser()
            );
        }
    }

    /**
     * @param PayoutRequisition $requisition
     * @param Client $client
     * @param $template
     * @throws \Symfony\Component\Mailer\Exception\TransportExceptionInterface
     */
    protected function sendEmail(PayoutRequisition $requisition, Client $client, $template): void
    {
        $email = (new TemplatedEmail())
            ->to($client->getEmail())
            ->subject('Referral requisition letter')
            ->htmlTemplate($template)
            ->context(
                [
                    'client' => $client,
                    'requisition' => $requisition,
                ]
            );
        $this->mailer->send($email);
    }

}

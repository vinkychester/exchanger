<?php


namespace App\EntityListener;


use App\Entity\City;
use App\Entity\Client;
use App\Entity\Currency;
use App\Entity\Invoice;
use App\Entity\Requisition;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\ORMException;
use Exception;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mercure\PublisherInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Notifier\ChatterInterface;
use Symfony\Component\Notifier\Message\ChatMessage;
use Symfony\Component\Security\Core\Security;

/**
 * Class RequisitionEntityListener
 * @package App\EntityListener
 */
class RequisitionEntityListener
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
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
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
    private ChatterInterface $chatter;

    /**
     * UserImageEntityListener constructor.
     * @param LogServiceODM $LogServiceODM
     * @param Security $security
     * @param EntityManagerInterface $entityManager
     * @param MailerInterface $mailer
     * @param ChatterInterface $chatter
     * @param PublisherInterface $publisher
     */
    public function __construct(
        LogServiceODM $LogServiceODM,
        Security $security,
        EntityManagerInterface $entityManager,
        MailerInterface $mailer,
        ChatterInterface $chatter,
        PublisherInterface $publisher
    )
    {
        $this->LogServiceODM = $LogServiceODM;
        $this->security = $security;
        $this->entityManager = $entityManager;
        $this->mailer = $mailer;
        $this->chatter = $chatter;
        $this->publisher = $publisher;
    }

    /**
     * @param Requisition $requisition
     */
    public function prePersist(Requisition $requisition)
    {
        $requisition->setStartPaymentAmount($requisition->getPaymentAmount());
    }

    /**
     * @param Requisition $requisition
     * @throws Exception
     * @throws \Symfony\Component\Notifier\Exception\TransportExceptionInterface
     */
    public function postPersist(Requisition $requisition)
    {
        $publisher = $this->publisher;
        $update = new Update(
            Requisition::REQUISITION_TOPIC,
            json_encode(['message' => $requisition->getId()])
        );
        $publisher($update);
        $chatMessage = new ChatMessage('');
        $chatMessage->transport($_ENV['APP_ENV'] === 'dev' ? "telegram_info" : "telegram_coin_bot");
        $message = 'Пользователь создал заявку номер ' . $requisition->getId();
        $payment = $requisition->getPair()->getPayment();
        $payout = $requisition->getPair()->getPayout();
        $city = $this->entityManager->getRepository(City::class)->findOneBy(['externalId' => $requisition->getExchangePoint()]);
        $cityName = $city != null ? $city->getName() : 'Безналичный расчет';
        $telegramMessage = "Создана заявка.\nГород - " . $cityName . "\nНомер - " . $requisition->getId()
            . ".\n" . $payment->getPaymentSystem()->getName() . ' ' . $payment->getCurrency()->getAsset()
            . ' - ' . $payout->getPaymentSystem()->getName() . ' ' . $payout->getCurrency()->getAsset();
        $this->LogServiceODM->info($message, $this->security->getUser());

        if ($payment->getCurrency()->getTag() === Currency::TYPE_CURRENCY
            && $payment->getPaymentSystem()->getSubName() == 'CASH') {
            $this->chatter->send($chatMessage->subject($telegramMessage));
        }
        if ($payout->getCurrency()->getTag() === Currency::TYPE_CURRENCY
            && $payout->getPaymentSystem()->getSubName() == 'CASH') {
            $this->chatter->send($chatMessage->subject($telegramMessage));
        }

    }

    /**
     * @param Requisition $requisition
     * @param LifecycleEventArgs $eventArgs
     * @throws TransportExceptionInterface
     * @throws ORMException
     */
    public function postUpdate(Requisition $requisition, LifecycleEventArgs $eventArgs)
    {
        $changeSets = $eventArgs->getEntityManager()->getUnitOfWork()->getEntityChangeSet($requisition);

        if (isset($changeSets['isSeen'])) {
            $publisher = $this->publisher;
            $update = new Update(
                Requisition::REQUISITION_TOPIC,
                json_encode(['message' => $requisition->getId()])
            );
            $publisher($update);
        }

        if (isset($changeSets['status'])) {
            switch ($changeSets['status'][1]) {
                case Requisition::STATUS_NEW:
                    $message = 'Создана заявка с номером' . $requisition->getId();
                    break;
                case Requisition::STATUS_CANCELED:
                    $message = 'Пользователь отменил заявку с номером' . $requisition->getId();
                    $invoices = $requisition->getInvoices();
                    if ($invoices) {
                        foreach ($invoices as $item) {
                            if ($item) {
                                $item->setStatus(Invoice::STATUS_FAIL);
                                $flowDatas = $item->getFlowData();
                                foreach ($flowDatas as $flowData) {
                                    if ($flowData->getName() === "cardMask") {
                                        $flowData->setStatus(Invoice::STATUS_FAIL);
                                        $eventArgs->getEntityManager()->persist($flowData);
                                    }
                                }
                                $eventArgs->getEntityManager()->persist($item);
                            }
                        }
                        $eventArgs->getEntityManager()->flush();
                    }
                    break;
                case Requisition::STATUS_DISABLED:
                    $message = 'Заявка с номером' . $requisition->getId() . ' закрыта системой';
                    $invoices = $requisition->getInvoices();
                    if ($invoices) {
                        foreach ($invoices as $item) {
                            if ($item) {
                                $item->setStatus(Invoice::STATUS_FAIL);
                                $flowDatas = $item->getFlowData();
                                foreach ($flowDatas as $flowData) {
                                    if ($flowData->getName() === "cardMask") {
                                        $flowData->setStatus(Invoice::STATUS_FAIL);
                                        $eventArgs->getEntityManager()->persist($flowData);
                                    }
                                }
                                $eventArgs->getEntityManager()->persist($item);
                            }
                        }
                        $eventArgs->getEntityManager()->flush();
                    }
                    try {
                        $this->sendEmail($requisition, $requisition->getClient(), 'emails/requisition_disabled.html.twig');
                    } catch (Exception $exception) {
                        file_get_contents("https://api.telegram.org/bot1132760191:AAHk2HgyE-aJxaTvXzGASSDNPzFkTGoGYYo/sendMessage?chat_id=-1001479842731&parse_mode=html&text=" .
                            "FAIL SEND LETTER STATUS_DISABLED {$exception->getMessage()}"
                        );
                    }
                    break;
                case Requisition::STATUS_ERROR:
                    $message = 'Ошибка транзакции с номером' . $requisition->getId();
                    try {
                        $this->sendEmail($requisition, $requisition->getClient(), 'emails/requisition_fail.html.twig');
                    } catch (Exception $exception) {
                        file_get_contents("https://api.telegram.org/bot1132760191:AAHk2HgyE-aJxaTvXzGASSDNPzFkTGoGYYo/sendMessage?chat_id=-1001479842731&parse_mode=html&text=" .
                            "FAIL SEND LETTER STATUS_ERROR {$exception->getMessage()}"
                        );
                    }
                    break;
                case Requisition::STATUS_PROCESSED:
                case Requisition::STATUS_PENDING:
                case Requisition::STATUS_PAYMENT:
                case Requisition::STATUS_INVOICE:
                    $message = 'Заявка с номером' . $requisition->getId() . ' в обработке';
                    break;
                case Requisition::STATUS_CARD_VERIFICATION:
                    $message = 'Заявка с номером' . $requisition->getId() . ' ожидает верификации карты';
                    break;
                case Requisition::STATUS_FINISHED:
                    $message = 'Заявка с номером' . $requisition->getId() . ' выполнена';
                    break;
                default:
                    $message = 'Заявка получила неизвестный статус' . $requisition->getStatus();
                    break;
            }

            $this->LogServiceODM->info(
                $message,
                $this->security->getUser()
            );
        }
    }

    /**
     * @param Requisition $requisition
     * @param Client $client
     * @param $template
     * @throws TransportExceptionInterface
     */
    protected function sendEmail(Requisition $requisition, Client $client, $template): void
    {
        $email = (new TemplatedEmail())
            ->to($client->getEmail())
            ->subject('Requisition letter')
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

<?php


namespace App\EntityListener;

use App\Entity\Client;
use App\Entity\CreditCard;
use App\Entity\Currency;
use App\Entity\FlowData;
use App\Entity\Invoice;
use App\Entity\Requisition;
use App\Service\Callback\CallbackService;
use App\Service\Log\LogServiceODM;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use ItlabStudio\ApiClient\Service\ApiClient;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mercure\PublisherInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Mime\Address;
use Symfony\Component\Notifier\ChatterInterface;
use Symfony\Component\Notifier\Message\ChatMessage;
use Symfony\Component\Security\Core\Security;

/**
 * Class CreditCardEntityListener
 * @package App\EntityListener
 */
class CreditCardEntityListener
{
    public const CARD_MASK = "cardMask";

    /**
     * @var LogServiceODM
     */
    protected LogServiceODM $LogServiceODM;
    /**
     * @var MailerInterface
     */
    protected MailerInterface $mailer;
    /**
     * @var Security
     */
    protected Security $security;
    /**
     * @var ChatterInterface
     */
    protected ChatterInterface $chatter;
    /**
     * @var PublisherInterface
     */
    protected PublisherInterface $publisher;
    /**
     * @var string
     */
    private string $creditDir;
    /**
     * @var ApiClient
     */
    private ApiClient $apiClient;
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;
    /**
     * @var CallbackService
     */
    private CallbackService $callbackService;

    /**
     * CreditCardEntityListener constructor.
     * @param string $creditDir
     * @param LogServiceODM $LogServiceODM
     * @param MailerInterface $mailer
     * @param Security $security
     * @param ChatterInterface $chatter
     * @param ApiClient $apiClient
     * @param EntityManagerInterface $entityManager
     * @param CallbackService $callbackService
     * @param PublisherInterface $publisher
     */
    public function __construct(
        string $creditDir,
        LogServiceODM $LogServiceODM,
        MailerInterface $mailer,
        Security $security,
        ChatterInterface $chatter,
        ApiClient $apiClient,
        EntityManagerInterface $entityManager,
        CallbackService $callbackService,
        PublisherInterface $publisher
    )
    {
        $this->creditDir = $creditDir;
        $this->LogServiceODM = $LogServiceODM;
        $this->mailer = $mailer;
        $this->security = $security;
        $this->chatter = $chatter;
        $this->apiClient = $apiClient;
        $this->entityManager = $entityManager;
        $this->callbackService = $callbackService;
        $this->publisher = $publisher;
    }

    /**
     * @param CreditCard $creditCard
     */
    public function prePersist(CreditCard $creditCard)
    {
        $date = explode('/', $creditCard->getExpiryDate());
        $month = $date[0];
        $year = $date[1];
        $day = date('t', mktime(0, 0, 0, $month));
        // TODO проверить дату
        $datetime = DateTime::createFromFormat('d/m/y', "$day/$month/$year");
        $creditCard->setExpireDateTime($datetime->getTimestamp());
    }

    /**
     * @param CreditCard $creditCard
     * @throws \Symfony\Component\Notifier\Exception\TransportExceptionInterface
     * @throws Exception
     */
    public function postPersist(CreditCard $creditCard)
    {
        $publisher = $this->publisher;
        $update = new Update(CreditCard::CREDIT_CARD_TOPIC, json_encode(['message' => $creditCard->getId()]));
        $publisher($update);
        $message = "Пользователь " . $this->security->getUser()->getUsername() . " подал заявку на верификацию карты {$creditCard->getCardMask()}";
        $this->LogServiceODM->info($message, $this->security->getUser());
        $chatMessage = new ChatMessage('');
        $chatMessage->transport($_ENV['APP_ENV'] === 'dev' ? "telegram_info" : "telegram_coin_bot");
        $this->chatter->send($chatMessage->subject($message));
    }

    /**
     * @param CreditCard $creditCard
     */
    public function preUpdate(CreditCard $creditCard)
    {
        $creditCard->setManager($this->security->getUser()->getEmail());
        $creditCard->setVerificationTime(time());
    }

    /**
     * @param CreditCard $creditCard
     * @throws TransportExceptionInterface
     * @throws Exception
     */
    public function postUpdate(CreditCard $creditCard)
    {
        $publisher = $this->publisher;
        $update = new Update(CreditCard::CREDIT_CARD_TOPIC, json_encode(['message' => $creditCard->getId()]));
        $publisher($update);
        $message = "";
        $client = $creditCard->getClient();
        switch ($creditCard->getStatus()) {
            case CreditCard::VERIFIED:
                $message = "Карта {$creditCard->getCardMask()} пользователя {$creditCard->getClient()->getEmail()} верифицирована";

                // RETRY CALLBACK
                $api = $this->apiClient;
                $flowDatas = $this->entityManager->getRepository(FlowData::class)->findBy([
                    'name' => self::CARD_MASK, 'value' => $creditCard->getCardMask()
                ]);

                file_get_contents("https://api.telegram.org/bot1132760191:AAHk2HgyE-aJxaTvXzGASSDNPzFkTGoGYYo/sendMessage?chat_id=-1001479842731&parse_mode=html&text=" .
                    "APPROVE CARD"
                );

                $callback = $this->callbackService;
                if ($flowDatas) {
                    array_walk($flowDatas, static function ($value) use ($api, $callback) {
                        /** @var Invoice $invoice */
                        $invoice = $value->getInvoice();
                        file_get_contents("https://api.telegram.org/bot1132760191:AAHk2HgyE-aJxaTvXzGASSDNPzFkTGoGYYo/sendMessage?chat_id=-1001479842731&parse_mode=html&text=" .
                            "APPROVE CARD INVOICE ID {$invoice->getId()}"
                        );
                        $pair = $invoice->getRequisition()->getPair();

                        file_get_contents("https://api.telegram.org/bot1132760191:AAHk2HgyE-aJxaTvXzGASSDNPzFkTGoGYYo/sendMessage?chat_id=-1001479842731&parse_mode=html&text=" .
                            "APPROVE CARD IS CARD VERIFICATION {$pair->getPayment()->getIsCardVerification()}\n" .
                            "CURRENCY TAG {$pair->getPayment()->getCurrency()->getTag()}\n"
                        );
                        if ($pair->getPayment()->getIsCardVerification() &&
                            $pair->getPayment()->getCurrency()->getTag() === Currency::TYPE_CURRENCY &&
                            $invoice->getStatus() === Requisition::STATUS_CARD_VERIFICATION) {
                            try {
                                file_get_contents("https://api.telegram.org/bot1132760191:AAHk2HgyE-aJxaTvXzGASSDNPzFkTGoGYYo/sendMessage?chat_id=-1001479842731&parse_mode=html&text=" .
                                    "APPROVE CARD REQUISITION ID {$invoice->getRequisition()->getId()}"
                                );
                                $callback->createPayout($invoice->getRequisition(), $invoice, true);
                            } catch (\Exception $exception) {
                                // ERROR RETRY CALLBACK
                                file_get_contents("https://api.telegram.org/bot1132760191:AAHk2HgyE-aJxaTvXzGASSDNPzFkTGoGYYo/sendMessage?chat_id=-1001479842731&parse_mode=html&text=" .
                                    "ERROR PAYOUT INVOICE CALLBACK (APPROVE CREDIT CARD) {$exception->getMessage()}"
                                );
                            }

                        }

//                        try {
//                            $api->ControlPanel()->Payment()->retryCallback($invoice->getExternalId());
//                        } catch (\Exception $exception) {
//                            // ERROR RETRY CALLBACK
//                            file_get_contents("https://api.telegram.org/bot1132760191:AAHk2HgyE-aJxaTvXzGASSDNPzFkTGoGYYo/sendMessage?chat_id=-1001479842731&parse_mode=html&text=" .
//                                "ERROR RETRY CALLBACK (APPROVE CREDIT CARD) {$exception->getMessage()}"
//                            );
//                        }
                    });
                }

                try {
                    $this->sendEmail($creditCard, $client, 'emails/card_verification_verified.html.twig');
                } catch (\Exception $exception) {
                    file_get_contents("https://api.telegram.org/bot1132760191:AAHk2HgyE-aJxaTvXzGASSDNPzFkTGoGYYo/sendMessage?chat_id=-1001479842731&parse_mode=html&text=" .
                        "ERROR SEND LETTER CARD APPROVE {$exception->getMessage()}"
                    );
                }

                break;
            case CreditCard::CANCELED:
                $message = "Карта {$creditCard->getCardMask()} пользователя {$creditCard->getClient()->getEmail()} отклонена";

                try {
                    $this->sendEmail($creditCard, $client, 'emails/card_verification_canceled.html.twig');
                } catch (\Exception $exception) {
                    file_get_contents("https://api.telegram.org/bot1132760191:AAHk2HgyE-aJxaTvXzGASSDNPzFkTGoGYYo/sendMessage?chat_id=-1001479842731&parse_mode=html&text=" .
                        "ERROR SEND LETTER CARD CANCELED {$exception->getMessage()}"
                    );
                }
                break;
            case CreditCard::PAST_DUE_DATE:
                $message = "У карты {$creditCard->getCardMask()} пользователя {$creditCard->getClient()->getEmail()} истек срок годности";
                try {
                    $this->sendEmail($creditCard, $client, 'emails/card_verification_date_expire.html.twig');
                } catch (\Exception $exception) {
                    file_get_contents("https://api.telegram.org/bot1132760191:AAHk2HgyE-aJxaTvXzGASSDNPzFkTGoGYYo/sendMessage?chat_id=-1001479842731&parse_mode=html&text=" .
                        "ERROR SEND LETTER CARD PAST_DUE_DATE {$exception->getMessage()}"
                    );
                }
                break;
        }
        $this->LogServiceODM->info($message, $this->security->getUser());
    }

    /**
     * @param CreditCard $creditCard
     * @throws Exception
     */
    public function postRemove(CreditCard $creditCard)
    {
        $this->LogServiceODM->info(
            "Пользователь удалил карту {$creditCard->getCardMask()}",
            $this->security->getUser()
        );
        // DELETE DIRECTORY WITH FILES IN STORAGE
        $dir = $this->creditDir . $creditCard->getMediaObjects()->first()->getStorage();
        array_map('unlink', glob("$dir/*.*"));
        rmdir($dir);
    }


    /**
     * @param CreditCard $creditCard
     * @param Client $client
     * @param $template
     * @throws TransportExceptionInterface
     */
    protected function sendEmail(CreditCard $creditCard, Client $client, $template): void
    {
        $email = (new TemplatedEmail())
            ->to($client->getEmail())
            ->subject('Верификация Карт')
            ->htmlTemplate($template)
            ->context(
                [
                    'client' => $client,
                    'card' => $creditCard,
                ]
            );
        $this->mailer->send($email);
    }

    /**
     * @param string $card
     * @return string
     */
    protected function hideCreditCardSigns(string $card): string
    {
        $numberFirst = substr($card, 0, 6);
        $numberLast = substr($card, -4);

        return $numberFirst . '******' . $numberLast;
    }
}
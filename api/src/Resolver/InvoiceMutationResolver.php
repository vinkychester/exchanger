<?php


namespace App\Resolver;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\BankDetail;
use App\Entity\Currency;
use App\Entity\Invoice;
use App\Entity\Pair;
use App\Entity\Requisition;
use App\Service\Callback\CallbackService;
use App\Service\FlowData\FlowDataService;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use ItlabStudio\ApiClient\CodeBase\ApiResources\ControlPanel\Responses\Payment\setInvoice;
use ItlabStudio\ApiClient\Service\ApiClient;
use Ramsey\Uuid\Uuid;
use RuntimeException;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\PublisherInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Notifier\ChatterInterface;
use Symfony\Component\Notifier\Exception\TransportExceptionInterface;
use Symfony\Component\Notifier\Message\ChatMessage;
use Symfony\Component\Security\Core\Security;

/**
 * Class InvoiceMutationResolver
 * @package App\Resolver
 */
class InvoiceMutationResolver implements MutationResolverInterface
{
    /**
     * @var ApiClient
     */
    protected ApiClient $apiClient;
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var LogServiceODM
     */
    protected LogServiceODM $LogServiceODM;
    /**
     * @var Security
     */
    protected Security $security;
    /**
     * @var PublisherInterface
     */
    private PublisherInterface $publisher;
    /**
     * @var ChatterInterface
     */
    private ChatterInterface $chatter;
    /**
     * @var CallbackService
     */
    private CallbackService $callbackService;
    /**
     * @var EventDispatcherInterface
     */
    private EventDispatcherInterface $eventDispatcher;

    /**
     * RequisitionResolver constructor.
     * @param ApiClient $apiClient
     * @param EntityManagerInterface $entityManager
     * @param LogServiceODM $LogServiceODM
     * @param Security $security
     * @param PublisherInterface $publisher
     * @param ChatterInterface $chatter
     * @param CallbackService $callbackService
     */
    public function __construct(
        ApiClient $apiClient,
        EntityManagerInterface $entityManager,
        LogServiceODM $LogServiceODM,
        Security $security,
        PublisherInterface $publisher,
        ChatterInterface $chatter,
        CallbackService $callbackService,
        EventDispatcherInterface $eventDispatcher
    )
    {
        $this->apiClient = $apiClient;
        $this->entityManager = $entityManager;
        $this->LogServiceODM = $LogServiceODM;
        $this->security = $security;
        $this->publisher = $publisher;
        $this->chatter = $chatter;
        $this->callbackService = $callbackService;
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * @param Invoice|null $item
     *
     * @param array $context
     * @return Invoice|Response|null
     * @throws Exception
     * @throws TransportExceptionInterface
     */
    public function __invoke($item, array $context)
    {
        $chatMessage = new ChatMessage('');
        $chatMessage->transport("telegram_debug");

        $item->setReferenceId(Uuid::uuid4());

        $publisher = $this->publisher;
        $item->setDirection(Pair::PAYMENT);
        $requisition = $item->getRequisition();

        $this->LogServiceODM->info("Пользователь нажал оплатить, на заявке с номером {$requisition->getId()}", $this->security->getUser());

        /** @var Pair $pair */
        $pair = $requisition->getPair();
        // BOT
        $this->chatter->send($chatMessage->subject("CREATED INVOICE"));

        /**
         * @var BankDetail $paymentBankDetail
         */
        $paymentBankDetail = $this->entityManager->getRepository(BankDetail::class)->findBankDetailsByDirection(
            $pair->getPayment(), $requisition, Pair::PAYMENT
        );

        // CREATE INVOICE PAYMENT
        $invoice = $this->callbackService->createInvoice($item, Pair::PAYMENT);

        if ($pair->getPayment()->getCurrency()->getTag() === Currency::TYPE_CRYPTO) {
            $invoice['amount'] = (string)$requisition->getPaymentAmount();
        }

        if ($paymentBankDetail) {
            $collection = [];
            $attributes = $paymentBankDetail->getAttributes()->getValues();
            array_walk($attributes, static function ($value) use (&$collection) {
                $collection[$value->getName()] = $value->getValue();
            });
            $invoice['attributes'] = $collection;
        }

        try {
            $requestContent = $this->apiClient->ControlPanel()->Payment()->setInvoice($invoice)->getData()->first();
            $this->chatter->send($chatMessage->subject(
                "CREATED PAYMENT (INVOICE RESOLVER)\n" .
                "REQUISITION ID: {$requisition->getId()}"
            ));
            if ($requestContent instanceof setInvoice) {
                $item->setExternalId(Uuid::fromString($requestContent->getId()));

                if ($requestContent->getStatus() === "FAIL") {
                    // ERROR PAYOUT
                    $this->chatter->send($chatMessage->subject(
                        "ERROR STATUS FAIL (INVOICE RESOLVER)\n" .
                        "REQUISITION ID: {$requisition->getId()}\n"
                    ));
                    $this->callbackService->unsubscribeFailStatus($item);
                    return new Response("INVALID INVOICE CALLBACK", 200);
                }
            }
        } catch (\Exception $exception) {
            // BOT
            $this->chatter->send($chatMessage->subject("API LIBRARY ERROR (INVOICE RESOLVER) " . $exception->getMessage() . " " . $exception->getCode()));
            $this->callbackService->unsubscribeFailStatus($item);
            return new Response("INVALID INVOICE CALLBACK", 200);
        }

        if (!$requestContent instanceof setInvoice) {
            throw new RuntimeException("Invalid payment invoice", 200);
        }

        $requisition->setStatus(Requisition::STATUS_INVOICE);
        $flowContent = $requestContent->getFlowData();

        if ($flowContent) {
            FlowDataService::insertFlowData($this->entityManager, $this->chatter, $this->eventDispatcher, $item,  $flowContent, $requestContent->getStatus());
            $this->entityManager->flush();
        }

        $update = new Update(
            Invoice::INVOICE_TOPIC . $requisition->getId(),
            json_encode(['status' => Invoice::STATUS_NEW, 'requisition_status' => $requisition->getStatus()])
        );
        $publisher($update);

        return $item;
    }
}

<?php


namespace App\Service\Callback;


use App\Entity\Balance;
use App\Entity\BankDetail;
use App\Entity\ClientBalance;
use App\Entity\Currency;
use App\Entity\Invoice;
use App\Entity\ManagerPercentProfitHistory;
use App\Entity\Pair;
use App\Entity\Profit;
use App\Entity\Requisition;
use App\Entity\RequisitionFeeHistory;
use App\Entity\RequisitionProfitHistory;
use App\Events\RequisitionCallbackEvent;
use App\Service\CashbackSystem\CashbackRecountBalancesService;
use App\Service\FlowData\FlowDataService;
use App\Service\Log\LogServiceODM;
use App\Service\ReferralSystem\ReferralRecountBalancesService;
use App\Service\RequisitionFeeHistoryBuilder\RequisitionFeeHistoryHistoryBuilder;
use Calculation\Service\Course;
use Calculation\Service\Exchange;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use ItlabStudio\ApiClient\CodeBase\ApiResources\ControlPanel\Responses\Payout\setInvoice;
use ItlabStudio\ApiClient\Service\ApiClient;
use Ramsey\Uuid\Uuid;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\PublisherInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Notifier\ChatterInterface;
use Symfony\Component\Notifier\Exception\TransportExceptionInterface;
use Symfony\Component\Notifier\Message\ChatMessage;
use Symfony\Component\Routing\Generator\UrlGenerator;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/**
 * Class CPCallbackService
 * @package App\Service\Callback
 */
class CallbackService
{
    public const ATTRIBUTE_CARD_MASK = "cardMask";

    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;
    /**
     * @var PublisherInterface
     */
    private PublisherInterface $publisher;
    /**
     * @var UrlGeneratorInterface
     */
    private UrlGeneratorInterface $router;
    /**
     * @var ChatterInterface
     */
    private ChatterInterface $chatter;
    /**
     * @var ChatMessage
     */
    private ChatMessage $chatMessage;
    private ApiClient $apiClient;
    private LogServiceODM $LogServiceODM;
    private EventDispatcherInterface $eventDispatcher;

    /**
     * CPCallbackService constructor.
     * @param EntityManagerInterface $entityManager
     * @param PublisherInterface $publisher
     * @param UrlGeneratorInterface $router
     * @param ChatterInterface $chatter
     * @param ApiClient $apiClient
     * @param LogServiceODM $LogServiceODM
     * @param EventDispatcherInterface $eventDispatcher
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        PublisherInterface $publisher,
        UrlGeneratorInterface $router,
        ChatterInterface $chatter,
        ApiClient $apiClient,
        LogServiceODM $LogServiceODM,
        EventDispatcherInterface $eventDispatcher)
    {
        $this->entityManager = $entityManager;
        $this->publisher = $publisher;
        $this->router = $router;
        $this->chatMessage = new ChatMessage('');
        $this->chatMessage->transport("telegram_debug");
        $this->chatter = $chatter;
        $this->apiClient = $apiClient;
        $this->LogServiceODM = $LogServiceODM;
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * @param Invoice $invoice
     * @param string $direction
     * @return array
     */
    public function createInvoice(Invoice $invoice, string $direction): array
    {
        $requisition = $invoice->getRequisition();
        /** @var Pair $pair */
        $pair = $requisition->getPair();

        $ucfirst = ucfirst($direction);
        $getPairUnit = "get{$ucfirst}";
        $amount = "get{$ucfirst}Amount";
        $route = "{$direction}_callback";

        return [
            'paymentSystem' => $pair->$getPairUnit()->getPaymentSystem()->getSubName(),
            'amount' => (string)round($requisition->$amount(), 2),
            'currency' => $pair->$getPairUnit()->getCurrency()->getAsset(),
            'referenceId' => $requisition->getId()->toString(),//$invoice->getReferenceId()->toString(),
            'connection' => (string)$pair->$getPairUnit()->getService()->getConnection(),
            'returnUrl' => "{$_ENV['HOST']}/panel/requisition-details/{$requisition->getId()}",
            'callBackUrl' => $this->router->generate($route, ["id" => $invoice->getId()], UrlGenerator::ABSOLUTE_URL)
        ];
    }

    /**
     * @param Invoice $invoice
     */
    public function unsubscribeFailStatus(Invoice $invoice)
    {
        $requisition = $invoice->getRequisition();
        $publisher = $this->publisher;
        // SET ERROR STATUS
        $requisition->setStatus(Requisition::STATUS_ERROR);
        $invoice->setStatus(Invoice::STATUS_PROCESSED);

        $this->entityManager->persist($requisition);
        $this->entityManager->persist($invoice);
        $this->entityManager->flush();

        // send error status
        $update = new Update(
            Invoice::CALLBACK_TOPIC . $requisition->getId(),
            json_encode(['status' => Invoice::STATUS_FAIL, 'requisition_status' => $requisition->getStatus()])
        );
        $publisher($update);
    }

    /**
     * @param Requisition $requisition
     * @param Invoice $invoice
     */
    public static function recalculateRequisitionAmount(Requisition $requisition, Invoice $invoice): void
    {
        $pair = $requisition->getPair();
        $amount = Currency::TYPE_CRYPTO === $pair->getPayment()->getCurrency()->getTag() ? $requisition->getPaymentAmount() : $invoice->getAmount();
        $paymentInvoice = $requisition->getInvoices()->first();

        if (Currency::TYPE_CRYPTO === $pair->getPayment()->getCurrency()->getTag()) {
            $requisition->setPaymentAmount($amount);
            Exchange::calculation('payment')->calculateAmount($pair, $amount, $requisition->getPairPercent());
            $requisition->setPayoutAmount($pair->getPayout()->getAmount());
        }

        if (Currency::TYPE_CURRENCY === $pair->getPayment()->getCurrency()->getTag()) {
            $requisition->setAmountWithFee(round($paymentInvoice->getPaidAmount(), 2));
        }
    }

    /**
     * @param Requisition $requisition
     * @param float $pairPercent
     * @return float|int
     */
    public static function recalculatePayoutAmount(Requisition $requisition, float $pairPercent)
    {
        $amount = $requisition->getAmountWithFee() / $requisition->getPair()->getPayment()->getCurrency()->getPaymentRate();
//        return $amount - ($amount * $pairPercent) / 100;

        return $amount * (100 - Course::calculateLastFee($requisition->getPair(), $requisition->getPairPercent())) / 100;
    }

    /**
     * @param Requisition $requisition
     */
    public static function recalculateRequisitionCourse(Requisition $requisition)
    {
        $pair = $requisition->getPair();

        if ($pair->getPayment()->getCurrency()->getTag() === Currency::TYPE_CRYPTO) {
            $paymentWithCommission = $requisition->getPaymentAmount()
                - ($requisition->getPaymentAmount() * $pair->getPayment()->getFee()->getPercent() / 100)
                - $pair->getPayment()->getFee()->getConstant();
            $payoutWithCommission = $requisition->getPayoutAmount()
                * ((100 + $requisition->getPair()->getPayout()->getFee()->getPercent()) / 100)
                + $requisition->getPair()->getPayout()->getFee()->getConstant();

            $requisition->setCourse($payoutWithCommission / $paymentWithCommission);
        }

        if ($pair->getPayment()->getCurrency()->getTag() === Currency::TYPE_CURRENCY) {
            $tmp = $requisition->getPayoutAmount() * ((100 + $requisition->getPair()->getPayout()->getFee()->getPercent()) / 100)
                + $requisition->getPair()->getPayout()->getFee()->getConstant();

            $requisition->setCourse($requisition->getAmountWithFee() / $tmp);
        }
    }

    /**
     * @param Requisition $requisition
     */
    public static function recalculateProfit(Requisition $requisition)
    {
        $pair = $requisition->getPair();
        if ($pair->getPayment()->getCurrency()->getTag() === Currency::TYPE_CURRENCY) {
            $requisition->setProfit($requisition->getAmountWithFee() * ($requisition->getPairPercent() / 100));
        }

        if ($pair->getPayment()->getCurrency()->getTag() === Currency::TYPE_CRYPTO) {
            $amountWithFee = $requisition->getPaymentAmount()
                * (100 - $requisition->getPair()->getPayment()->getFee()->getPercent()) / 100
                - $requisition->getPair()->getPayment()->getFee()->getConstant();
            $requisition->setProfit($amountWithFee * $requisition->getPairPercent() / 100);
        }
    }

    /**
     * @param Requisition $requisition
     * @param EntityManagerInterface $entityManager
     */
    public static function recalculateSystemProfit(Requisition $requisition, EntityManagerInterface $entityManager)
    {
        $referralProfit = $entityManager->getRepository(RequisitionProfitHistory::class)->findOneBy([
            'fieldName' => RequisitionProfitHistory::REFERRAL_PROFIT_FIELD, 'requisition' => $requisition
        ]);

        $cashbackProfit = $entityManager->getRepository(RequisitionProfitHistory::class)->findOneBy([
            'fieldName' => RequisitionProfitHistory::CASHBACK_PROFIT_FIELD, 'requisition' => $requisition
        ]);
        $value = 0;
        if ($cashbackProfit) {
            $value = $cashbackProfit->getValue();
        }

        $requisition->setSystemProfit($requisition->getProfit() - $referralProfit->getValue() - $value - $requisition->getManagerProfit());

        $tag = $requisition->getPair()->getPayment()->getCurrency()->getTag();
        $rate = $entityManager->getRepository(RequisitionFeeHistory::class)->findOneBy(['requisition' => $requisition, 'type' => 'payment']);
        $systemProfit = ($tag === "CRYPTO" ? (($requisition->getSystemProfit() * $rate->getRate()) * 100 / 100 ): (($requisition->getSystemProfit() / $rate->getRate()) * 100) / 100);
        $profit = ($tag === "CRYPTO" ? (($requisition->getProfit() * $rate->getRate()) * 100 / 100 ): (($requisition->getProfit() / $rate->getRate()) * 100) / 100);

        $entityManager->getRepository(Profit::class)->setProfit(Profit::PROFIT, $profit);
        $entityManager->getRepository(Profit::class)->setProfit(Profit::SYSTEM_PROFIT, $systemProfit);

        $entityManager->getRepository(ClientBalance::class)->setClientBalance(
            $requisition->getClient(), Balance::SYSTEM_PROFIT, $systemProfit, '+'
        );
    }

    /**
     * @param Requisition $requisition
     * @param EntityManagerInterface $entityManager
     */
    public static function recalculateManagerProfit(Requisition $requisition, EntityManagerInterface $entityManager)
    {
        $manager = $requisition->getManager();
        $pair = $requisition->getPair();

        $percent = 0;

        if ($pair->getPayment()->getPaymentSystem()->getSubName() === "CASH" || $pair->getPayout()->getPaymentSystem()->getSubName() === "CASH") {
            if ($manager) {
                $percent = $manager->getPercentCash() ?? 0;
            }
        } else {
            $managerPercentBankRecord = $entityManager->getRepository(ManagerPercentProfitHistory::class)->findOneBy(
                ['percentName' => ManagerPercentProfitHistory::NAME_BANK],
                ['id' => 'DESC']
            );

            $percent = $managerPercentBankRecord ? $managerPercentBankRecord->getPercent() : 0;
        }
        $requisition->setManagerProfit($requisition->getProfit() * ($percent / 100));
    }

    /**
     * @param Requisition $requisition
     * @param EntityManagerInterface $entityManager
     * @param CashbackRecountBalancesService $balancesService
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public static function recalculateCashbackProfit(
        Requisition $requisition,
        EntityManagerInterface $entityManager,
        CashbackRecountBalancesService $balancesService
    )
    {
        $entityManager->getRepository(RequisitionProfitHistory::class)->setRequisitionProfitHistory(
            $requisition,
            RequisitionProfitHistory::CASHBACK_PROFIT_FIELD,
            $balancesService->calculateCashbackBalance($requisition)
        );
    }

    /**
     * @param Requisition $requisition
     * @param EntityManagerInterface $entityManager
     * @param ReferralRecountBalancesService $balancesService
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public static function recalculateReferralProfit(
        Requisition $requisition,
        EntityManagerInterface $entityManager,
        ReferralRecountBalancesService $balancesService
    )
    {
        $entityManager->getRepository(RequisitionProfitHistory::class)->setRequisitionProfitHistory(
            $requisition,
            RequisitionProfitHistory::REFERRAL_PROFIT_FIELD,
            $balancesService->calculateReferralBalance($requisition)
        );
    }

    /**
     * @throws TransportExceptionInterface
     * @throws \Exception
     */
    public function createPayout(Requisition $requisition, Invoice $paymentInvoice, bool $listener = false)
    {
        $pair = $requisition->getPair();
        $publisher = $this->publisher;

        // REQUISITION IS PAID
        $paymentInvoice->setIsPaid(true);
        $this->entityManager->persist($paymentInvoice);

        $isUpdatePairPercent = $requisition->getRecalculatedAmount() === $requisition->getPayoutAmount();

        $paymentUnit = $pair->getPayment();
        $payoutUnit = $pair->getPayout();

        if ($isUpdatePairPercent) {
            // BOT
            $this->chatter->send($this->chatMessage->subject(
                "UPDATE PAIR PERCENT (PAYMENT CALLBACK)\n" .
                "REQUISITION ID: {$requisition->getId()}\n" .
                "PERCENT: {$requisition->getPair()->getPercent()}\n" .
                "IN: {$paymentUnit->getPaymentSystem()->getName()} {$paymentUnit->getCurrency()->getAsset()} ({$paymentUnit->getService()->getName()})\n" .
                "OUT: {$payoutUnit->getPaymentSystem()->getName()} {$payoutUnit->getCurrency()->getAsset()} ({$payoutUnit->getService()->getName()})"
            ));
            $requisition->setPairPercent($requisition->getPair()->getPercent());
            try {
                $this->entityManager->persist($requisition);
                $this->entityManager->flush();
            } catch (\Exception $exception) {
                $this->chatter->send($this->chatMessage->subject(
                    "UPDATE PAIR PERCENT ERROR (PAYMENT CALLBACK)\n" .
                    "REQUISITION ID: {$requisition->getId()}\n" .
                    "MESSAGE: {$exception->getMessage()}"
                ));
            }
        }

        $this->chatter->send($this->chatMessage->subject(
            "START FEE (PAYMENT CALLBACK)\n" .
            "REQUISITION ID : {$requisition->getId()}\n" .
            "PERCENT: {$requisition->getPair()->getPercent()}\n" .
            "IN: {$paymentUnit->getPaymentSystem()->getName()} {$paymentUnit->getCurrency()->getAsset()} ({$paymentUnit->getService()->getName()})\n" .
            "OUT: {$payoutUnit->getPaymentSystem()->getName()} {$payoutUnit->getCurrency()->getAsset()} ({$payoutUnit->getService()->getName()})"
        ));

        try {
            // UPDATE REQUISITION FEE
            (new RequisitionFeeHistoryHistoryBuilder($this->entityManager))
                ->setFee($requisition, $requisition->getPair()->getPayment(), false)
                ->storeItem();
        } catch (\Exception $exception) {
            $this->chatter->send($this->chatMessage->subject(
                "ERROR FEE (PAYMENT CALLBACK)" .
                "REQUISITION ID : {$requisition->getId()}"
            ));
        }

        // BOT
        $this->chatter->send($this->chatMessage->subject(
            "UPDATED REQUISITION FEE (PAYMENT CALLBACK)\n" .
            "REQUISITION ID: {$requisition->getId()}\n" .
            "IN: {$paymentUnit->getPaymentSystem()->getName()} {$paymentUnit->getCurrency()->getAsset()} ({$paymentUnit->getService()->getName()})\n" .
            "OUT: {$payoutUnit->getPaymentSystem()->getName()} {$payoutUnit->getCurrency()->getAsset()} ({$payoutUnit->getService()->getName()})"
        ));

        if (Currency::TYPE_CURRENCY === $pair->getPayment()->getCurrency()->getTag() && $pair->getPayment()->getPaymentSystem()->getSubName() === "CASH") {
            $requisition->setPaymentAmount($paymentInvoice->getAmount());
            $this->chatter->send($this->chatMessage->subject(
                "UPDATED PAYMENT AMOUNT ON CASH (PAYMENT CALLBACK)\n" .
                "REQUISITION ID: {$requisition->getId()}\n" .
                "IN: {$paymentUnit->getPaymentSystem()->getName()} {$paymentUnit->getCurrency()->getAsset()} ({$paymentUnit->getService()->getName()})\n" .
                "OUT: {$payoutUnit->getPaymentSystem()->getName()} {$payoutUnit->getCurrency()->getAsset()} ({$payoutUnit->getService()->getName()})"
            ));
        }

        // RECALCULATE REQUISITION AMOUNT
        CallbackService::recalculateRequisitionAmount($requisition, $paymentInvoice);
        $this->entityManager->persist($requisition);
        $this->entityManager->flush();

        $payoutInvoice = $this->entityManager->getRepository(Invoice::class)->findOneBy([
            'direction' => Pair::PAYOUT, 'requisition' => $requisition
        ]);

        if ($payoutInvoice !== null) {
            $this->chatter->send($this->chatMessage->subject(
                "UNSUBSCRIBE EXIST PAYOUT INVOICE (PAYMENT CALLBACK)" .
                "REQUISITION ID: {$requisition->getId()}"
            ));

            return new Response("UNSUBSCRIBE EXIST PAYOUT INVOICE", 200);
        }

//        if ($payoutInvoice === null) {
        $payoutInvoice = new Invoice();
        $payoutInvoice->setRequisition($requisition);
        $payoutInvoice->setDirection(Pair::PAYOUT);
//        }

        // CREATE INVOICE ATTRIBUTES
        $invoice = $this->createInvoice($payoutInvoice, Pair::PAYOUT);

        if (Currency::TYPE_CURRENCY === $pair->getPayment()->getCurrency()->getTag()) {
            $invoice['amount'] = (string)round(CallbackService::recalculatePayoutAmount($requisition, $pair->getPercent()), 2);
            $this->chatter->send($this->chatMessage->subject(
                "REQUISITION ID: {$requisition->getId()}\n" .
                "AMOUNT: " . $requisition->getAmountWithFee() / $requisition->getPair()->getPayment()->getCurrency()->getPaymentRate() . "\n" .
                "COURSE " . Course::calculate($requisition->getPair(), $requisition->getPairPercent()) . "\n" .
                "IN: {$paymentUnit->getPaymentSystem()->getName()} {$paymentUnit->getCurrency()->getAsset()} ({$paymentUnit->getService()->getName()})\n" .
                "OUT: {$payoutUnit->getPaymentSystem()->getName()} {$payoutUnit->getCurrency()->getAsset()} ({$payoutUnit->getService()->getName()})\n" .
                "(PAYMENT CALLBACK)"
            ));
        }

        // BOT
        $this->chatter->send($this->chatMessage->subject(
            "PAYMENT CALLBACK AMOUNT: {$invoice['amount']}\n" .
            "REQUISITION ID: {$requisition->getId()}\n" .
            "IN: {$paymentUnit->getPaymentSystem()->getName()} {$paymentUnit->getCurrency()->getAsset()} ({$paymentUnit->getService()->getName()})\n" .
            "OUT: {$payoutUnit->getPaymentSystem()->getName()} {$payoutUnit->getCurrency()->getAsset()} ({$payoutUnit->getService()->getName()})"
        ));

        /** @var BankDetail $payoutBankDetail */
        $payoutBankDetail = $this->entityManager->getRepository(BankDetail::class)->findBankDetailsByDirection(
            $pair->getPayout(), $requisition, Pair::PAYOUT
        );

        if ($payoutBankDetail) {
            $collection = [];
            $attributes = $payoutBankDetail->getAttributes()->getValues();
            array_walk($attributes, static function ($value) use (&$collection) {
                $collection[$value->getName()] = $value->getValue();
            });
            $invoice['attributes'] = $collection;
        }

        try {
            $requestContent = $this->apiClient->ControlPanel()->Payout()->setInvoice($invoice)->getData()->first();
            $this->chatter->send($this->chatMessage->subject(
                "CREATED PAYOUT (PAYMENT CALLBACK)\n" .
                "REQUISITION ID: {$requisition->getId()}\n" .
                "IN: {$paymentUnit->getPaymentSystem()->getName()} {$paymentUnit->getCurrency()->getAsset()} ({$paymentUnit->getService()->getName()})\n" .
                "OUT: {$payoutUnit->getPaymentSystem()->getName()} {$payoutUnit->getCurrency()->getAsset()} ({$payoutUnit->getService()->getName()})"
            ));

            if ($requestContent instanceof setInvoice) {
                $payoutInvoice->setExternalId(Uuid::fromString($requestContent->getId()));
                if ($requestContent->getStatus() === "FAIL") {
                    // ERROR PAYOUT
                    $this->chatter->send($this->chatMessage->subject(
                        "ERROR STATUS FAIL (PAYMENT CALLBACK)\n" .
                        "REQUISITION ID: {$requisition->getId()}\n" .
                        "IN: {$paymentUnit->getPaymentSystem()->getName()} {$paymentUnit->getCurrency()->getAsset()} ({$paymentUnit->getService()->getName()})\n" .
                        "OUT: {$payoutUnit->getPaymentSystem()->getName()} {$payoutUnit->getCurrency()->getAsset()} ({$payoutUnit->getService()->getName()})"
                    ));
                    $this->unsubscribeFailStatus($paymentInvoice);
                    return new Response("INVALID PAYMENT CALLBACK", 200);
                }
            }
        } catch (\Exception $exception) {
            // ERROR PAYOUT
            $this->chatter->send($this->chatMessage->subject(
                "API LIBRARY ERROR (PAYMENT CALLBACK)\n" .
                "REQUISITION ID: {$requisition->getId()}\n" .
                "MESSAGE: {$exception->getMessage()}\n" .
                "IN: {$paymentUnit->getPaymentSystem()->getName()} {$paymentUnit->getCurrency()->getAsset()} ({$paymentUnit->getService()->getName()})\n" .
                "OUT: {$payoutUnit->getPaymentSystem()->getName()} {$payoutUnit->getCurrency()->getAsset()} ({$payoutUnit->getService()->getName()})"
            ));
            $this->unsubscribeFailStatus($paymentInvoice);
            return new Response("INVALID PAYMENT CALLBACK", 200);
        }

        if (!$requestContent instanceof setInvoice) {
            $requisition->setStatus(Requisition::STATUS_ERROR);
            $this->entityManager->persist($requisition);
            $this->entityManager->flush();
            return new Response("INVALID PAYOUT REQUEST OR DENORMALIZATION", 200);
        }

        $requisition->setStatus(Requisition::STATUS_PROCESSED);
        $paymentInvoice->setStatus(Invoice::STATUS_PROCESSED);
        $this->entityManager->persist($paymentInvoice);

        $payoutFlowContent = $requestContent->getFlowData();

        try {
            if ($payoutFlowContent) {
                FlowDataService::insertFlowData($this->entityManager, $this->chatter, $this->eventDispatcher, $payoutInvoice, $payoutFlowContent, $requestContent->getStatus());
            }
        } catch (\Exception $exception) {
            $this->chatter->send($this->chatMessage->subject(
                "PAYMENT CALLBACK ERROR FLOW DATA\n" .
                "REQUISITION ID: {$requisition->getId()}\n" .
                "MESSAGE: {$exception->getMessage()}"
            ));
        }

        // SEND EMAIL
        try {
            $this->chatter->send($this->chatMessage->subject(
                "PAYMENT CALLBACK SEND LETTER\n" .
                "REQUISITION ID: {$requisition->getId()}\n" .
                "IN: {$paymentUnit->getPaymentSystem()->getName()} {$paymentUnit->getCurrency()->getAsset()} ({$paymentUnit->getService()->getName()})\n" .
                "OUT: {$payoutUnit->getPaymentSystem()->getName()} {$payoutUnit->getCurrency()->getAsset()} ({$payoutUnit->getService()->getName()})"
            ));
            $this->eventDispatcher->dispatch(new RequisitionCallbackEvent($requisition, Pair::PAYMENT));
        } catch (\Exception $exception) {
            $this->chatter->send($this->chatMessage->subject(
                "PAYMENT CALLBACK SEND LETTER ERROR\n" .
                "REQUISITION ID: {$requisition->getId()}\n" .
                "MESSAGE: {$exception->getMessage()}"
            ));
        }

        $this->entityManager->persist($payoutInvoice);
        $this->entityManager->flush();

        try {
            $this->LogServiceODM->info(
                'Пользователь оплатил заявку с номером  ' . $requisition->getId() . ' на сумму ' .
                (string)round($requisition->getPayoutAmount(), 2) . ' ' .
                $pair->getPayout()->getCurrency()->getAsset(),
                $requisition->getClient()
            );
        } catch (\Exception $exception) {
            $this->chatter->send($this->chatMessage->subject(
                "PAYMENT CALLBACK LOG ERROR\n" .
                "REQUISITION ID: {$requisition->getId()}\n" .
                "MESSAGE: {$exception->getMessage()}"
            ));
        }

        if ($listener) {
            $update = new Update(
                Invoice::CALLBACK_TOPIC . $requisition->getId(),
                json_encode(['status' => Invoice::STATUS_PROCESSED, 'requisition_status' => $requisition->getStatus()])
            );
            $publisher($update);

            $this->chatter->send($this->chatMessage->subject(
                "END CARD APPROVE\n" .
                "REQUISITION ID: {$requisition->getId()}\n" .
                "IN: {$paymentUnit->getPaymentSystem()->getName()} {$paymentUnit->getCurrency()->getAsset()} ({$paymentUnit->getService()->getName()})\n" .
                "OUT: {$payoutUnit->getPaymentSystem()->getName()} {$payoutUnit->getCurrency()->getAsset()} ({$payoutUnit->getService()->getName()})"
            ));
        }
    }

    /**
     * @param $tag
     * @param $profit
     * @param $rate
     * @return float
     */
    public function convert($tag, $profit, $rate): float
    {
        $value = ($tag === "CRYPTO" ? (($profit * $rate) * 100 / 100 ): (($profit / $rate) * 100) / 100);
        return round($value, 2);
    }
}
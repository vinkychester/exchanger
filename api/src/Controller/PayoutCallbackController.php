<?php


namespace App\Controller;


use App\Entity\Invoice;
use App\Entity\Pair;
use App\Entity\Requisition;
use App\Events\RequisitionCallbackEvent;
use App\Service\Callback\CallbackService;
use App\Service\CashbackSystem\CashbackRecountBalancesService;
use App\Service\FlowData\FlowDataService;
use App\Service\Log\LogServiceODM;
use App\Service\ReferralSystem\ReferralRecountBalancesService;
use App\Service\RequisitionFeeHistoryBuilder\RequisitionFeeHistoryHistoryBuilder;
use App\Utils\Signature;
use Doctrine\ORM\EntityManagerInterface;
use ItlabStudio\ApiClient\CodeBase\ApiResources\ControlPanel\Responses\Payout\setInvoice;
use Ramsey\Uuid\Uuid;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\PublisherInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Notifier\ChatterInterface;
use Symfony\Component\Notifier\Exception\TransportExceptionInterface;
use Symfony\Component\Notifier\Message\ChatMessage;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

/**
 * Class PayoutCallbackController
 * @package App\Controller
 * @Route("/api")
 */
class PayoutCallbackController extends AbstractController
{
    /**
     * @Route("/payout-callback/{id}", name="payout_callback")
     * @param Request $request
     * @param PublisherInterface $publisher
     * @param ChatterInterface $chatter
     * @param DenormalizerInterface $denormalizer
     * @param EventDispatcherInterface $eventDispatcher
     * @param EntityManagerInterface $entityManager
     * @param LogServiceODM $LogServiceODM
     * @param CallbackService $callbackService
     * @param ReferralRecountBalancesService $balancesService
     * @param CashbackRecountBalancesService $cashbackRecountBalancesService
     * @param string $id
     * @return Response
     * @throws ExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function payoutCallback(
        Request $request,
        PublisherInterface $publisher,
        ChatterInterface $chatter,
        DenormalizerInterface $denormalizer,
        EventDispatcherInterface $eventDispatcher,
        EntityManagerInterface $entityManager,
        LogServiceODM $LogServiceODM,
        CallbackService $callbackService,
        ReferralRecountBalancesService $balancesService,
        CashbackRecountBalancesService $cashbackRecountBalancesService,
        string $id): Response
    {
        $chatMessage = new ChatMessage('');
        $chatMessage->transport("telegram_debug");

        /** @var Invoice $payoutInvoice */
        $payoutInvoice = $this->getDoctrine()->getManager()->getRepository(Invoice::class)->find($id);

        if (!$payoutInvoice) {
            return new Response("UNSUBSCRIBE OF NOT EXIST INVOICE", 200);
        }

        $requisition = $payoutInvoice->getRequisition();

        $content = json_decode($request->getContent(), true)["data"];
        $response = json_decode($request->getContent(), true);
        $requestContent = $denormalizer->denormalize($content, setInvoice::class, "array");

        // CHECK Signature
        try {
            if (!Signature::check(
                json_encode($content, JSON_UNESCAPED_SLASHES),
                $response['signature'],
                $_ENV['JWT_CONTROL_PANEL_SECRET']
            )) {
                return new Response("UNSUBSCRIBE OF SIGNATURE (PAYOUT CALLBACK)", 200);
            }
        } catch (\Exception $exception) {
            $chatter->send($chatMessage->subject("PAYOUT CALLBACK ERROR Signature\n" .
                "REQUISITION ID : {$requisition->getId()}" .
                "MESSAGE: {$exception->getMessage()}"
            ));
        }

        // UNSUBSCRIBE OF FAIL STATUS
        if ($requestContent->getStatus() === Invoice::STATUS_FAIL) {
            // BOT
            $chatter->send($chatMessage->subject(
                "UNSUBSCRIBE OF FAIL STATUS (PAYOUT CALLBACK)\n" .
                "REQUISITION ID: {$requisition->getId()}"
            ));
            $callbackService->unsubscribeFailStatus($payoutInvoice);
            return new Response("INVALID PAYOUT CALLBACK", 200);
        }

        // UNSUBSCRIBE
        if ($payoutInvoice->getStatus() === Invoice::STATUS_PROCESSED) {
            // BOT
            $chatter->send($chatMessage->subject(
                "UNSUBSCRIBE OF PROCESSED STATUS (PAYOUT CALLBACK)\n" .
                "REQUISITION ID : {$requisition->getId()}"
            ));
            return new Response("UNSUBSCRIBE OF PROCESSED STATUS", 200);
        }

        $paymentUnit = $requisition->getPair()->getPayment();
        $payoutUnit = $requisition->getPair()->getPayout();


        $chatter->send($chatMessage->subject(
            "PAYOUT CALLBACK DATA: \n" .
            "REQUISITION ID: {$requisition->getId()}\n STATUS: {$requestContent->getStatus()}\n" .
            "PROCESSED AMOUNT: {$requestContent->getProcessedAmount()}\n" .
            "AMOUNT: {$requestContent->getAmount()}\n" .
            "IN: {$paymentUnit->getPaymentSystem()->getName()} {$paymentUnit->getCurrency()->getAsset()} ({$paymentUnit->getService()->getName()})\n" .
            "OUT: {$payoutUnit->getPaymentSystem()->getName()} {$payoutUnit->getCurrency()->getAsset()} ({$payoutUnit->getService()->getName()})"
        ));

        // UNSUBSCRIBE NEW STATUS
        if ($requestContent->getStatus() === Invoice::STATUS_NEW) {
            // BOT
            $chatter->send($chatMessage->subject(
                "UNSUBSCRIBE OF NEW STATUS (PAYOUT CALLBACK)\n" .
                "REQUISITION ID: {$requisition->getId()}"
            ));
            return new Response("UNSUBSCRIBE OF NEW STATUS", 200);
        }

        // SET ERROR STATUS
        if (!$requestContent instanceof setInvoice) {
            $requisition->setStatus(Requisition::STATUS_ERROR);
            return new Response("Invalid Payment request or denormalization", 200);
        }

        $payoutInvoice->setStatus($requestContent->getStatus());
        $payoutInvoice->setPaidAmount($requestContent->getProcessedAmount());
        $payoutInvoice->setAmount($requestContent->getAmount());
        $payoutInvoice->setExternalId(Uuid::fromString($requestContent->getId()));

        // INSERT FLOW DATA
        $flowContent = $requestContent->getFlowData();
        if ($flowContent) {
            FlowDataService::insertFlowData($this->getDoctrine()->getManager(), $chatter, $eventDispatcher, $payoutInvoice, $flowContent, $requestContent->getStatus());
        }

        $chatter->send($chatMessage->subject(
            "PAYOUT CALLBACK INSERTED FLOW DATA\n" .
            "REQUISITION ID: {$requisition->getId()}\n" .
            "IN: {$paymentUnit->getPaymentSystem()->getName()} {$paymentUnit->getCurrency()->getAsset()} ({$paymentUnit->getService()->getName()})\n" .
            "OUT: {$payoutUnit->getPaymentSystem()->getName()} {$payoutUnit->getCurrency()->getAsset()} ({$payoutUnit->getService()->getName()})"
        ));

        if ($payoutInvoice->getStatus() === Invoice::STATUS_PROCESSED) {
            $chatter->send($chatMessage->subject(
                "PAYOUT CALLBACK STARTED PROCESSED\n" .
                "REQUISITION ID: {$requisition->getId()}\n" .
                "IN: {$paymentUnit->getPaymentSystem()->getName()} {$paymentUnit->getCurrency()->getAsset()} ({$paymentUnit->getService()->getName()})\n" .
                "OUT: {$payoutUnit->getPaymentSystem()->getName()} {$payoutUnit->getCurrency()->getAsset()} ({$payoutUnit->getService()->getName()})"
            ));
//
            // UPDATE FEE
            (new RequisitionFeeHistoryHistoryBuilder($entityManager))
                ->setFee($requisition, $requisition->getPair()->getPayout(), false)
                ->storeItem();

            $chatter->send($chatMessage->subject(
                "PAYOUT CALLBACK UPDATED FEE\n" .
                "REQUISITION ID : {$requisition->getId()}\n" .
                "IN: {$paymentUnit->getPaymentSystem()->getName()} {$paymentUnit->getCurrency()->getAsset()} ({$paymentUnit->getService()->getName()})\n" .
                "OUT: {$payoutUnit->getPaymentSystem()->getName()} {$payoutUnit->getCurrency()->getAsset()} ({$payoutUnit->getService()->getName()})"
            ));

            $requisition->setPayoutAmount($payoutInvoice->getPaidAmount());

            if ($requisition->getPair()->getPayout()->getPaymentSystem()->getSubName() === "CASH") {
                $requisition->setPayoutAmount($payoutInvoice->getAmount());
            }

            if ($requisition->getPair()->getPayout()->getService()->getName() === "UaPay" || $requisition->getPair()->getPayout()->getService()->getName() === "Kuna") {
                $requisition->setPayoutAmount($payoutInvoice->getAmount());
            }

            // RECALCULATE COURSE
            CallbackService::recalculateRequisitionCourse($requisition);
            // RECALCULATE REQUISITION PROFIT PROFIT
            CallbackService::recalculateProfit($requisition);
            // CALCULATE MANAGER PROFIT
            CallbackService::recalculateManagerProfit($requisition, $entityManager);
            // RECALCULATE CASHBACK PROFIT
            if ($requisition->getExchangePoint() === 'bank') {
                try {
                    CallbackService::recalculateCashbackProfit($requisition, $entityManager, $cashbackRecountBalancesService);
                } catch (\Exception $exception) {
                    $chatter->send($chatMessage->subject(
                        "PAYOUT CALLBACK CASHBACK ERROR\n" .
                        "REQUISITION ID: {$requisition->getId()}" .
                        "MESSAGE: {$exception->getMessage()}"
                    ));
                }
            }
            // RECALCULATE REFERRAL PROFIT
            try {
                CallbackService::recalculateReferralProfit($requisition, $entityManager, $balancesService);
            } catch (\Exception $exception) {
                $chatter->send($chatMessage->subject(
                    "PAYOUT CALLBACK REFERRAL ERROR\n" .
                    "REQUISITION ID : {$requisition->getId()}\n" .
                    "MESSAGE: {$exception->getMessage()}"
                ));
            }

            // RECALCULATE SYSTEM PROFIT
            try {
                CallbackService::recalculateSystemProfit($requisition, $entityManager);
            } catch (\Exception $exception) {
                $chatter->send($chatMessage->subject(
                    "PAYOUT CALLBACK REQUISITION PROFITS ERROR\n" .
                    "REQUISITION ID : {$requisition->getId()}\n" .
                    "MESSAGE: {$exception->getMessage()}"
                ));
            }

            $this->getDoctrine()->getManager()->persist($requisition);
            $entityManager->flush();

            $requisition->setStatus(Requisition::STATUS_FINISHED);
            $chatter->send($chatMessage->subject(
                "PAYOUT CALLBACK REQUISITION PROFITS\n" .
                "REQUISITION ID: {$requisition->getId()}\n" .
                "IN: {$paymentUnit->getPaymentSystem()->getName()} {$paymentUnit->getCurrency()->getAsset()} ({$paymentUnit->getService()->getName()})\n" .
                "OUT: {$payoutUnit->getPaymentSystem()->getName()} {$payoutUnit->getCurrency()->getAsset()} ({$payoutUnit->getService()->getName()})"
            ));

            // SEND EMAIL
            try {
                // BOT
                $chatter->send($chatMessage->subject(
                    "PAYOUT CALLBACK SEND LETTER\n" .
                    "REQUISITION ID: {$requisition->getId()}\n" .
                    "IN: {$paymentUnit->getPaymentSystem()->getName()} {$paymentUnit->getCurrency()->getAsset()} ({$paymentUnit->getService()->getName()})\n" .
                    "OUT: {$payoutUnit->getPaymentSystem()->getName()} {$payoutUnit->getCurrency()->getAsset()} ({$payoutUnit->getService()->getName()})"
                ));
                $eventDispatcher->dispatch(new RequisitionCallbackEvent($requisition, Pair::PAYOUT));
            } catch (\Exception $exception) {
                $chatter->send($chatMessage->subject(
                    "PAYOUT CALLBACK SEND LETTER ERROR\n" .
                    "REQUISITION ID: {$requisition->getId()}\n" .
                    "MESSAGE: {$exception->getMessage()}"
                ));
            }

            $requisition->setEndDate(time());
            $this->getDoctrine()->getManager()->persist($requisition);
            $this->getDoctrine()->getManager()->flush();

            try {
                $LogServiceODM->info(
                    "Пользователю выплатили деньги на сумму 
                    {$payoutInvoice->getPaidAmount()} {$requisition->getPair()->getPayout()->getCurrency()->getAsset()}. 
                    На заявке с номером {$requisition->getId()}",
                    $requisition->getClient()
                );
            } catch (\Exception $exception) {
                $chatter->send($chatMessage->subject(
                    "PAYOUT CALLBACK LOG ERROR\n" .
                    "REQUISITION ID: {$requisition->getId()}\n" .
                    "MESSAGE: {$exception->getMessage()}"
                ));
            }
        }

        $payoutInvoice->setIsPaid(true);
        $this->getDoctrine()->getManager()->persist($payoutInvoice);
        $this->getDoctrine()->getManager()->flush();

        $update = new Update(
            Invoice::CALLBACK_TOPIC . $requisition->getId(),
            json_encode(['status' => $requestContent->getStatus(), 'requisition_status' => $requisition->getStatus()])
        );
        $publisher($update);
        // BOT
        $chatter->send($chatMessage->subject(
            "END CALLBACK (PAYOUT)\n" .
            "REQUISITION ID: {$requisition->getId()}\n" .
            "IN: {$paymentUnit->getPaymentSystem()->getName()} {$paymentUnit->getCurrency()->getAsset()} ({$paymentUnit->getService()->getName()})\n" .
            "OUT: {$payoutUnit->getPaymentSystem()->getName()} {$payoutUnit->getCurrency()->getAsset()} ({$payoutUnit->getService()->getName()})"
        ));
        return new Response("END CALLBACK", 200);
    }
}

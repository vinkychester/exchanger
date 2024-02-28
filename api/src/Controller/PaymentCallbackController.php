<?php

namespace App\Controller;


use App\Entity\CreditCard;
use App\Entity\Currency;
use App\Entity\FlowData;
use App\Entity\Invoice;
use App\Entity\Pair;
use App\Entity\Requisition;
use App\Service\Callback\CallbackService;
use App\Service\FlowData\FlowDataService;
use App\Utils\Signature;
use ItlabStudio\ApiClient\CodeBase\ApiResources\ControlPanel\Responses\Payment\setInvoice;
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
 * Class PaymentCallbackController
 * @package App\Controller
 * @Route("/api")
 */
class PaymentCallbackController extends AbstractController
{

    /**
     * @Route("/payment-callback/{id}", name="payment_callback")
     * @param Request $request
     * @param PublisherInterface $publisher
     * @param ChatterInterface $chatter
     * @param DenormalizerInterface $denormalizer
     * @param CallbackService $callbackService
     * @param EventDispatcherInterface $eventDispatcher
     * @param string $id
     * @return Response
     * @throws ExceptionInterface
     * @throws TransportExceptionInterface
     */
    public function paymentCallback(
        Request $request,
        PublisherInterface $publisher,
        ChatterInterface $chatter,
        DenormalizerInterface $denormalizer,
        CallbackService $callbackService,
        EventDispatcherInterface $eventDispatcher,
        string $id
    ): Response
    {
        $chatMessage = new ChatMessage('');
        $chatMessage->transport("telegram_debug");

        /** @var Invoice $paymentInvoice */
        $paymentInvoice = $this->getDoctrine()->getRepository(Invoice::class)->find($id);

        if (!$paymentInvoice) {
            return new Response("UNSUBSCRIBE OF NOT EXIST INVOICE", 200);
        }

        $requisition = $paymentInvoice->getRequisition();
        /** @var Pair $pair */
        $pair = $requisition->getPair();

        $content = json_decode($request->getContent(), true)["data"];
        $response = json_decode($request->getContent(), true);
        $requestPaymentContent = $denormalizer->denormalize($content, setInvoice::class, "array");

        // CHECK Signature
        try {
            if (!Signature::check(
                json_encode($content, JSON_UNESCAPED_SLASHES),
                $response['signature'],
                $_ENV['JWT_CONTROL_PANEL_SECRET']
            )) {
                return new Response("UNSUBSCRIBE OF SIGNATURE", 200);
            }
        } catch (\Exception $exception) {
            $chatter->send($chatMessage->subject("PAYMENT CALLBACK ERROR Signature:\n" .
                "REQUISITION ID : {$requisition->getId()}\n" .
                "MESSAGE: {$exception->getMessage()}"
            ));
            return new Response("UNSUBSCRIBE OF SIGNATURE", 200);
        }

        // UNSUBSCRIBE FAIL STATUS
        if ($requestPaymentContent->getStatus() === Invoice::STATUS_FAIL) {
            // BOT
            $chatter->send($chatMessage->subject(
                "UNSUBSCRIBE OF FAIL STATUS (PAYMENT CALLBACK)\n" .
                "REQUISITION ID: {$requisition->getId()}"
            ));
            $callbackService->unsubscribeFailStatus($paymentInvoice);
            return new Response("INVALID PAYMENT CALLBACK", 200);
        }

        // UNSUBSCRIBE
        if ($paymentInvoice->getStatus() === Invoice::STATUS_PROCESSED) {
            $chatter->send($chatMessage->subject(
                "UNSUBSCRIBE OF PROCESSED STATUS (PAYMENT CALLBACK)\n" .
                "REQUISITION ID : {$requisition->getId()}"
            ));
            return new Response("UNSUBSCRIBE OF PROCESSED STATUS", 200);
        }

        if (!$requestPaymentContent instanceof setInvoice) {
            $requisition->setStatus(Requisition::STATUS_ERROR);
            return new Response("INVALID PAYMENT REQUEST OR DENORMALIZATION", 200);
        }

        // UNSUBSCRIBE
        if ($requestPaymentContent->getStatus() === Invoice::STATUS_NEW) {
            return new Response("UNSUBSCRIBE OF NEW STATUS", 200);
        }

        $paymentUnit = $pair->getPayment();
        $payoutUnit = $pair->getPayout();

        $chatter->send($chatMessage->subject("PAYMENT CALLBACK DATA: \n" .
            "REQUISITION ID: {$requisition->getId()}\n" .
            "STATUS: {$requestPaymentContent->getStatus()}\n" .
            "PROCESSED AMOUNT: {$requestPaymentContent->getProcessedAmount()}\n" .
            "AMOUNT: {$requestPaymentContent->getAmount()}\n" .
            "IN: {$paymentUnit->getPaymentSystem()->getName()} {$paymentUnit->getCurrency()->getAsset()} ({$paymentUnit->getService()->getName()})\n" .
            "OUT: {$payoutUnit->getPaymentSystem()->getName()} {$payoutUnit->getCurrency()->getAsset()} ({$payoutUnit->getService()->getName()})"

        ));

        if ($requestPaymentContent->getStatus() !== Invoice::STATUS_PROCESSED) {
            $paymentInvoice->setStatus($requestPaymentContent->getStatus());
        }

        $paymentInvoice->setPaidAmount($requestPaymentContent->getProcessedAmount());
        $paymentInvoice->setAmount($requestPaymentContent->getAmount());
        $paymentInvoice->setExternalId(Uuid::fromString($requestPaymentContent->getId()));

        // INSERT FLOW DATA
        $paymentFlowContent = $requestPaymentContent->getFlowData();
        if ($paymentFlowContent) {
            FlowDataService::insertFlowData($this->getDoctrine()->getManager(), $chatter, $eventDispatcher, $paymentInvoice, $paymentFlowContent, $requestPaymentContent->getStatus());
        }

        // CREATE PAYOUT
        if ($requestPaymentContent->getStatus() === Invoice::STATUS_PROCESSED) {
            $chatter->send($chatMessage->subject(
                "START PROCESSED (PAYMENT CALLBACK)\n" .
                "REQUISITION ID: {$requisition->getId()}\n" .
                "IN: {$paymentUnit->getPaymentSystem()->getName()} {$paymentUnit->getCurrency()->getAsset()} ({$paymentUnit->getService()->getName()})\n" .
                "OUT: {$payoutUnit->getPaymentSystem()->getName()} {$payoutUnit->getCurrency()->getAsset()} ({$payoutUnit->getService()->getName()})"
            ));

            if (Currency::TYPE_CRYPTO === $pair->getPayment()->getCurrency()->getTag()) {
                if (array_key_exists('amount', $paymentFlowContent)) {
                    $requisition->setPaymentAmount($paymentFlowContent["amount"]);
                }
            }

            // SET STATUS TO REQUISITION
            $requisition->setStatus(Requisition::STATUS_PROCESSED);

            // CREDIT CARD VERIFICATION
            if ($requisition->getPair()->getPayment()->getIsCardVerification() &&
                $requisition->getPair()->getPayment()->getCurrency()->getTag() === Currency::TYPE_CURRENCY &&
                array_key_exists('cardMask', $paymentFlowContent)) {
                $chatter->send($chatMessage->subject(
                    "START CHECK CARD VERIFICATION (PAYMENT CALLBACK)\n" .
                    "REQUISITION ID: {$requisition->getId()}\n" .
                    "IN: {$paymentUnit->getPaymentSystem()->getName()} {$paymentUnit->getCurrency()->getAsset()} ({$paymentUnit->getService()->getName()})\n" .
                    "OUT: {$payoutUnit->getPaymentSystem()->getName()} {$payoutUnit->getCurrency()->getAsset()} ({$payoutUnit->getService()->getName()})"
                ));

                $creditCard = $this->getDoctrine()->getRepository(CreditCard::class)->findOneBy([
                    'cardMask' => $paymentFlowContent['cardMask'], 'client' => $requisition->getClient(), 'status' => CreditCard::VERIFIED
                ]);

                if (!$creditCard || $creditCard->getStatus() !== CreditCard::VERIFIED) {
                    $chatter->send($chatMessage->subject(
                        "NEED CARD VERIFICATION (PAYMENT CALLBACK)\n" .
                        "REQUISITION ID: {$requisition->getId()}\n" .
                        "IN: {$paymentUnit->getPaymentSystem()->getName()} {$paymentUnit->getCurrency()->getAsset()} ({$paymentUnit->getService()->getName()})\n" .
                        "OUT: {$payoutUnit->getPaymentSystem()->getName()} {$payoutUnit->getCurrency()->getAsset()} ({$payoutUnit->getService()->getName()})\n" .
                        "CREDIT CARD: {$paymentFlowContent['cardMask']}"
                    ));

                    $requisition->setStatus(Requisition::STATUS_CARD_VERIFICATION);
                    $paymentInvoice->setStatus(Invoice::STATUS_CARD_VERIFICATION);
                    $cardMaskFlow = $this->getDoctrine()->getRepository(FlowData::class)->findOneBy([
                        'name' => 'cardMask', 'invoice' => $paymentInvoice
                    ]);

                    if ($cardMaskFlow) {
                        $cardMaskFlow->setStatus(Invoice::STATUS_CARD_VERIFICATION);
                        $this->getDoctrine()->getManager()->persist($cardMaskFlow);
                    }

                    $paymentInvoice->setIsPaid(true);
                    $this->getDoctrine()->getManager()->persist($requisition);
                    $this->getDoctrine()->getManager()->persist($paymentInvoice);
                    $this->getDoctrine()->getManager()->flush();
                    // send error status
                    $update = new Update(
                        Invoice::CALLBACK_TOPIC . $requisition->getId(),
                        json_encode(['status' => Invoice::STATUS_CARD_VERIFICATION, 'requisition_status' => $requisition->getStatus()])
                    );

                    // The Publisher service is an invokable object
                    $publisher($update);
                    return new Response("NEED CARD VERIFICATION PAYMENT CALLBACK", 200);
                }
            }

            $callbackService->createPayout($requisition, $paymentInvoice);
        }

        $this->getDoctrine()->getManager()->persist($paymentInvoice);
        $this->getDoctrine()->getManager()->flush();

        $update = new Update(
            Invoice::CALLBACK_TOPIC . $requisition->getId(),
            json_encode(['status' => $requestPaymentContent->getStatus(), 'requisition_status' => $requisition->getStatus()])
        );
        $publisher($update);

        // BOT
        $chatter->send($chatMessage->subject(
            "END CALLBACK (PAYMENT)\n" .
            "REQUISITION ID: {$requisition->getId()}\n" .
            "IN: {$paymentUnit->getPaymentSystem()->getName()} {$paymentUnit->getCurrency()->getAsset()} ({$paymentUnit->getService()->getName()})\n" .
            "OUT: {$payoutUnit->getPaymentSystem()->getName()} {$payoutUnit->getCurrency()->getAsset()} ({$payoutUnit->getService()->getName()})"
        ));
        return new Response("END CALLBACK", 200);
    }
}

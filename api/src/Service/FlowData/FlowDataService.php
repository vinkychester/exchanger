<?php


namespace App\Service\FlowData;


use App\Entity\FlowData;
use App\Entity\Invoice;
use App\Events\MCCashSecretCodeEvent;
use Doctrine\Persistence\ObjectManager;
use Exception;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Notifier\ChatterInterface;
use Symfony\Component\Notifier\Exception\TransportExceptionInterface;
use Symfony\Component\Notifier\Message\ChatMessage;

/**
 * Class FlowDataService
 * @package App\Service\FlowData
 */
class FlowDataService
{
    /**
     * @param ObjectManager $entityManager
     * @param ChatterInterface $chatter
     * @param EventDispatcherInterface $eventDispatcher
     * @param Invoice $invoice
     * @param $flowContent
     * @param string $status
     * @throws TransportExceptionInterface
     */
    public static function insertFlowData(
        ObjectManager $entityManager,
        ChatterInterface $chatter,
        EventDispatcherInterface $eventDispatcher,
        Invoice $invoice,
        $flowContent,
        string $status
    )
    {
        $chatMessage = new ChatMessage('');
        $chatMessage->transport("telegram_debug");

        $em = $entityManager;
        array_walk($flowContent, static function ($value, $key) use ($em, $invoice, $status, $flowContent, $eventDispatcher, $chatter, $chatMessage) {
            $flowData = $em->getRepository(FlowData::class)->findOneBy([
                'name' => $key, 'value' => $value, 'invoice' => $invoice
            ]);

            if ($key === "confirms") {
                $value = "{$value} / {$flowContent['expectedConfirms']}";
            }

            if ($key === "code") {
                try {
                    $eventDispatcher->dispatch(new MCCashSecretCodeEvent($value, $invoice->getRequisition()->getClient(), $invoice->getRequisition()));
                } catch (Exception $exception) {
                    $chatter->send($chatMessage->subject(
                        "ERROR SEND SECRET CODE LETTER: \n" .
                        "ERROR MESSAGE: {$exception->getMessage()}\n" .
                        "REQUISITION ID: {$invoice->getRequisition()->getId()}"
                    ));
                }
            }

            if ($key === "expectedConfirms") {
                return;
            }

            if (null === $flowData) {
                $flowData = $em->getRepository(FlowData::class)->findOneBy(['name' => $key, 'invoice' => $invoice]);
                if ($flowData) {
                    $flowData->setValue($value);
                } else {
                    $flowData = new FlowData();
                    $flowData->setName($key);
                    $flowData->setValue($value);
                    $flowData->setInvoice($invoice);
                }
            }
            $flowData->setStatus($status);
            $em->persist($flowData);
        });
        $em->flush();
    }
}
<?php


namespace App\EventSubscriber;


use App\Entity\Client;
use App\Entity\Currency;
use App\Events\PayoutRequisitionFinishedEvent;
use App\Service\CashbackSystem\CashbackRecountBalancesService;
use App\Service\ReferralSystem\ReferralRecountBalancesService;
use App\Service\TrafficLinks\TrafficLinksService;
use Calculation\Service\Exchange;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Exception;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;

/**
 * Class PayoutRequisitionFinishedSubscriber
 * @package App\EventSubscriber
 */
class PayoutRequisitionFinishedSubscriber implements EventSubscriberInterface
{
    /**
     * @var ReferralRecountBalancesService
     */
    protected ReferralRecountBalancesService $referralRecountBalancesService;
    /**
     * @var CashbackRecountBalancesService
     */
    protected CashbackRecountBalancesService $cashbackBalanceService;
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var TrafficLinksService
     */
    protected TrafficLinksService $trafficLinksService;

    /**
     * @var MailerInterface
     */
    private MailerInterface $mailer;

    /**
     * PayoutRequisitionFinishedSubscriber constructor.
     * @param EntityManagerInterface $entityManager
     * @param ReferralRecountBalancesService $referralRecountBalancesService
     * @param CashbackRecountBalancesService $cashbackBalanceService
     * @param MailerInterface $mailer
     * @param TrafficLinksService $trafficLinksService
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        ReferralRecountBalancesService $referralRecountBalancesService,
        CashbackRecountBalancesService $cashbackBalanceService,
        MailerInterface $mailer,
        TrafficLinksService $trafficLinksService
    ) {
        $this->referralRecountBalancesService = $referralRecountBalancesService;
        $this->cashbackBalanceService = $cashbackBalanceService;
        $this->entityManager = $entityManager;
        $this->mailer = $mailer;
        $this->trafficLinksService = $trafficLinksService;
    }

    /**
     * @return array|\array[][]
     */
    public static function getSubscribedEvents()
    {
        return [
            PayoutRequisitionFinishedEvent::class => [
                ['onPayoutCompletionEvent', 40],
                ['updateTrafficRequisitionConversion', 70],
            ]
        ];
    }

    /**
     * @param PayoutRequisitionFinishedEvent $event
     * @throws TransportExceptionInterface
     */
    final public function onPayoutCompletionEvent(PayoutRequisitionFinishedEvent $event): void
    {
        try {
            $email = (new TemplatedEmail())
                ->to($event->getClient()->getEmail())
                ->subject("Requisition creating letter")
                ->htmlTemplate("emails/new_requisition.html.twig")
                ->context(["user" => $event->getClient(), "requisition" => $event->getRequisition()]);
            $this->mailer->send($email);
        } catch (Exception $e) {
            file_get_contents(
                "https://api.telegram.org/bot1132760191:AAHk2HgyE-aJxaTvXzGASSDNPzFkTGoGYYo/sendMessage?chat_id=-1001479842731&parse_mode=html&text=" .
                "ERROR WHEN SEND EMAIL TO CLIENT AFTER FINISH REQUISITION PROCESSING" . $e->getMessage()
            );
        }
    }

    /**
     * @param PayoutRequisitionFinishedEvent $event
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function updateTrafficRequisitionConversion(PayoutRequisitionFinishedEvent $event)
    {
        if (Client::REGISTRATION_TRAFFIC === $event->getRequisition()->getClient()->getRegistrationType()) {
            $this->trafficLinksService->updateRequisitionConversion($event->getRequisition()->getClient()->getToken());
            $this->trafficLinksService->updateSystemProfits(
                $event->getRequisition()->getClient()->getToken(),
                $event->getRequisition()->getProfit(),
                $event->getRequisition()->getCleanSystemProfit()
            );
        }
    }
}

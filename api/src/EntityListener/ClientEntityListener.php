<?php


namespace App\EntityListener;

use App\Entity\Balance;
use App\Entity\Client;
use App\Entity\ReferralClientLevel;
use App\Entity\ReferralLevel;
use App\Entity\User;
use App\Repository\CashbackClientLevelRepository;
use App\Repository\CashbackLevelRepository;
use App\Repository\ClientBalanceRepository;
use App\Service\Log\LogServiceODM;
use App\Service\ReferralSystem\ClientReferralParentsService;
use App\Service\ReferralSystem\ClientReferralRelationService;
use App\Service\TrafficLinks\TrafficLinksService;
use Doctrine\DBAL\Exception;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Security\Core\Security;

/**
 * Class UserImageEntityListener
 * @package App\EntityListener
 */
class ClientEntityListener
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
     * @var ClientReferralRelationService
     */
    protected ClientReferralRelationService $clientReferralRelation;
    /**
     * @var Request|null
     */
    protected ?Request $request;
    /**
     * @var CashbackClientLevelRepository
     */
    protected CashbackClientLevelRepository $cashbackClientLevelRepository;
    /**
     * @var CashbackLevelRepository
     */
    protected CashbackLevelRepository $cashbackLevelRepository;
    /**
     * @var TrafficLinksService
     */
    protected TrafficLinksService $trafficLinksService;
    /**
     * @var ClientBalanceRepository
     */
    protected ClientBalanceRepository $clientBalanceRepository;
    /**
     * @var ClientReferralParentsService
     */
    protected ClientReferralParentsService $clientReferralParentsService;

    /**
     * UserImageEntityListener constructor.
     * @param LogServiceODM $LogServiceODM
     * @param Security $security
     * @param MailerInterface $mailer
     * @param ClientReferralRelationService $clientReferralRelation
     * @param CashbackClientLevelRepository $cashbackClientLevelRepository
     * @param CashbackLevelRepository $cashbackLevelRepository
     * @param RequestStack $requestStack
     * @param TrafficLinksService $trafficLinksService
     * @param ClientBalanceRepository $clientBalanceRepository
     * @param ClientReferralParentsService $clientReferralParentsService
     */
    public function __construct(
        LogServiceODM $LogServiceODM,
        Security $security,
        MailerInterface $mailer,
        ClientReferralRelationService $clientReferralRelation,
        CashbackClientLevelRepository $cashbackClientLevelRepository,
        CashbackLevelRepository $cashbackLevelRepository,
        RequestStack $requestStack,
        TrafficLinksService $trafficLinksService,
        ClientBalanceRepository $clientBalanceRepository,
        ClientReferralParentsService $clientReferralParentsService
    )
    {
        $this->LogServiceODM = $LogServiceODM;
        $this->security = $security;
        $this->mailer = $mailer;
        $this->clientReferralRelation = $clientReferralRelation;
        $this->request = $requestStack->getCurrentRequest();
        $this->cashbackClientLevelRepository = $cashbackClientLevelRepository;
        $this->cashbackLevelRepository = $cashbackLevelRepository;
        $this->trafficLinksService = $trafficLinksService;
        $this->clientBalanceRepository = $clientBalanceRepository;
        $this->clientReferralParentsService = $clientReferralParentsService;
    }

    /**
     * @param Client $client
     * @param LifecycleEventArgs $eventArgs
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function prePersist(Client $client, LifecycleEventArgs $eventArgs)
    {
        $this->trafficLinksService->checkTrafficAndSave($client);
    }

    /**
     * @param Client $client
     * @param LifecycleEventArgs $eventArgs
     * @throws \Doctrine\DBAL\Driver\Exception
     * @throws Exception
     * @throws ORMException
     * @throws OptimisticLockException
     * @throws TransportExceptionInterface
     */
    public function postPersist(Client $client, LifecycleEventArgs $eventArgs)
    {
        $em = $eventArgs->getEntityManager();

        if ($client->getBalances()->count() !== 0) {
            $this->clientBalanceRepository->createClientBalance($client, Balance::BALANCE_FIELD, 0);
            $this->clientBalanceRepository->createClientBalance($client, Balance::MIN_PAYOUT_FIELD, 10);
        }

        $defaultCashbackLevel = $this->cashbackLevelRepository->getDefaultCashbackLevelByLevel(1);
        if ($defaultCashbackLevel) {
            $this->cashbackClientLevelRepository
                ->createCashbackClientLevel($client, $defaultCashbackLevel, 5, true);
        }

        if ($this->request && $refToken = $this->request->cookies->has('refToken')) {
            if ($em->getRepository(Client::class)->findOneBy([
                'referralToken' => $this->request->cookies->get('refToken')
            ])) {
                $this->clientReferralRelation->createReferralRelationByClientToken(
                    $this->request->cookies->get('refToken'),
                    $client
                );
                $this->clientReferralParentsService->createReferralRelationForAncestors($client);
                $this->clientReferralParentsService->createReferralClientLevelForAncestors($client);
            }

        }

        $em->flush();

        $this->LogServiceODM->info(
            'Пользователь зарегистрировался на сайте',
            $client
        );

        try {
            //send email
            $template = $client::ROLE_DEFAULT === User::CLIENT
                ? "client_registration.html.twig"
                : "administration_registration.html.twig";

            $email = (new TemplatedEmail())
                ->to($client->getEmail())
                ->subject('Регистрация на сайте')
                ->htmlTemplate("emails/{$template}")
                ->context(['user' => $client, 'password' => $client->getGeneratedPassword()]);

            $this->mailer->send($email);
        } catch (\Exception $exception) {
            file_get_contents("https://api.telegram.org/bot1132760191:AAHk2HgyE-aJxaTvXzGASSDNPzFkTGoGYYo/sendMessage?chat_id=-1001479842731&parse_mode=html&text=" .
                "FAIL SEND LETTER CLIENT REGISTRATION {$exception->getMessage()}"
            );
        }
    }

    /**
     * @param Client $user
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postUpdate(Client $user, LifecycleEventArgs $eventArgs): void
    {
        $changeSets = $eventArgs->getEntityManager()->getUnitOfWork()->getEntityChangeSet($user);

        if (isset($changeSets['isBanned'])) {
            $message = 'Администратор изменил статус клиента "' . $user->getEmail() . '": ' .
                (($changeSets['isBanned'][1] == 1) ? '"Забанил"' : '"Розбанил"');
        } else {
            $message = 'Пользователь изменил ' . implode(', ', array_keys($changeSets));
        }

        $this->LogServiceODM->info(
            $message,
            $this->security->getUser()
        );
    }

    /**
     * preRemove
     * postRemove
     * prePersist
     * postPersist
     * preUpdate
     * postUpdate
     * postLoad
     * preFlush
     * onFlush
     * postFlush
     */
}

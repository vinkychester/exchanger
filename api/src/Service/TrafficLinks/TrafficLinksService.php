<?php


namespace App\Service\TrafficLinks;


use App\Service\UserService\UserRequestService;
use App\Entity\{Client, TrafficDetail, TrafficLink};
use App\Repository\{TrafficDetailRepository, TrafficLinkRepository};
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\{Request, RequestStack};

/**
 * Class TrafficLinksService
 * @package App\Service\TrafficLinks
 */
class TrafficLinksService
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var Request|null
     */
    protected ?Request $request;
    /**
     * @var TrafficLinkRepository
     */
    protected TrafficLinkRepository $trafficLinkRepository;
    /**
     * @var TrafficDetailRepository
     */
    protected TrafficDetailRepository $trafficDetailRepository;
    /**
     * @var UserRequestService
     */
    protected UserRequestService $userRequestService;

    /**
     * TrafficLinksService constructor.
     * @param EntityManagerInterface $entityManager
     * @param RequestStack $requestStack
     * @param UserRequestService $userRequestService
     * @param TrafficLinkRepository $trafficLinkRepository
     * @param TrafficDetailRepository $trafficDetailRepository
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        RequestStack $requestStack,
        UserRequestService $userRequestService,
        TrafficLinkRepository $trafficLinkRepository,
        TrafficDetailRepository $trafficDetailRepository
    ) {
        $this->entityManager = $entityManager;
        $this->request = $requestStack->getCurrentRequest();
        $this->trafficLinkRepository = $trafficLinkRepository;
        $this->trafficDetailRepository = $trafficDetailRepository;
        $this->userRequestService = $userRequestService;
    }

    /**
     * @param $site
     * @param $clientIp
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function assignTrafficDetails($site, $clientIp)
    {
        $trafficDetails = new TrafficDetail();
        $trafficDetails->setTrafficLink($site);
        $date = new \DateTime('now');
        $trafficDetails->setCreatedAt($date->getTimestamp());
        $trafficDetails->setIP($clientIp);
        $this->trafficDetailRepository->save($trafficDetails);
    }

    /**
     * @param Client $client
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function checkTrafficAndSave(Client $client)
    {
        $trafficToken = $this->request->cookies->get('traffic');
        if ($this->request && $trafficToken &&
            $site = $this->trafficLinkRepository->findTrafficLinkByToken($trafficToken)) {
            $client->setRegistrationType(Client::REGISTRATION_TRAFFIC);
            $client->setTrafficToken($trafficToken);
            $client->setTrafficLink($site);
            $this->updateRegisteredClientsCounter($trafficToken);

            $this->request->cookies->remove('traffic');
        }
    }

    /**
     * @param $token
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function updateRegisteredClientsCounter($token)
    {
        if ($site = $this->trafficLinkRepository->findTrafficLinkByToken($token)) {
            $site->increaseCountOfRegisteregClients();
            $this->trafficLinkRepository->save($site);
        }
    }

    /**
     * @param $token
     * @return \App\Entity\TrafficLink|null
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function updateClickConversion($token)
    {
        if ($token && $site = $this->trafficLinkRepository->findTrafficLinkByToken($token)) {
            if (empty($this->trafficDetailRepository->findTrafficDetails($site, $this->userRequestService->getIp()))) {
                $this->assignTrafficDetails($site, $this->userRequestService->getIp());
                $site->increaseCountOfClicks();
                $this->trafficLinkRepository->save($site);

                return $site;
            }
        }

        return null;
    }

    /**
     * @param $token
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function updateRequisitionConversion($token)
    {
        if ($site = $this->trafficLinkRepository->findTrafficLinkByToken($token)) {
            $site->increaseCountOfRequisitions();
            $this->trafficLinkRepository->save($site);
        }
    }

    /**
     * @param $token
     * @param $systemProfit
     * @param $cleanSystemProfit
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function updateSystemProfits($token, $systemProfit, $cleanSystemProfit)
    {
        if ($site = $this->trafficLinkRepository->findTrafficLinkByToken($token)) {
            $systemProfit && $site->increaseSystemProfit($systemProfit);
            $cleanSystemProfit && $site->increaseCleanSystemProfit($cleanSystemProfit);
            $this->trafficLinkRepository->save($site);
        }
    }
}

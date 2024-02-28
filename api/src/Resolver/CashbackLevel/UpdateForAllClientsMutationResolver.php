<?php


namespace App\Resolver\CashbackLevel;

use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\CashbackLevel;
use App\Repository\CashbackClientLevelRepository;
use App\Repository\CashbackLevelRepository;
use App\Repository\ClientRepository;
use App\Service\CashbackSystem\CashbackSystemService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

/**
 * Class UpdateForAllClientsMutationResolver
 * @package App\Resolver\CashbackLevel
 */
class UpdateForAllClientsMutationResolver implements MutationResolverInterface
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var CashbackSystemService
     */
    protected CashbackSystemService $cashbackSystemService;
    /**
     * @var CashbackClientLevelRepository
     */
    protected CashbackClientLevelRepository $cashbackClientLevelRepository;
    /**
     * @var ClientRepository
     */
    protected ClientRepository $clientRepository;
    /**
     * @var CashbackLevelRepository
     */
    protected CashbackLevelRepository $cashbackLevelRepository;

    /**
     * UpdateForAllClientsMutationResolver constructor.
     * @param EntityManagerInterface $entityManager
     * @param CashbackSystemService $cashbackSystemService
     * @param CashbackClientLevelRepository $cashbackClientLevelRepository
     * @param CashbackLevelRepository $cashbackLevelRepository
     * @param ClientRepository $clientRepository
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        CashbackSystemService $cashbackSystemService,
        CashbackClientLevelRepository $cashbackClientLevelRepository,
        CashbackLevelRepository $cashbackLevelRepository,
        ClientRepository $clientRepository
    ) {
        $this->entityManager = $entityManager;
        $this->cashbackSystemService = $cashbackSystemService;
        $this->cashbackClientLevelRepository = $cashbackClientLevelRepository;
        $this->clientRepository = $clientRepository;
        $this->cashbackLevelRepository = $cashbackLevelRepository;
    }

    /**
     * @param object|null $item
     * @param array $context
     * @return object|void|null
     */
    public function __invoke($item, array $context)
    {
        $args = $context['args']['input'];
        $cashbackLevelID = $args['cashbackLevelID'];

        $cashbackLevel = $this->entityManager->getRepository(CashbackLevel::class)->find($cashbackLevelID);
        if (!$cashbackLevel) {
            throw new ResourceNotFoundException('No such cashback level');
        }

//        $cashbackClientLevels = $this->cashbackClientLevelRepository->findAll();
//        if(count($cashbackClientLevels)) {
//            foreach($cashbackClientLevels as $cashbackClientLevel) {
//                $cashbackClientLevel->setIsCurrent(false);
//            }
//        }
//
//        $this->entityManager->flush();

        $cashbackLevels = array_column(
            $this->cashbackLevelRepository->getAllCashbackLevelsByLevel($cashbackLevel->getLevel()),
            'id'
        );
        $this->cashbackClientLevelRepository->updateLevelForALlClients($cashbackLevel->getId(), $cashbackLevels);

        $clients = $this->clientRepository->findAll();

        if ($clients) {
           $this->cashbackClientLevelRepository->createCashbackLevelForAllClients($cashbackLevel, $clients, false);
        }

        $this->cashbackLevelRepository->deactivateAllNotUsedCashbackLevels(
            array_column(
                $this->cashbackClientLevelRepository->getAllCurrentCashbackClientLevelsId(),
                'id'
            )
        );

        $this->cashbackLevelRepository->activateAllUsedCashbackLevels(
            array_column(
                $this->cashbackClientLevelRepository->getAllCurrentCashbackClientLevelsId(),
                'id'
            )
        );

        return $cashbackLevel;
    }
}

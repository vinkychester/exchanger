<?php


namespace App\Resolver\CashbackLevel;

use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\CashbackLevel;
use App\Repository\CashbackClientLevelRepository;
use App\Repository\CashbackLevelRepository;
use App\Service\CashbackSystem\CashbackSystemService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

/**
 * Class UpdateForAllVipClientsMutationResolver
 * @package App\Resolver\CashbackLevel
 */
class UpdateForAllVipClientsMutationResolver implements MutationResolverInterface
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
     * @var CashbackLevelRepository
     */
    protected CashbackLevelRepository $cashbackLevelRepository;
    /**
     * @var CashbackClientLevelRepository
     */
    protected CashbackClientLevelRepository $cashbackClientLevelRepository;

    /**
     * UpdateForAllVipClientsMutationResolver constructor.
     * @param EntityManagerInterface $entityManager
     * @param CashbackSystemService $cashbackSystemService
     * @param CashbackLevelRepository $cashbackLevelRepository
     * @param CashbackClientLevelRepository $cashbackClientLevelRepository
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        CashbackSystemService $cashbackSystemService,
        CashbackLevelRepository $cashbackLevelRepository,
        CashbackClientLevelRepository $cashbackClientLevelRepository
    ) {
        $this->entityManager = $entityManager;
        $this->cashbackSystemService = $cashbackSystemService;
        $this->cashbackLevelRepository = $cashbackLevelRepository;
        $this->cashbackClientLevelRepository = $cashbackClientLevelRepository;
    }

    /**
     * @param object|null $item
     * @param array $context
     * @return object|void|null
     * @throws \Doctrine\DBAL\Driver\Exception
     * @throws \Doctrine\DBAL\Exception
     */
    public function __invoke($item, array $context)
    {
        $args = $context['args']['input'];
        $cashbackLevelID = $args['cashbackLevelID'];

        $cashbackLevel = $this->entityManager->getRepository(CashbackLevel::class)->find($cashbackLevelID);
        if (!$cashbackLevel) {
            throw new ResourceNotFoundException('No such cashback level');
        }

        $updateLevelForAllVipLevelsSQL = $this->cashbackSystemService->updateLevelForAllSelectedClientsLevelsSQL(
            $this->cashbackSystemService->getClientVipLevelsSQL($cashbackLevel->getLevel()),
            $cashbackLevel->getId()
        );

        $conn = $this->entityManager->getConnection();
        $stmt = $conn->prepare($updateLevelForAllVipLevelsSQL);
        $stmt->execute();

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

        return null;
    }
}

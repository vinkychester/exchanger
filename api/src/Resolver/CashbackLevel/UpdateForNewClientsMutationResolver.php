<?php


namespace App\Resolver\CashbackLevel;

use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Repository\CashbackClientLevelRepository;
use App\Repository\CashbackLevelRepository;
use App\Service\CashbackSystem\CashbackSystemService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

/**
 * Class UpdateForNewClientsMutationResolver
 * @package App\Resolver\CashbackLevel
 */
class UpdateForNewClientsMutationResolver implements MutationResolverInterface
{
    /**
     * @var CashbackLevelRepository
     */
    protected CashbackLevelRepository $cashbackLevelRepository;
    /**
     * @var CashbackSystemService
     */
    protected CashbackSystemService $cashbackSystemService;
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var CashbackClientLevelRepository
     */
    protected CashbackClientLevelRepository $cashbackClientLevelRepository;

    /**
     * UpdateForNewClientsMutationResolver constructor.
     * @param EntityManagerInterface $entityManager
     * @param CashbackSystemService $cashbackSystemService
     * @param CashbackClientLevelRepository $cashbackClientLevelRepository
     * @param CashbackLevelRepository $cashbackLevelRepository
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        CashbackSystemService $cashbackSystemService,
        CashbackClientLevelRepository $cashbackClientLevelRepository,
        CashbackLevelRepository $cashbackLevelRepository
    ) {
        $this->cashbackLevelRepository = $cashbackLevelRepository;
        $this->cashbackSystemService = $cashbackSystemService;
        $this->entityManager = $entityManager;
        $this->cashbackClientLevelRepository = $cashbackClientLevelRepository;
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

        $cashbackLevel = $this->cashbackLevelRepository->find($cashbackLevelID);
        if (!$cashbackLevel) {
            throw new ResourceNotFoundException('No such cashback level');
        }

        $this->cashbackLevelRepository->updateDefaultLevelsToNotDefault($cashbackLevel->getLevel());

        $this->cashbackLevelRepository->setDefaultCashbackLevel($cashbackLevel->getId());

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

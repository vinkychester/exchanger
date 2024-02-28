<?php


namespace App\Resolver\CashbackLevel;


use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;
use App\Repository\CashbackClientLevelRepository;
use App\Repository\CashbackLevelRepository;
use App\Service\CashbackSystem\CashbackSystemService;
use Doctrine\ORM\EntityManagerInterface;

class CollectionWithActiveCheckingResolver implements QueryCollectionResolverInterface
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
     * @var CashbackLevelRepository
     */
    protected CashbackLevelRepository $cashbackLevelRepository;

    /**
     * CollectionWithActiveCheckingResolver constructor.
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
        $this->entityManager = $entityManager;
        $this->cashbackSystemService = $cashbackSystemService;
        $this->cashbackClientLevelRepository = $cashbackClientLevelRepository;
        $this->cashbackLevelRepository = $cashbackLevelRepository;
    }

    public function __invoke(iterable $collection, array $context): iterable
    {
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

        return $collection;
    }
}
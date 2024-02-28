<?php


namespace App\Resolver\ManagerPercentProfitHistory;


use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use App\Entity\ManagerPercentProfitHistory;
use App\Repository\ManagerPercentProfitHistoryRepository;

class GetLastBankPercentQueryResolver implements QueryItemResolverInterface
{
    /**
     * @var ManagerPercentProfitHistoryRepository
     */
    protected ManagerPercentProfitHistoryRepository $managerPercentProfitHistoryRepository;

    /**
     * GetLastBankPercentQueryResolver constructor.
     * @param ManagerPercentProfitHistoryRepository $managerPercentProfitHistoryRepository
     */
    public function __construct(ManagerPercentProfitHistoryRepository $managerPercentProfitHistoryRepository)
    {
        $this->managerPercentProfitHistoryRepository = $managerPercentProfitHistoryRepository;
    }

    public function __invoke($item, array $context)
    {
        $managerPercentProfitHistory = $this->managerPercentProfitHistoryRepository->findOneBy(
            ['percentName' => ManagerPercentProfitHistory::NAME_BANK],
            ['id' => 'DESC']
        );

        if(!$managerPercentProfitHistory) {
            return null;
        }

        return $managerPercentProfitHistory;
    }
}
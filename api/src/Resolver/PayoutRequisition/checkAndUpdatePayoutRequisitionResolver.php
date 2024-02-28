<?php


namespace App\Resolver\PayoutRequisition;

use ApiPlatform\Core\Exception\RuntimeException;
use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\Balance;
use App\Entity\PayoutRequisition;
use App\Repository\ClientBalanceRepository;
use App\Service\ClientBalance\ClientBalanceService;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Class checkAndUpdatePayoutRequisitionResolver
 * @package App\Resolver\PayoutRequisition
 */
class checkAndUpdatePayoutRequisitionResolver implements MutationResolverInterface
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var ClientBalanceRepository
     */
    protected ClientBalanceRepository $clientBalanceRepository;

    /**
     * checkAndUpdatePayoutRequisitionResolver constructor.
     * @param EntityManagerInterface $entityManager
     * @param ClientBalanceRepository $clientBalanceRepository
     */
    public function __construct(EntityManagerInterface $entityManager, ClientBalanceRepository $clientBalanceRepository)
    {
        $this->entityManager = $entityManager;
        $this->clientBalanceRepository = $clientBalanceRepository;
    }

    /**
     * @param PayoutRequisition|null $item
     * @param array $context
     * @return object|null
     */
    public function __invoke($item, array $context)
    {
        $input = $context['args']['input'];

//        if (PayoutRequisition::STATUS_FINISHED === $input['status']) {
//            {
//                $minPayout = $item->getClient()->getBalances()->filter(
//                    function ($balance) {
//                        return $balance->getField() === Balance::MIN_PAYOUT_FIELD;
//                    }
//                )->current()->getValue();
//
//                $balance = $item->getClient()->getBalances()->filter(
//                    function ($balance) {
//                        return $balance->getField() === Balance::BALANCE_FIELD;
//                    }
//                )->current()->getValue();
//
//                if ($item->getAmount() >= $minPayout
//                    && $item->getAmount() <= $balance
//                ) {
//                    $this->clientBalanceRepository->setClientBalance($item->getClient(), Balance::BALANCE_FIELD, $item->getAmount(), '-');
//                } else {
//                    throw new RuntimeException(
//                        'Клиентский балланс не позволяет провести выплату!
//                            Пожалуйста, проверьте балланс клиента. Текущий балланс: '
//                        . $balance
//                        . ', Минимальный балланс для вывода клиентом: ' . $minPayout
//                    );
//                }
//            }
//        }

        return $item;
    }
}

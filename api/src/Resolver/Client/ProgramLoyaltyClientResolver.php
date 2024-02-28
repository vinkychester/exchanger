<?php


namespace App\Resolver\Client;

use ApiPlatform\Core\Exception\ResourceClassNotFoundException;
use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use App\Entity\CashbackClientLevel;
use App\Entity\Client;
use App\Entity\Currency;
use App\Entity\Pair;
use App\Entity\ReferralClientLevel;
use App\Entity\RequisitionFeeHistory;
use App\Entity\RequisitionProfitHistory;
use App\Service\CashbackSystem\CashbackRecountBalancesService;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\PersistentCollection;

/**
 * Class ClientWithAllGenerationsItemResolver
 * @package App\Resolver\Client
 */
class ProgramLoyaltyClientResolver implements QueryItemResolverInterface
{
    /**
     * @var CashbackRecountBalancesService
     */
    protected CashbackRecountBalancesService $cashbackRecountBalancesService;
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    /**
     * ClientWithRelationsItemResolver constructor.
     * @param EntityManagerInterface $entityManager
     * @param CashbackRecountBalancesService $cashbackRecountBalancesService
     */
    public function __construct(EntityManagerInterface $entityManager, CashbackRecountBalancesService $cashbackRecountBalancesService)
    {
        $this->entityManager = $entityManager;
        $this->cashbackRecountBalancesService = $cashbackRecountBalancesService;
    }

    /**
     * @param Client|null $item
     * @param array $context
     * @return Client|object|null
     * @throws ResourceClassNotFoundException
     */
    public function __invoke($item, array $context)
    {
        $args = $context['args'];
        $userID = $args['userID'];

        $clientRepository = $this->entityManager->getRepository(Client::class);

        /** @var Client $client */
        $client = $clientRepository->find($userID);
        if (!$client) {
            throw new ResourceClassNotFoundException('Client not found');
        }

        $client->setNextCashbackLevel($this->cashbackRecountBalancesService->getNextCashbackLevel($client));

        return $client;
    }
}

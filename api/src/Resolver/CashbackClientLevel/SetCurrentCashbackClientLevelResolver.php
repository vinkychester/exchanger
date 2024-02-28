<?php


namespace App\Resolver\CashbackClientLevel;

use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\Client;
use App\Entity\CashbackClientLevel;
use App\Entity\CashbackLevel;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

/**
 * Class CreateLevelResolver
 * @package App\Resolver\CashbackClientLevel
 */
class SetCurrentCashbackClientLevelResolver implements MutationResolverInterface
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * CreateLevelResolver constructor.
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @param object|null $item
     * @param array $context
     * @return object|void|null
     */
    public function __invoke($item, array $context)
    {
        $args = $context['args']['input'];
        $cashbackClientLevelID = $args['cashbackClientLevelID'];

        $cashbackClientLevelRepository = $this->entityManager->getRepository(CashbackClientLevel::class);

        /** @var CashbackClientLevel $cashbackClientLevel */
        $cashbackClientLevel = $cashbackClientLevelRepository->find($cashbackClientLevelID);
        if (!$cashbackClientLevel) {
            throw new ResourceNotFoundException('Cashback client level not found.');
        }

        $cashbackClientLevelRepository->setActiveCashbackClientLevel(
            $cashbackClientLevel
        );
        return null;
    }
}

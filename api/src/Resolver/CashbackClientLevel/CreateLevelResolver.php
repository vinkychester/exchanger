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
class CreateLevelResolver implements MutationResolverInterface
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
        $cashbackLevelID = $args['cashbackLevelID'];
        $clientID = $args['clientID'];

        $clientRepository = $this->entityManager->getRepository(Client::class);
        $cashbackLevelRepository = $this->entityManager->getRepository(CashbackLevel::class);
        $cashbackClientLevelRepository = $this->entityManager->getRepository(CashbackClientLevel::class);

        $client = $clientRepository->getClientByUUID($clientID);
        if (!$client) {
            throw new ResourceNotFoundException('Client not found.');
        }

        /** @var CashbackLevel $cashbackLevel */
        $cashbackLevel = $cashbackLevelRepository->find($cashbackLevelID);
        if (!$cashbackLevel) {
            throw new ResourceNotFoundException('Cashback level not found.');
        }

        $newCashbackLevel = $cashbackClientLevelRepository->createCashbackClientLevelIfNotExist($client, $cashbackLevel);
        if(!$newCashbackLevel) {
            throw new ResourceNotFoundException('Такой кешбэк уровень для пользователя уже существует');
        }
        return null;
    }
}

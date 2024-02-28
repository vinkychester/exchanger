<?php


namespace App\Resolver\CashbackClientLevel;

use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\CashbackClientLevel;
use App\Entity\CashbackLevel;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

/**
 * Class UpdateForAllClientsMutationResolver
 * @package App\Resolver\ReferralLevel
 */
class CreateVipLevelResolver implements MutationResolverInterface
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * UpdateForAllClientsMutationResolver constructor.
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
        $cashbackLevelID = $args['cashbackLevelID'];

        $cashbackClientLevelRepository = $this->entityManager->getRepository(CashbackClientLevel::class);
        $cashbackLevelRepository = $this->entityManager->getRepository(CashbackLevel::class);

        /** @var CashbackClientLevel $currentCashbackClientLevel */
        $currentCashbackClientLevel = $cashbackClientLevelRepository->find($cashbackClientLevelID);
        if (!$currentCashbackClientLevel) {
            throw new ResourceNotFoundException('No such cashback client level');
        }

        /** @var CashbackLevel $cashbackLevel */
        $cashbackLevel = $cashbackLevelRepository->find($cashbackLevelID);
        if (!$cashbackLevel) {
            throw new ResourceNotFoundException('No such cashback level');
        }

        if ($currentCashbackClientLevel->getCashbackLevel() === $cashbackLevel) {
            return null;
        }

        $currentCashbackClientLevel->setIsCurrent(false);

        /** @var CashbackClientLevel $existCashbackClientLevel */
        $existCashbackClientLevel = $cashbackClientLevelRepository->findOneBy(
            [
                'client' => $currentCashbackClientLevel->getClient(),
                'cashbackLevel' => $cashbackLevel->getId()
            ]
        );

        if(!$existCashbackClientLevel) {
            $cashbackClientLevelRepository->createCashbackClientLevelIfNotExist(
                $currentCashbackClientLevel->getClient(),
                $cashbackLevel
            );
        } else {
            $cashbackLevel->setIsActive(true);
            $existCashbackClientLevel->setIsCurrent(true);
            $this->entityManager->persist($cashbackLevel);
            $this->entityManager->persist($existCashbackClientLevel);
        }

        $this->entityManager->persist($currentCashbackClientLevel);
        $this->entityManager->flush();

        return null;
    }
}

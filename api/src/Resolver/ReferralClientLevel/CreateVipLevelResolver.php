<?php


namespace App\Resolver\ReferralClientLevel;

use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\ReferralClientLevel;
use App\Entity\ReferralLevel;
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
        $referralClientLevelID = $args['referralClientLevelID'];
        $referralLevelID = $args['referralLevelID'];

        $referralClientLevelRepository = $this->entityManager->getRepository(ReferralClientLevel::class);
        $referralLevelRepository = $this->entityManager->getRepository(ReferralLevel::class);

        /** @var ReferralClientLevel $currentReferralClientLevel */
        $currentReferralClientLevel = $referralClientLevelRepository->find($referralClientLevelID);
        if (!$currentReferralClientLevel) {
            throw new ResourceNotFoundException('No such referral client level');
        }

        /** @var ReferralLevel $referralLevel */
        $referralLevel = $referralLevelRepository->find($referralLevelID);
        if (!$referralLevel) {
            throw new ResourceNotFoundException('No such referral level');
        }

        if ($currentReferralClientLevel->getReferralLevel() === $referralLevel) {
            return null;
        }

        $currentReferralClientLevel->setIsCurrent(false);

        /** @var ReferralClientLevel $existReferralClientLevel */
        $existReferralClientLevel = $referralClientLevelRepository->findOneBy(
            [
                'client'        => $currentReferralClientLevel->getClient(),
                'referralLevel' => $referralLevel->getId()
            ]
        );

        if (!$existReferralClientLevel) {
            $referralClientLevelRepository->createReferralClientLevel(
                $currentReferralClientLevel->getClient(),
                $referralLevel
            );
        } else {
            $referralLevel->setIsActive(true);
            $existReferralClientLevel->setIsCurrent(true);
            $this->entityManager->persist($referralLevel);
            $this->entityManager->persist($existReferralClientLevel);
        }

        $this->entityManager->persist($currentReferralClientLevel);
        $this->entityManager->flush();

        return null;
    }
}

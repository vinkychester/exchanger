<?php


namespace App\Resolver\ReferralClientLevel;

use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\Client;
use App\Entity\ReferralClientLevel;
use App\Entity\ReferralLevel;
use App\Repository\ReferralClientLevelRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

/**
 * Class UpdateForAllClientsMutationResolver
 * @package App\Resolver\ReferralLevel
 */
class CreateLevelResolver implements MutationResolverInterface
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * @var ReferralClientLevelRepository
     */
    protected ReferralClientLevelRepository $referralClientLevelRepository;

    /**
     * UpdateForAllClientsMutationResolver constructor.
     * @param EntityManagerInterface $entityManager
     * @param ReferralClientLevelRepository $referralClientLevelRepository
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        ReferralClientLevelRepository $referralClientLevelRepository
    ) {
        $this->entityManager = $entityManager;
        $this->referralClientLevelRepository = $referralClientLevelRepository;
    }

    /**
     * @param object|null $item
     * @param array $context
     * @return object|void|null
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function __invoke($item, array $context)
    {
        $args = $context['args']['input'];
        $referralLevelID = $args['referralLevelID'];
        $clientID = $args['clientID'];

        $clientRepository = $this->entityManager->getRepository(Client::class);
        $referralLevelRepository = $this->entityManager->getRepository(ReferralLevel::class);
        $referralClientLevelRepository = $this->entityManager->getRepository(ReferralClientLevel::class);

        $client = $clientRepository->getClientByUUID($clientID);
        if (!$client) {
            throw new ResourceNotFoundException('Client not found.');
        }

        $referralLevel = $referralLevelRepository->find($referralLevelID);
        if (!$referralLevel) {
            throw new ResourceNotFoundException('Referral level not found.');
        }

        $clientReferralLevelByLevelReferralLevel = $this->referralClientLevelRepository->getClientReferralLevelByLevelReferralLevel(
            $client->getId(),
            $referralLevel->getLevel()
        );

        if (!$clientReferralLevelByLevelReferralLevel) {
            $clientReferralLevelByLevelReferralLevel = $referralClientLevelRepository->createReferralClientLevel($client, $referralLevel);
        }

        $clientReferralLevelByLevelReferralLevel->setReferralLevel($referralLevel);
        $clientReferralLevelByLevelReferralLevel->setIsCurrent(true);
        $this->entityManager->persist($clientReferralLevelByLevelReferralLevel);
        $this->entityManager->flush();

        return null;
    }
}

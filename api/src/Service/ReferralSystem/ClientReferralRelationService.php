<?php


namespace App\Service\ReferralSystem;

use App\Entity\Client;
use App\Entity\ReferralUserRelation;
use App\Repository\ReferralUserRelationRepository;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Class ClientRelation
 * @package App\Service\ReferralSystem
 */
class ClientReferralRelationService
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var ReferralUserRelationRepository
     */
    protected ReferralUserRelationRepository $referralUserRelationRepository;

    /**
     * ClientReferralRelationService constructor.
     * @param EntityManagerInterface $entityManager
     * @param ReferralUserRelationRepository $referralUserRelationRepository
     */
    public function __construct(EntityManagerInterface $entityManager, ReferralUserRelationRepository $referralUserRelationRepository) {
        $this->entityManager = $entityManager;
        $this->referralUserRelationRepository = $referralUserRelationRepository;
    }

    /**
     * @param $refToken
     * @param $invitedClient
     * @return null
     */
    public function createReferralRelationByClientToken($refToken, $invitedClient) {
        /** @var Client $client */
        $client = $this->entityManager->getRepository(Client::class)->findOneBy(
            ['referralToken' => $refToken]
        );

        if (!$client) {
            return false;
        }

        $invitedClientExists = $client->getReferralUserRelations()->exists(
            function ($key, $element) use ($invitedClient) {
                return $element->getInvitedUser() === $invitedClient;
            }
        );

        if (!$invitedClientExists) {
            return $this->referralUserRelationRepository->createReferralRelation($client, $invitedClient);
        }
    }
}
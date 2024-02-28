<?php


namespace App\Service\ReferralSystem;


use App\Entity\Client;
use App\Entity\ReferralClientLevel;
use App\Entity\ReferralLevel;
use App\Repository\ClientRepository;
use App\Repository\ReferralUserRelationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

class ClientReferralParentsService
{
    /**
     * @var Client
     */
    protected Client $client;
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var ClientRepository
     */
    protected ClientRepository $clientRepository;
    /**
     * @var ReferralUserRelationRepository
     */
    protected ReferralUserRelationRepository $referralUserRelationRepository;

    /**
     * ClientReferralParentsService constructor.
     * @param EntityManagerInterface $entityManager
     * @param ClientRepository $clientRepository
     * @param ReferralUserRelationRepository $referralUserRelationRepository
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        ClientRepository $clientRepository,
        ReferralUserRelationRepository $referralUserRelationRepository
    )
    {
        $this->entityManager = $entityManager;
        $this->clientRepository = $clientRepository;
        $this->referralUserRelationRepository = $referralUserRelationRepository;
    }

    /**
     * Displaying how should build referral ancestors relations for client
     * Array of arrays [clientId, invitedUserId, level]
     *
     * @param Client $client
     * @param int $maxReferralLevel
     * @param int $referralLevelCounter
     * @param array $storage
     * @return array|mixed
     */
    public function getReferralAncestorsRelations(Client $client, $maxReferralLevel = 0, $referralLevelCounter = 1, $storage = [])
    {
        if (!$maxReferralLevel) {
            $maxReferralLevel = (int)$this->entityManager->getRepository(ReferralLevel::class)->getBiggestDefaultLevel();
            if (!$maxReferralLevel) {
                return $storage;
            }
        }

        if ($referralLevelCounter < 0 || $referralLevelCounter > $maxReferralLevel) {
            $referralLevelCounter = 1;
        }

        $inviterRelation = $this->referralUserRelationRepository->findOneBy([
            'invitedUser' => $client->getId(),
            'level' => 1
        ]);

        if (!$inviterRelation) {
            return $storage;
        }

        //For displaying first user in storage
        if (count($storage)) {
            $firstClient = $storage[0][1];
        } else {
            $firstClient = $client->getId();
        }

        array_push($storage, [$inviterRelation->getClient()->getId(), $firstClient, $referralLevelCounter]);

        if ($referralLevelCounter === $maxReferralLevel) {
            return $storage;
        }

        return self::getReferralAncestorsRelations($inviterRelation->getClient(), $maxReferralLevel, $referralLevelCounter + 1, $storage);
    }

    /**
     *
     * $referralAncestorsRelation[0] = client.id
     * $referralAncestorsRelation[1] = invitedUser.id
     * $referralAncestorsRelation[2] = level
     *
     * @param Client $client
     */
    public function createReferralRelationForAncestors(Client $client)
    {
        $referralAncestorsRelations = $this->getReferralAncestorsRelations($client);

        if (!count($referralAncestorsRelations)) {
            return;
        }

        foreach ($referralAncestorsRelations as $referralAncestorsRelation) {
            $relation = $this->referralUserRelationRepository->findOneBy(
                [
                    'client' => $referralAncestorsRelation[0],
                    'invitedUser' => $referralAncestorsRelation[1]
                ]
            );

            if (!$relation) {
                $client = $this->clientRepository->find($referralAncestorsRelation[0]);
                $invitedUser = $this->clientRepository->find($referralAncestorsRelation[1]);
                $this->referralUserRelationRepository->createReferralRelation(
                    $client,
                    $invitedUser,
                    $referralAncestorsRelation[2]
                );
            }
        }
    }

    /**
     *
     * $referralAncestorsRelation[0] = client.id
     * $referralAncestorsRelation[1] = invitedUser.id
     * $referralAncestorsRelation[2] = level
     *
     * @param Client $client
     */
    public function createReferralClientLevelForAncestors(Client $client)
    {
        $referralAncestorsRelations = $this->getReferralAncestorsRelations($client);

        if (!count($referralAncestorsRelations)) {
            return;
        }

        foreach ($referralAncestorsRelations as $referralAncestorsRelation) {
            $clientReferralLevelByLevelReferralLevel = $this->entityManager->getRepository(ReferralClientLevel::class)
                ->getClientReferralLevelByLevelReferralLevel(
                    $referralAncestorsRelation[0],
                    $referralAncestorsRelation[2]
                );

            if (!$clientReferralLevelByLevelReferralLevel) {
                $defaultReferralLevel = $this->entityManager->getRepository(ReferralLevel::class)
                    ->getDefaultReferralLevelsByLevel($referralAncestorsRelation[2]);

                if ($defaultReferralLevel) {
                    $ancestorClient = $this->clientRepository->find($referralAncestorsRelation[0]);
                    $this->entityManager->getRepository(ReferralClientLevel::class)->createReferralClientLevel($ancestorClient, $defaultReferralLevel, 0, true);
                }
            } else {
                $clientReferralLevelByLevelReferralLevel->setIsCurrent(true);
                $this->entityManager->flush();
            }
        }
    }
}
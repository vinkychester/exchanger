<?php


namespace App\Service\ReferralSystem;

use App\Entity\Client;
use App\Entity\ReferralClientLevel;
use App\Entity\ReferralLevel;
use App\Entity\ReferralUserRelation;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Class ClientRelation
 * @package App\Service\ReferralSystem
 */
class ClientReferralLevelService
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * ClientReferralRelationService constructor.
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function updateReferralClientLevel($client, $referralLevel)
    {
        /** @var ReferralClientLevel $existedReferralClientLevel */
        $referralClientLevel = $this->entityManager->createQueryBuilder()
            ->select('referralClientLevel')
            ->from(ReferralClientLevel::class, 'referralClientLevel')
            ->innerJoin(
                'referralClientLevel.referralLevel',
                'referralLevel',
                'WITH',
                'referralClientLevel.referralLevel = referralLevel.id'
            )
            ->where('referralLevel.level =' . $referralLevel->getLevel())
            ->andWhere('referralClientLevel.client = :client')
            ->setParameter('client', $client)
            ->getQuery()
            ->getOneOrNullResult();

        if (!$referralClientLevel) {
            return false;
//            $referralClientLevel->setReferralLevel($referralLevel);
//            $this->entityManager->persist($referralClientLevel);
//            $this->entityManager->flush();
        }
//        else {
//            return false;
//        }
        return true;
    }

    public function changeClientLevelForUserParents($client)
    {
        $biggestDefaultLevel = $this->entityManager->getRepository(ReferralLevel::class)
            ->getBiggestDefaultLevel();
        if (!$biggestDefaultLevel) {
            return null;
        }

        return $this->updateClientLevelForUserParents($client, 0, $biggestDefaultLevel);
    }

    /**
     * @param $refToken
     * @return null
     */
    public function updateUserReferralClientLevel($refToken)
    {
        /** @var Client $referralTokenOwner */
        $referralTokenOwner = $this->entityManager->getRepository(Client::class)->findOneBy(
            [
                'referralToken' => $refToken
            ]
        );
        if (!$referralTokenOwner) {
            return null;
        }


//        /** @var ReferralLevel $defaultFirstReferralLevel */
//        $defaultFirstReferralLevel = $this->entityManager->getRepository(ReferralLevel::class)->findOneBy(
//            [
//                'isDefault' => true,
//                'isActive'  => true,
//                'level'     => 1
//            ]
//        );
//        if (!$defaultFirstReferralLevel) {
//            throw new ResourceClassNotFoundException("Default loyalty-program level not found!");
//        }
//        /** @var ReferralLevel[] $defaultReferralLevels */
//        $defaultReferralLevels = $this->entityManager->getRepository(ReferralLevel::class)->findBy(
//            [
//                'isDefault' => true,
//                'isActive'  => true
//            ]
//        );
//        foreach ($defaultReferralLevels as $defaultReferralLevel){
//            $this->entityManager->getRepository(ReferralClientLevel::class)
//                ->createReferralClientLevelIfNotExist($referralTokenOwner, $defaultReferralLevel, 0);
//
//        }
//        $query = $this->entityManager->createQuery(
//            "
//            SELECT referralClientLevel.id
//            FROM App\Entity\ReferralClientLevel referralClientLevel
//            INNER JOIN \App\Entity\ReferralLevel referralLevel WITH referralClientLevel.referralLevel = referralLevel.id
//            WHERE referralLevel.level = 1
//            AND referralClientLevel.isCurrent = 1
//            AND referralClientLevel.client = '" . $referralTokenOwner->getId() . "'"
//        );
//        $currentSameReferralClientLevel = $query->getResult();
//        if ($currentSameReferralClientLevel) {
//            return null;
//        }
//
//        $referralClientLevel = new ReferralClientLevel();
//        $referralClientLevel->setClient($referralTokenOwner);
//        $referralClientLevel->setReferralLevel($defaultFirstReferralLevel);
//        $referralClientLevel->setIsCurrent(true);

//        $this->entityManager->persist($referralClientLevel);
//        $this->entityManager->flush();
    }

    private function updateClientLevelForUserParents($client, $inviteLevelCounter, $biggestDefaultLevel)
    {
        $clientReferralRelationRecord = $this->entityManager->getRepository(ReferralUserRelation::class)->findOneBy(
            [
                'invitedUser' => $client->getId()
            ]
        );
        $inviteLevelCounter++;

        if ($clientReferralRelationRecord) {
            if ($inviteLevelCounter <= $biggestDefaultLevel) {
                $existDefaultReferralLevel = $this->entityManager->getRepository(ReferralLevel::class)->findOneBy(
                    [
                        'isDefault' => true,
                        'isActive'  => true,
                        'level'     => $inviteLevelCounter
                    ]
                );

                if ($existDefaultReferralLevel) {
                    $existReferralClientLevel = $this->entityManager->getRepository(
                        ReferralClientLevel::class
                    )->findOneBy(
                        [
                            'client'        => $clientReferralRelationRecord->getClient(),
                            'referralLevel' => $existDefaultReferralLevel
                        ]
                    );

                    if (!$existReferralClientLevel) {
                        $updatedReferralLevel = $this->updateReferralClientLevel(
                            $clientReferralRelationRecord->getClient(),
                            $existDefaultReferralLevel
                        );

                        if(!$updatedReferralLevel) {
                            $this->entityManager->getRepository(ReferralClientLevel::class)->createReferralClientLevel(
                                $clientReferralRelationRecord->getClient(),
                                $existDefaultReferralLevel
                            );
                        }
                    }

                    return $this->updateClientLevelForUserParents(
                        $clientReferralRelationRecord->getInvitedUser(),
                        $inviteLevelCounter,
                        $biggestDefaultLevel
                    );
                }
            }
        }

        return null;
    }

}
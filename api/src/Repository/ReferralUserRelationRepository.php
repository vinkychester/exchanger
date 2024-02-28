<?php

namespace App\Repository;

use App\Entity\Client;
use App\Entity\ReferralUserRelation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ReferralUserRelation|null find($id, $lockMode = null, $lockVersion = null)
 * @method ReferralUserRelation|null findOneBy(array $criteria, array $orderBy = null)
 * @method ReferralUserRelation[]    findAll()
 * @method ReferralUserRelation[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ReferralUserRelationRepository extends ServiceEntityRepository
{
    /**
     * ReferralUserRelationRepository constructor.
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ReferralUserRelation::class);
    }

    /**
     * @param $client
     * @return ReferralUserRelation|bool
     */
    public function isInvitedClient($client)
    {
        $invitedClientRecord = $this->findOneBy(
            [
                'invitedUser' => $client
            ]
        );

        if (!$invitedClientRecord) {
            return false;
        }

        return $invitedClientRecord;
    }


    /**
     * @param Client $client
     * @param Client $invitedClient
     * @param int $level
     * @return ReferralUserRelation
     */
    public function createReferralRelation(Client $client, Client $invitedClient, int $level = 1): ReferralUserRelation
    {
        $referralRelation = new ReferralUserRelation();

        $referralRelation->setClient($client);
        $referralRelation->setInvitedUser($invitedClient);
        $referralRelation->setLevel($level);

        $this->_em->persist($referralRelation);
        $this->_em->flush();

        return $referralRelation;
    }
}

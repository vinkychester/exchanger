<?php


namespace App\Resolver\ReferralClientLevel;

use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Repository\ClientRepository;
use App\Repository\ReferralClientLevelRepository;
use App\Repository\ReferralLevelRepository;
use App\Repository\ReferralUserRelationRepository;

/**
 * Create ReferralClientLevel record by user token.
 * @package App\Resolver
 */
class UpdateUserParentsLevelMutationResolver implements MutationResolverInterface
{
    /**
     * @var ReferralClientLevelRepository
     */
    protected ReferralClientLevelRepository $referralClientLevelRepository;
    /**
     * @var ReferralLevelRepository
     */
    protected ReferralLevelRepository $referralLevelRepository;
    /**
     * @var ReferralUserRelationRepository
     */
    protected ReferralUserRelationRepository $referralUserRelationRepository;
    /**
     * @var ClientRepository
     */
    protected ClientRepository $clientRepository;

    /**
     * UpdateUserParentsLevelMutationResolver constructor.
     * @param ReferralClientLevelRepository $referralClientLevelRepository
     * @param ReferralLevelRepository $referralLevelRepository
     * @param ReferralUserRelationRepository $referralUserRelationRepository
     * @param ClientRepository $clientRepository
     */
    public function __construct(
        ReferralClientLevelRepository $referralClientLevelRepository,
        ReferralLevelRepository $referralLevelRepository,
        ReferralUserRelationRepository $referralUserRelationRepository,
        ClientRepository $clientRepository
    ) {
        $this->referralClientLevelRepository = $referralClientLevelRepository;
        $this->referralLevelRepository = $referralLevelRepository;
        $this->referralUserRelationRepository = $referralUserRelationRepository;
        $this->clientRepository = $clientRepository;
    }

    /**
     * @param $client
     * @param $inviteLevelCounter
     * @param $biggestDefaultLevel
     * @return null |null
     */
    public function updateClientLevelForUserParents($client, $inviteLevelCounter, $biggestDefaultLevel)
    {
        $clientReferralRelationRecord = $this->referralUserRelationRepository->findOneBy(
            [
                'invitedUser' => $client->getId()
            ]
        );
        $inviteLevelCounter++;

        if ($clientReferralRelationRecord && $inviteLevelCounter <= $biggestDefaultLevel) {
            $existDefaultReferralLevel = $this->referralLevelRepository->findOneBy(
                [
                    'isDefault' => true,
                    'isActive'  => true,
                    'level'     => $inviteLevelCounter
                ]
            );

            if ($existDefaultReferralLevel) {
                $existReferralClientLevel = $this->referralClientLevelRepository->findOneBy(
                    [
                        'client'        => $clientReferralRelationRecord->getClient(),
                        'referralLevel' => $existDefaultReferralLevel
                    ]
                );

                if (!$existReferralClientLevel) {
                    $this->referralClientLevelRepository->createReferralClientLevel(
                        $clientReferralRelationRecord->getClient(),
                        $existDefaultReferralLevel
                    );
                }

                return $this->updateClientLevelForUserParents(
                    $clientReferralRelationRecord->getInvitedUser(),
                    $inviteLevelCounter,
                    $biggestDefaultLevel
                );
            }
        }

        return null;
    }

    /**
     * @param object|null $item
     * @param array $context
     * @return object|null
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function __invoke($item, array $context)
    {
        $args = $context['args']['input'];
        $userID = $args['userID'];

        $client = $this->clientRepository->getClientByUUID($userID);

        $biggestDefaultLevel = $this->referralLevelRepository->getBiggestDefaultLevel();

        if (!$biggestDefaultLevel) {
            return null;
        }

        return $this->updateClientLevelForUserParents($client, 0, $biggestDefaultLevel);
    }
}

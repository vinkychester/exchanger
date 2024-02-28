<?php


namespace App\EntityListener;

use App\Entity\Client;
use App\Entity\ReferralUserRelation;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Component\Security\Core\Security;
use App\Service\ReferralSystem\ClientReferralLevelService;

/**
 * Class ReferralUserRelationEntityListener
 * @package App\EntityListener
 */
class ReferralUserRelationEntityListener
{
    /**
     * @var LogServiceODM
     */
    protected LogServiceODM $LogServiceODM;
    /**
     * @var Security
     */
    protected Security $security;
    /**
     * @var ClientReferralLevelService
     */
    protected ClientReferralLevelService $clientReferralLevel;

    /**
     * UserImageEntityListener constructor.
     * @param LogServiceODM $LogServiceODM
     * @param Security $security
     * @param ClientReferralLevelService $clientReferralLevel
     */
    public function __construct(
        LogServiceODM $LogServiceODM,
        Security $security,
        ClientReferralLevelService $clientReferralLevel
    ) {
        $this->LogServiceODM = $LogServiceODM;
        $this->security = $security;
        $this->clientReferralLevel = $clientReferralLevel;
    }

    /**
     * @param ReferralUserRelation $referralUserRelation
     * @param LifecycleEventArgs $eventArgs
     * @throws \ApiPlatform\Core\Exception\ResourceClassNotFoundException
     */
    public function postPersist(ReferralUserRelation $referralUserRelation, LifecycleEventArgs $eventArgs): void
    {
        $message = 'Пользователь "' . $referralUserRelation->getClient()->getEmail()
            . '" пригласил пользователя ' . $referralUserRelation->getInvitedUser()->getEmail();

        $this->LogServiceODM->info(
            $message,
            $this->security->getUser()
        );

        $referralUserRelation->getInvitedUser()->setRegistrationType(Client::REGISTRATION_REFERRAL);

//        $this->clientReferralLevel->updateUserReferralClientLevel(
//            $referralUserRelation->getClient()->getReferralToken()
//        );


        $this->clientReferralLevel->changeClientLevelForUserParents($referralUserRelation->getInvitedUser());
    }

    /**
     * preRemove
     * postRemove
     * prePersist
     * postPersist
     * preUpdate
     * postUpdate
     * postLoad
     * preFlush
     * onFlush
     * postFlush
     */
}

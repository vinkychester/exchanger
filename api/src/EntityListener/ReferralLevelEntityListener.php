<?php


namespace App\EntityListener;

use App\Entity\ReferralLevel;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Component\Security\Core\Security;

/**
 * Class ReferralLevelEntityListener
 * @package App\EntityListener
 */
class ReferralLevelEntityListener
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
     * UserImageEntityListener constructor.
     * @param LogServiceODM $LogServiceODM
     * @param Security $security
     */
    public function __construct(LogServiceODM $LogServiceODM, Security $security)
    {
        $this->LogServiceODM = $LogServiceODM;
        $this->security = $security;
    }

    /**
     * @param ReferralLevel $referralLevel
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postPersist(ReferralLevel $referralLevel, LifecycleEventArgs $eventArgs)
    {
        $this->LogServiceODM->info(
            'Администратор создал уровень лояльности ' . $referralLevel->getId() . $referralLevel->getName(),
            $this->security->getUser()
        );
    }

    /**
     * @param ReferralLevel $referralLevel
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postUpdate(ReferralLevel $referralLevel, LifecycleEventArgs $eventArgs)
    {
        $changeSets = $eventArgs->getEntityManager()->getUnitOfWork()->getEntityChangeSet($referralLevel);

        $message = 'Администратор изменил уровень лояльности "' . $referralLevel->getId() .
            $referralLevel->getName() . '" и изменил ' .
            implode(', ', array_keys($changeSets));

        $this->LogServiceODM->info(
            $message,
            $this->security->getUser()
        );
    }

    /**
     * @param ReferralLevel $referralLevel
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function preRemove(ReferralLevel $referralLevel, LifecycleEventArgs $eventArgs)
    {
        $this->LogServiceODM->info(
            'Администратор удалил уровень лояльности ' . $referralLevel->getId() . $referralLevel->getName(),
            $this->security->getUser()
        );
    }
}

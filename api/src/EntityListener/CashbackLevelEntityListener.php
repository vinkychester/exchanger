<?php


namespace App\EntityListener;

use App\Entity\CashbackLevel;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Component\Security\Core\Security;

/**
 * Class CashbackLevelEntityListener
 * @package App\EntityListener
 */
class CashbackLevelEntityListener
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
     * @param CashbackLevel $cashbackLevel
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postPersist(CashbackLevel $cashbackLevel, LifecycleEventArgs $eventArgs)
    {
        $this->LogServiceODM->info(
            'Администратор создал кешбэк уровень ' . $cashbackLevel->getId() . $cashbackLevel->getName(),
            $this->security->getUser()
        );
    }

    /**
     * @param CashbackLevel $cashbackLevel
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postUpdate(CashbackLevel $cashbackLevel, LifecycleEventArgs $eventArgs)
    {
        $changeSets = $eventArgs->getEntityManager()->getUnitOfWork()->getEntityChangeSet($cashbackLevel);

        $message = 'Администратор изменил кешбэк уровень "' . $cashbackLevel->getId() .
            $cashbackLevel->getName() . '" и изменил ' .
            implode(', ', array_keys($changeSets));

        $this->LogServiceODM->info(
            $message,
            $this->security->getUser()
        );
    }

    /**
     * @param CashbackLevel $cashbackLevel
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postRemove(CashbackLevel $cashbackLevel, LifecycleEventArgs $eventArgs)
    {
        $this->LogServiceODM->info(
            'Администратор удалил кешбэк уровень ' . $cashbackLevel->getId() . $cashbackLevel->getName(),
            $this->security->getUser()
        );
    }
}

<?php


namespace App\EntityListener;

use App\Entity\CashbackClientLevel;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Component\Security\Core\Security;

/**
 * Class CashbackClientLevelEntityListener
 * @package App\EntityListener
 */
class CashbackClientLevelEntityListener
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
    public function __construct(
        LogServiceODM $LogServiceODM,
        Security $security
    ) {
        $this->LogServiceODM = $LogServiceODM;
        $this->security = $security;
    }

    /**
     * @param CashbackClientLevel $cashbackClientLevel
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postUpdate(CashbackClientLevel $cashbackClientLevel, LifecycleEventArgs $eventArgs)
    {
        $changeSets = $eventArgs->getEntityManager()->getUnitOfWork()->getEntityChangeSet($cashbackClientLevel);

        $message = 'Для пользователя "' . $cashbackClientLevel->getClient()->getEmail()
            . '" изменился кешбек уровень ' . $cashbackClientLevel->getCashbackLevel()->getName()
            . ', изменились значения ' . implode(', ', array_keys($changeSets));

        $this->LogServiceODM->info(
            $message,
            $this->security->getUser()
        );
    }

    /**
     * @param CashbackClientLevel $cashbackClientLevel
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postPersist(CashbackClientLevel $cashbackClientLevel, LifecycleEventArgs $eventArgs): void
    {
        $message = 'Для пользователя "' . $cashbackClientLevel->getClient()->getEmail()
            . '" добавился кешбек уровень ' . $cashbackClientLevel->getCashbackLevel()->getName();

        $this->LogServiceODM->info(
            $message,
            $this->security->getUser()
        );
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

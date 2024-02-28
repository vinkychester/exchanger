<?php


namespace App\EntityListener;


use App\Entity\Pair;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Component\Security\Core\Security;

/**
 * Class PairEntityListener
 * @package App\EntityListener
 */
class PairEntityListener
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
     * @param Pair $pair
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postPersist(Pair $pair, LifecycleEventArgs $eventArgs)
    {
        $this->LogServiceODM->info(
            'Администратор создал пару с номером ' . $pair->getId(),
            $this->security->getUser()
        );
    }

    /**
     * @param Pair $pair
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postUpdate(Pair $pair, LifecycleEventArgs $eventArgs)
    {
        $changeSets = $eventArgs->getEntityManager()->getUnitOfWork()->getEntityChangeSet($pair);

        $message = 'Администратор отредактировал пару с номером "' . $pair->getId() . '" и изменил ' .
            implode(', ', array_keys($changeSets));

        $this->LogServiceODM->info(
            $message,
            $this->security->getUser()
        );
    }

    /**
     * @param Pair $pair
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function preRemove(Pair $pair, LifecycleEventArgs $eventArgs)
    {
        $this->LogServiceODM->info(
            'Администратор удалил пару с номером ' . $pair->getId(),
            $this->security->getUser()
        );
    }
}

<?php


namespace App\EntityListener;


use App\Entity\Network;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Component\Security\Core\Security;

/**
 * Class NetworkEntityListener
 * @package App\EntityListener
 */
class NetworkEntityListener
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
     * @param Network $network
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postPersist(Network $network, LifecycleEventArgs $eventArgs)
    {
        $this->LogServiceODM->info(
            'Создана новая сеть ' . $network->getName(),
            $this->security->getUser()
        );
    }

    /**
     * @param Network $network
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postUpdate(Network $network, LifecycleEventArgs $eventArgs)
    {
        $changeSets = $eventArgs->getEntityManager()->getUnitOfWork()->getEntityChangeSet($network);

        $message = 'Изменена сеть "' . $network->getName() . '" измененые поля: ' .
            implode(', ', array_keys($changeSets));

        $this->LogServiceODM->info(
            $message,
            $this->security->getUser()
        );
    }

    /**
     * @param Network $network
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postRemove(Network $network, LifecycleEventArgs $eventArgs)
    {
        $this->LogServiceODM->info(
            ' Удалена сеть ' . $network->getName(),
            $this->security->getUser()
        );
    }
}

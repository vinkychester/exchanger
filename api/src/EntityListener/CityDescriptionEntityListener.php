<?php


namespace App\EntityListener;

use App\Entity\CityDescription;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Component\Security\Core\Security;

/**
 * Class CityDescriptionEntityListener
 * @package App\EntityListener
 */
class CityDescriptionEntityListener
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
     * /**
     * @param CityDescription $cityDescription
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postPersist(CityDescription $cityDescription, LifecycleEventArgs $eventArgs)
    {
        $this->LogServiceODM->info(
            'Администратор создал описание к городу ' . $cityDescription->getCityName(),
            $this->security->getUser()
        );
    }

    /**
     * @param CityDescription $cityDescription
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postUpdate(CityDescription $cityDescription, LifecycleEventArgs $eventArgs)
    {
        $changeSets = $eventArgs->getEntityManager()->getUnitOfWork()->getEntityChangeSet($cityDescription);

        $message = 'Администратор изменил описание к городу "' .
            $cityDescription->getCityName() . '" и изменил ' .
            implode(', ', array_keys($changeSets));

        $this->LogServiceODM->info(
            $message,
            $this->security->getUser()
        );
    }

    /**
     * @param CityDescription $cityDescription
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postRemove(CityDescription $cityDescription, LifecycleEventArgs $eventArgs)
    {
        $this->LogServiceODM->info(
            'Администратор удалил описание к городу ' . $cityDescription->getCityName(),
            $this->security->getUser()
        );
    }
}

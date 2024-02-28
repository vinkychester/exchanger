<?php


namespace App\EntityListener;


use App\Entity\City;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Component\Security\Core\Security;

/**
 * Class CityEntityListener
 * @package App\EntityListener
 */
class CityEntityListener
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
     * @param City $city
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postPersist(City $city, LifecycleEventArgs $eventArgs)
    {
        $this->LogServiceODM->info(
            'Создан новый город ' . $city->getName(),
            $this->security->getUser()
        );
    }

    /**
     * @param City $city
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postUpdate(City $city, LifecycleEventArgs $eventArgs)
    {
        $changeSets = $eventArgs->getEntityManager()->getUnitOfWork()->getEntityChangeSet($city);

        if (!isset($changeSets['externalId'])) {
            $message = 'Изменен город "' . $city->getName() . '" измененые поля: ' .
                implode(', ', array_keys($changeSets));

            $this->LogServiceODM->info(
                $message,
                $this->security->getUser()
            );
        }
    }

    /**
     * @param City $city
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postRemove(City $city, LifecycleEventArgs $eventArgs)
    {
        $this->LogServiceODM->info(
            ' Удален город ' . $city->getName(),
            $this->security->getUser()
        );
    }
}

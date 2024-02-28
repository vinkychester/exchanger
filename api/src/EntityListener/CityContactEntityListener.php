<?php


namespace App\EntityListener;

use App\Entity\CityContact;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Component\Security\Core\Security;

/**
 * Class CityContactEntityListener
 * @package App\EntityListener
 */
class CityContactEntityListener
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
     * @param CityContact $cityContact
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postPersist(CityContact $cityContact, LifecycleEventArgs $eventArgs)
    {
        $contactName = $cityContact->getCity() === null
            ? 'Безналичный расчет' : $cityContact->getCity()->getName();

        $this->LogServiceODM->info(
            'Администратор создал контакты к городу ' . $contactName,
            $this->security->getUser()
        );
    }

    /**
     * @param CityContact $cityContact
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postUpdate(CityContact $cityContact, LifecycleEventArgs $eventArgs)
    {
        $changeSets = $eventArgs->getEntityManager()->getUnitOfWork()->getEntityChangeSet($cityContact);
        $contactName = $cityContact->getCity() === null
            ? 'Безналичный расчет' : $cityContact->getCity()->getName();

        $message = 'Администратор изменил контакт к городу "' .
            $contactName . '" и изменил ' .
            implode(', ', array_keys($changeSets));

        $this->LogServiceODM->info(
            $message,
            $this->security->getUser()
        );
    }

    /**
     * @param CityContact $cityContact
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postRemove(CityContact $cityContact, LifecycleEventArgs $eventArgs)
    {
        $contactName = $cityContact->getCity() === null
            ? 'Безналичный расчет' : $cityContact->getCity()->getName();

        $this->LogServiceODM->info(
            'Администратор удалил контакт к городу ' . $contactName,
            $this->security->getUser()
        );
    }
}

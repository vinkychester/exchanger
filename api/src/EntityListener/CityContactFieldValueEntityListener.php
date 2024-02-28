<?php


namespace App\EntityListener;

use App\Entity\CityContactFieldValue;
use App\Entity\CityDescription;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Component\Security\Core\Security;

/**
 * Class CityContactFieldValueEntityListener
 * @package App\EntityListener
 */
class CityContactFieldValueEntityListener
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
     * @param CityContactFieldValue $cityContactFieldValue
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postPersist(CityContactFieldValue $cityContactFieldValue, LifecycleEventArgs $eventArgs)
    {
        $contactName = $cityContactFieldValue->getCityContact()->getCity() === null
            ? 'Безналичный расчет' : $cityContactFieldValue->getCityContact()->getCity()->getName();

        $this->LogServiceODM->info(
            'Администратор создал описание контактов к городу ' . $contactName,
            $this->security->getUser()
        );
    }

    /**
     * @param CityContactFieldValue $cityContactFieldValue
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postUpdate(CityContactFieldValue $cityContactFieldValue, LifecycleEventArgs $eventArgs)
    {
        $changeSets = $eventArgs->getEntityManager()->getUnitOfWork()->getEntityChangeSet($cityContactFieldValue);

        $contactName = $cityContactFieldValue->getCityContact()->getCity() === null
            ? 'Безналичный расчет' : $cityContactFieldValue->getCityContact()->getCity()->getName();

        $message = 'Администратор изменил описание контактов к городу "' .
            $contactName. '" и изменил ' .
            implode(', ', array_keys($changeSets));

        $this->LogServiceODM->info(
            $message,
            $this->security->getUser()
        );
    }

    /**
     * @param CityContactFieldValue $cityContactFieldValue
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postRemove(CityContactFieldValue $cityContactFieldValue, LifecycleEventArgs $eventArgs)
    {
        $contactName = $cityContactFieldValue->getCityContact()->getCity() === null
            ? 'Безналичный расчет' : $cityContactFieldValue->getCityContact()->getCity()->getName();

        $this->LogServiceODM->info(
            'Администратор удалил описание контактов к городу '
            . $contactName,
            $this->security->getUser()
        );
    }
}

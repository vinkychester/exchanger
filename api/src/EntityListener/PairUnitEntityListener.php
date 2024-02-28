<?php


namespace App\EntityListener;

use App\Entity\PairUnit;
use App\Entity\Requisition;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Symfony\Component\Mercure\PublisherInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Security\Core\Security;

/**
 * Class RequisitionEntityListener
 * @package App\EntityListener
 */
class PairUnitEntityListener
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
     * @var PublisherInterface
     */
    private PublisherInterface $publisher;

    /**
     * PairUnitEntityListener constructor.
     * @param LogServiceODM $LogServiceODM
     * @param Security $security
     * @param PublisherInterface $publisher
     */
    public function __construct(LogServiceODM $LogServiceODM, Security $security, PublisherInterface $publisher)
    {
        $this->LogServiceODM = $LogServiceODM;
        $this->security = $security;
        $this->publisher = $publisher;
    }

    /**
     * @param PairUnit $pairUnit
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postUpdate(PairUnit $pairUnit, LifecycleEventArgs $eventArgs)
    {
        $changeSets = $eventArgs->getEntityManager()->getUnitOfWork()->getEntityChangeSet($pairUnit);

        if (!isset($changeSets['balance'])) {
            $message = 'Администратор отредактировал пару с номером "' . $pairUnit->getId() . '" и изменил ' .
                implode(', ', array_keys($changeSets));

            $this->LogServiceODM->info(
                $message,
                $this->security->getUser()
            );
        }

    }

    public function preUpdate(PairUnit $pairUnit, PreUpdateEventArgs $event)
    {
        if ($event->hasChangedField("isActive") || $event->hasChangedField("pairUnitTabs")) {
            $publisher = $this->publisher;
            $update = new Update(
                PairUnit::PAIR_UNIT_TOPIC,
                json_encode(['message' => $pairUnit->getId()])
            );
            $publisher($update);
        }
    }

}

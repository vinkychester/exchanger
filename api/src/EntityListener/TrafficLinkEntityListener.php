<?php


namespace App\EntityListener;


use App\Entity\TrafficLink;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Csrf\TokenGenerator\TokenGeneratorInterface;


/**
 * Class TrafficLinkEntityListener
 * @package App\EntityListener
 */
class TrafficLinkEntityListener
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
     * @var TokenGeneratorInterface
     */
    private TokenGeneratorInterface $tokenGenerator;

    /**
     * UserImageEntityListener constructor.
     * @param TokenGeneratorInterface $tokenGenerator
     * @param LogServiceODM $LogServiceODM
     * @param Security $security
     */
    public function __construct(
        TokenGeneratorInterface $tokenGenerator,
        LogServiceODM $LogServiceODM,
        Security $security
    ) {
        $this->tokenGenerator = $tokenGenerator;
        $this->LogServiceODM = $LogServiceODM;
        $this->security = $security;
    }

    /**
     * @param TrafficLink $trafficLink
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function prePersist(TrafficLink $trafficLink, LifecycleEventArgs $eventArgs)
    {
        $token = $this->tokenGenerator->generateToken();
        $trafficLink->setToken($token);
    }

    /**
     * @param TrafficLink $trafficLink
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postPersist(TrafficLink $trafficLink, LifecycleEventArgs $eventArgs)
    {
        $this->LogServiceODM->info(
            'Создана трафиковая ссылка на сайт ' . $trafficLink->getSiteName()
            . ' c токеном ' . $trafficLink->getToken(),
            $this->security->getUser()
        );
    }

    /**
     * @param TrafficLink $trafficLink
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postUpdate(TrafficLink $trafficLink, LifecycleEventArgs $eventArgs): void
    {
        $changeSets = $eventArgs->getEntityManager()->getUnitOfWork()->getEntityChangeSet($trafficLink);

        $message = 'Изменены поля ' . implode(', ', array_keys($changeSets))
            . ' на трафиковой ссылке ' . $trafficLink->getSiteName();

        $this->LogServiceODM->info(
            $message,
            $this->security->getUser()
        );
    }

    /**
     * @param TrafficLink $trafficLink
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postRemove(TrafficLink $trafficLink, LifecycleEventArgs $eventArgs)
    {
        $this->LogServiceODM->info(
            ' Удалена трафиковая ссылка ' . $trafficLink->getSiteName(),
            $this->security->getUser()
        );
    }
}

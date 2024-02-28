<?php


namespace App\EntityListener;


use App\Entity\PaymentSystem;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Component\Security\Core\Security;

class PaymentSystemEntityListener
{


    /**
     * @var LogServiceODM
     */
    protected LogServiceODM $logServiceODM;
    /**
     * @var Security
     */
    protected Security $security;

    public function __construct(LogServiceODM $logServiceODM, Security $security)
    {
        $this->logServiceODM = $logServiceODM;
        $this->security = $security;
    }

    /**
     * @param PaymentSystem $paymentSystem
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postUpdate(PaymentSystem $paymentSystem, LifecycleEventArgs $eventArgs)
    {
        $changeSets = $eventArgs->getEntityManager()->getUnitOfWork()->getEntityChangeSet($paymentSystem);

        if (isset($changeSets['price'])) {
            $message = 'Администратор изменил себестоимость для Платежной системы - ' .
                $paymentSystem->getName() . ' с ' . $changeSets['price'][0] . ' на ' . $changeSets['price'][1];
            $this->logServiceODM->info($message, $this->security->getUser());
        }
    }
}
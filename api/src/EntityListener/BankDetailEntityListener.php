<?php


namespace App\EntityListener;


use App\Entity\BankDetail;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Component\Security\Core\Security;

class BankDetailEntityListener
{


    /**
     * @var LogServiceODM
     */
    protected LogServiceODM $logServiceODM;
    /**
     * @var Security
     */
    protected Security $security;

    /**
     * BankDetailEntityListener constructor.
     * @param LogServiceODM $logServiceODM
     * @param Security $security
     */
    public function __construct(LogServiceODM $logServiceODM, Security $security)
    {
        $this->logServiceODM = $logServiceODM;
        $this->security = $security;
    }


    /**
     * @param BankDetail $bankDetail
     * @throws \Exception
     */
    public function postPersist(BankDetail $bankDetail)
    {
        if ($bankDetail->getClient()) {
            $this->logServiceODM->info(
                'Пользователь добавил реквизиты для Платежной системы - ' .
                $bankDetail->getPairUnit()->getPaymentSystem()->getName() . ':' .
                $bankDetail->getPairUnit()->getPaymentSystem()->getSubName(),
                $this->security->getUser()
            );
        }
    }

    /**
     * @param BankDetail $bankDetail
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postUpdate(BankDetail $bankDetail, LifecycleEventArgs $eventArgs)
    {
        $changeSets = $eventArgs->getEntityManager()->getUnitOfWork()->getEntityChangeSet($bankDetail);

        $paymentSystem = $bankDetail->getPairUnit()->getPaymentSystem();
        $action = 'изменил';
        if (isset($changeSets['isDeleted'])) {
            if(!$changeSets['isDeleted'][1]){
                $action = 'востановил';
            } else {
                $action = 'удалил';
            }
        }
        $message = "Пользователь $action реквизиты для Платежной системы - " . $paymentSystem->getName(
            ) . ':' . $paymentSystem->getSubName();
        if (isset($changeSets['title'])) {
            $message = $message . ' "Название" с ' . $changeSets['title'][0] . ' на ' . $changeSets['title'][1];
        }

        $this->logServiceODM->info($message, $this->security->getUser());
    }

    /**
     * @param BankDetail $bankDetail
     * @throws \Exception
     */
    public function postRemove(BankDetail $bankDetail)
    {
        $this->logServiceODM->info(
            'Пользователь удалил реквизиты для Платежной системы - ' .
            $bankDetail->getPairUnit()->getPaymentSystem()->getName() . ' - ' .
            $bankDetail->getPairUnit()->getPaymentSystem()->getSubName(),
            $this->security->getUser()
        );
    }
}
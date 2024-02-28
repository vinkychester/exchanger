<?php


namespace App\EntityListener;


use App\Entity\Attribute;
use App\Entity\BankDetail;
use App\Service\Log\LogServiceODM;
use App\Service\Validation\AttributeValidationSingleton;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Security;

class AttributeEntityListener
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
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    /**
     * @param LogServiceODM $logServiceODM
     * @param Security $security
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(LogServiceODM $logServiceODM, Security $security, EntityManagerInterface $entityManager)
    {
        $this->logServiceODM = $logServiceODM;
        $this->entityManager = $entityManager;
        $this->security = $security;
    }

    /**
     * @param Attribute $attribute
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postUpdate(Attribute $attribute, LifecycleEventArgs $eventArgs)
    {
        if ($attribute->getBankDetail()->getClient()) {
            $paymentSystem = $attribute->getBankDetail()->getPairUnit()->getPaymentSystem();
            $changeSets = $eventArgs->getEntityManager()->getUnitOfWork()->getEntityChangeSet($attribute);
            if (isset($changeSets['value'])) {
                $message = 'Пользователь изменил реквизиты для Платежной системы - ' .
                    $paymentSystem->getName() . ':' .
                    $paymentSystem->getSubName() . ' "Реквизиты" с ' .
                    $changeSets['value'][0] . ' на ' . $changeSets['value'][1];
                $this->logServiceODM->info($message, $this->security->getUser());
            }
        }
    }

    /**
     * @param Attribute $attribute
     * @param LifecycleEventArgs $eventArgs
     */
    public function preUpdate(Attribute $attribute, LifecycleEventArgs $eventArgs) {
        $name = ucfirst($attribute->getName());
        $method = "validate{$name}";
        $errors = [];
        if ($attribute->getName() === "wallet") {
            $bankDetail = $attribute->getBankDetail();
            $foundAttribute = $this->entityManager->getRepository(BankDetail::class)->findWallet(
                $bankDetail->getClient(), $bankDetail->getPairUnit(), $attribute->getValue(), $bankDetail->getDirection()
            );
            if ($foundAttribute !== null) {
                $errors["wallet"] = "Такой кошелек существует";
            }
        }
        if (method_exists(AttributeValidationSingleton::class, $method)) {
            // validation attributes service
            AttributeValidationSingleton::getInstance()->$method($attribute->getValue(), $errors);
        }

        if (count($errors)) {
            throw new \RuntimeException(json_encode($errors), Response::HTTP_NOT_ACCEPTABLE);
        }
    }

}
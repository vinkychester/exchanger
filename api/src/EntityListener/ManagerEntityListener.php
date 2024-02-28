<?php


namespace App\EntityListener;


use App\Entity\Manager;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Security;

class ManagerEntityListener
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
     * @var JWTTokenManagerInterface
     */
    protected JWTTokenManagerInterface $tokenManager;

    public function __construct(LogServiceODM $logServiceODM, Security $security, JWTTokenManagerInterface $tokenManager)
    {
        $this->logServiceODM = $logServiceODM;
        $this->security = $security;
        $this->tokenManager = $tokenManager;
    }

    public function postUpdate(Manager $manager, LifecycleEventArgs $eventArgs): void
    {
        $changeSets = $eventArgs->getEntityManager()->getUnitOfWork()->getEntityChangeSet($manager);

        if (isset($changeSets['isBanned'])) {
            $message = 'Администратор изменил статус менеджера "' . $manager->getEmail() . '": ' .
                (($changeSets['isBanned'][1] == 1) ? '"Забанил"' : '"Розбанил"');
        } elseif (isset($changeSets['isBank'])) {
            $message = 'Администратор изменил Безналичный расчет менеджера "' . $manager->getEmail() . '": ' .
                (($changeSets['isBank'][1]) ? '"Включил"' : '"Отключил"');
        } else {
            $message = 'Пользователь изменил ' . implode(', ', array_keys($changeSets));
        }

        $this->logServiceODM->info(
            $message,
            $this->security->getUser()
        );

    }

    protected function generateToken(TokenInterface $token)
    {
        return $this->tokenManager->create($token->getUser());
    }
}
<?php


namespace App\EventListener;


use App\Entity\Manager;
use App\Entity\Requisition;
use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use ReflectionClass;
use Symfony\Component\Security\Core\User\UserInterface;

class JWTCreatedListener
{
    /**
     * @param JWTCreatedEvent $event
     */
    public function onJWTCreatedRequest(JWTCreatedEvent $event): void
    {
        /** @var $user User */
        $user = $event->getUser();

        if (!$user instanceof UserInterface) {
            return;
        }
        $payload['managerCity'] = [];
        if ($user instanceof Manager) {
            $exchangePoints = $user->getCities()->map(function ($obj) {return strval($obj->getExternalId());})->getValues();
            if ($user->getIsBank()) {
                $exchangePoints[count($exchangePoints)] = Requisition::EXCHANGE_TYPE;
            }
            $payload['managerCity'] = $exchangePoints;
        }
        $payload['id'] = $user->getId();
        $payload['username'] = $user->getUsername();
        $payload['role'] = strtolower((new ReflectionClass($user))->getShortName());
        $event->setData($payload);
    }
}
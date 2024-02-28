<?php


namespace App\EventListener;


use App\Entity\Client;
use App\Entity\User;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Events;
use Hackzilla\PasswordGenerator\Generator\ComputerPasswordGenerator;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Doctrine\Persistence\Event\LifecycleEventArgs;

/**
 * Class HashPasswordListener
 * @package App\EventListener
 */
class HashPasswordListener implements EventSubscriber
{
    /**
     * @var UserPasswordEncoderInterface
     */
    protected UserPasswordEncoderInterface $passwordEncoder;
    /**
     * @var ComputerPasswordGenerator
     */
    private ComputerPasswordGenerator $generator;

    /**
     * HashPasswordListener constructor.
     * @param UserPasswordEncoderInterface $passwordEncoder
     */
    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
        $this->generator = new ComputerPasswordGenerator();
        $this->generator->setLength(16);
    }

    /**
     * @return array|string[]
     */
    public function getSubscribedEvents(): array
    {
        return [
            Events::prePersist
        ];
    }

    /**
     * @param Client $client
     * @param LifecycleEventArgs $event
     */
    public function prePersist(Client  $client, LifecycleEventArgs $event): void
    {
        $password = $this->generator->generatePassword();
        $client->setGeneratedPassword($password);
        $client->setPassword($this->passwordEncoder->encodePassword($client, $password));
    }
}
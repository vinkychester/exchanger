<?php


namespace App\Resolver;


use ApiPlatform\Core\Exception\RuntimeException;
use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use ApiPlatform\Core\Validator\ValidatorInterface;
use App\Entity\Client;
use App\Events\ChangePasswordEvent;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * Class ChangePasswordMutationResolver
 * @package App\Resolver
 */
class ChangePasswordMutationResolver implements MutationResolverInterface
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var EventDispatcherInterface
     */
    protected EventDispatcherInterface $eventDispatcher;
    /**
     * @var UserPasswordEncoderInterface
     */
    private UserPasswordEncoderInterface $passwordEncoder;

    /**
     * @var ValidatorInterface
     */
    protected ValidatorInterface $validator;

    /**
     * ChangePasswordMutationResolver constructor.
     * @param EntityManagerInterface $entityManager
     * @param EventDispatcherInterface $eventDispatcher
     * @param UserPasswordEncoderInterface $passwordEncoder
     * @param ValidatorInterface $validator
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        EventDispatcherInterface $eventDispatcher,
        UserPasswordEncoderInterface $passwordEncoder,
        ValidatorInterface $validator
    ) {
        $this->entityManager = $entityManager;
        $this->eventDispatcher = $eventDispatcher;
        $this->passwordEncoder = $passwordEncoder;
        $this->validator = $validator;
    }

    /**
     * @param Client|null $item
     * @param array $context
     * @return Client
     * @throws Exception
     */
    public function __invoke($item, array $context)
    {
        try {
            $args = $context['args']['input'];
            $newPassword = $args['newPassword'];
            $newRetypedPassword = $args['newRetypedPassword'];
            $token = $args['token'];
        } catch (RuntimeException $exception) {
            throw new RuntimeException('Required fields are missed.', Response::HTTP_BAD_REQUEST);
        }

        /** @var Client $client */
        $client = $this->entityManager->getRepository(Client::class)->findOneBy(['token' => $token]);

        if (null === $client) {
            throw new \RuntimeException('Invalid confirmation token', Response::HTTP_BAD_REQUEST);
        }
        $client->setPassword($newRetypedPassword);
        $client->setNewPassword($newPassword);
        $client->setNewRetypedPassword($newRetypedPassword);

        $context['groups'] = 'anonim:change-password';
        $this->validator->validate($item, $context);

        $client->setToken(bin2hex(random_bytes(20)));

        $client->setPassword($this->passwordEncoder->encodePassword($client, $newRetypedPassword));

        //send email
        $objectEvent = new ChangePasswordEvent($client);
        $this->eventDispatcher->dispatch($objectEvent);

        return $client;
    }
}

<?php


namespace App\Resolver;

use ApiPlatform\Core\Exception\RuntimeException;
use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use ApiPlatform\Core\Validator\ValidatorInterface;
use App\Entity\Client;
use App\Events\ChangePasswordEvent;
use Exception;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * Class ChangePasswordMutationResolver
 * @package App\Resolver
 */
class AccountChangePasswordMutationResolver implements MutationResolverInterface
{
    /**
     * @var EventDispatcherInterface
     */
    protected EventDispatcherInterface $eventDispatcher;
    /**
     * @var TokenStorageInterface
     */
    protected TokenStorageInterface $tokenStorage;
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
     * @param EventDispatcherInterface $eventDispatcher
     * @param UserPasswordEncoderInterface $passwordEncoder
     * @param TokenStorageInterface $tokenStorage
     * @param ValidatorInterface $validator
     */
    public function __construct(
        EventDispatcherInterface $eventDispatcher,
        UserPasswordEncoderInterface $passwordEncoder,
        TokenStorageInterface $tokenStorage,
        ValidatorInterface $validator
    ) {
        $this->eventDispatcher = $eventDispatcher;
        $this->passwordEncoder = $passwordEncoder;
        $this->tokenStorage = $tokenStorage;
        $this->validator = $validator;
    }

    /**
     * @param Client|null $item
     *
     * @param array $context
     * @return Client
     * @throws Exception
     */
    public function __invoke($item, array $context)
    {
        $args = $context['args']['input'];
        try {
            $newRetypedPassword = $args['newRetypedPassword'];
        } catch (RuntimeException $exception) {
            throw new RuntimeException('Не заполнены обязательные поля.', Response::HTTP_BAD_REQUEST);
        }

        $context['groups'] = 'client:change-password';
        $this->validator->validate($item, $context);

        $item->setToken(bin2hex(random_bytes(20)));
        $item->setPassword($this->passwordEncoder->encodePassword($item, $newRetypedPassword));

        //send email
        $objectEvent = new ChangePasswordEvent($item);
        $this->eventDispatcher->dispatch($objectEvent);

        return $item;
    }
}

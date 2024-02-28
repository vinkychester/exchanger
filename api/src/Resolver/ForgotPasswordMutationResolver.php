<?php


namespace App\Resolver;


use ApiPlatform\Core\Exception\ItemNotFoundException;
use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\Client;
use App\Events\ForgotPasswordEvent;
use Doctrine\ORM\EntityManagerInterface;
use http\Exception\RuntimeException;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

/**
 * Class ResetPasswordMutationResolver
 * @package App\Resolver
 */
class ForgotPasswordMutationResolver implements MutationResolverInterface
{
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;
    /**
     * @var EventDispatcherInterface
     */
    private EventDispatcherInterface $eventDispatcher;

    /**
     * ResetPasswordMutationResolver constructor.
     * @param EntityManagerInterface $entityManager
     * @param EventDispatcherInterface $eventDispatcher
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        EventDispatcherInterface $eventDispatcher
    ) {
        $this->entityManager = $entityManager;
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * @param Client|null $item
     *
     * @return Client
     */
    public function __invoke($item, array $context)
    {
        $email = $context["args"]["input"]["email"];
        /** @var Client $client */
        $client = $this->entityManager->getRepository(Client::class)->findOneBy(["email" => $email]);

        if (null === $client) {
            throw new \RuntimeException("Пользователь не найден в системе", 400);
        }

        if (!$client->getIsEnabled()) {
            throw new \RuntimeException("Електронный адрес не подтвержден", 400);
        }

        // send email
        $objectEvent = new ForgotPasswordEvent($client);
        $this->eventDispatcher->dispatch($objectEvent);

        return $client;
    }
}
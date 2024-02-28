<?php


namespace App\Resolver;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use Exception;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use App\Entity\Client;
use App\Events\ClientEnabledEvent;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;

/**
 * Class ConfirmationMutationResolver
 * @package App\Resolver
 */
class ConfirmationMutationResolver implements MutationResolverInterface
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
     * ConfirmationMutationResolver constructor.
     * @param EntityManagerInterface $entityManager
     * @param EventDispatcherInterface $eventDispatcher
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        EventDispatcherInterface $eventDispatcher
    )
    {
        $this->entityManager = $entityManager;
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * @param Client|null $item
     * @return Client|object|RedirectResponse|null
     * @throws Exception
     */
    public function __invoke($item, array $context)
    {
        $token = $context["args"]["input"]["token"];

        /** @var Client $client */
        $client = $this->entityManager->getRepository(Client::class)->findOneBy(["token" => $token]);

        if (null === $client) {
            throw new \RuntimeException("К сожалению, не удалось подтвердить электронный адрес", 400);
        }

        if ($client->getIsEnabled()) {
            throw new \RuntimeException("Данная почта уже активирована", 400);
        }

        $client->setIsEnabled(true);
        $client->setToken(bin2hex(random_bytes(20)));
        $this->entityManager->flush();

        //send email
        $objectEvent = new ClientEnabledEvent($client);
        $this->eventDispatcher->dispatch($objectEvent);

        return $client;
    }
}
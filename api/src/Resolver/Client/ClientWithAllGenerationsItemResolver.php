<?php


namespace App\Resolver\Client;

use ApiPlatform\Core\Exception\ResourceClassNotFoundException;
use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use App\Entity\Client;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Class ClientWithAllGenerationsItemResolver
 * @package App\Resolver\Client
 */
class ClientWithAllGenerationsItemResolver implements QueryItemResolverInterface
{
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    /**
     * ClientWithRelationsItemResolver constructor.
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(
        EntityManagerInterface $entityManager
    ) {
        $this->entityManager = $entityManager;
    }

    /**
     * @param Client|null $item
     * @param array $context
     * @return Client|object|null
     * @throws ResourceClassNotFoundException
     */
    public function __invoke($item, array $context)
    {
        $args = $context['args'];
        $userID = $args['userID'];

        /** @var Client $client */
        if (!$client = $this->entityManager->getRepository(Client::class)->find($userID)) {
            throw new ResourceClassNotFoundException('Client not found');
        }

        if (!$invitedUsersRelations = $client->getReferralUserRelations()) {
            return null;
        }

        $invitedUsersRelations->map(
            function ($relation) {
                $relation->getInvitedUser()->setEmail(
                    $this->entityManager->getRepository(Client::class)->hideEmail(
                        $relation->getInvitedUser()->getEmail()
                    )
                );
            }
        );

        return $client;
    }
}

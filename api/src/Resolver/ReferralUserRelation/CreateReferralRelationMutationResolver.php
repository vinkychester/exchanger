<?php


namespace App\Resolver\ReferralUserRelation;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\Client;
use App\Entity\ReferralUserRelation;
use App\Repository\ClientRepository;
use Doctrine\ORM\NonUniqueResultException;

/**
 * Class InvoiceMutationResolver
 * @package App\Resolver
 */
class CreateReferralRelationMutationResolver implements MutationResolverInterface
{
    /**
     * @var ClientRepository
     */
    protected ClientRepository $clientRepository;

    /**
     * CreateReferralRelationMutationResolver constructor.
     * @param ClientRepository $clientRepository
     */
    public function __construct(ClientRepository $clientRepository)
    {
        $this->clientRepository = $clientRepository;
    }

    /**
     * Return null if nothing to change
     * Return ReferralRelationUser if new relation was created
     *
     * @param ReferralUserRelation|null $item
     * @param array $context
     * @return object|null
     * @throws NonUniqueResultException
     */
    public function __invoke($item, array $context)
    {
        $args = $context['args']['input'];
        $inviterEmail = $args['inviterEmail'];
        $invitedUserId = $args['invitedUserID'];

        /** @var Client $inviter */
        $inviter = $this->clientRepository->findOneBy(
            ['email' => $inviterEmail]
        );

        if (!$inviter) {
            return null;
        }

        /** @var Client $invitedUser */
        $invitedUser = $this->clientRepository->getClientByUUID($invitedUserId);

        $invitedUserExists = $inviter->getReferralUserRelations()->exists(
            function ($key, $element) use ($invitedUser) {
                return $element->getInvitedUser() === $invitedUser;
            }
        );

        if (!$invitedUserExists) {
            $item->setClient($inviter);
            $item->setInvitedUser($invitedUser);
            $item->getInvitedUser()->setRegistrationType(Client::REGISTRATION_REFERRAL);

            return $item;
        }

        return null;
    }
}

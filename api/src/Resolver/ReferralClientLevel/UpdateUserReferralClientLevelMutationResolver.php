<?php


namespace App\Resolver\ReferralClientLevel;

use ApiPlatform\Core\Exception\ResourceClassNotFoundException;
use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Repository\ClientRepository;
use App\Repository\ReferralClientLevelRepository;
use App\Repository\ReferralLevelRepository;

/**
 * Create ReferralClientLevel record by user token.
 * @package App\Resolver
 */
class UpdateUserReferralClientLevelMutationResolver implements MutationResolverInterface
{
    /**
     * @var ReferralClientLevelRepository
     */
    protected ReferralClientLevelRepository $referralClientLevelRepository;
    /**
     * @var ReferralLevelRepository
     */
    protected ReferralLevelRepository $referralLevelRepository;
    /**
     * @var ClientRepository
     */
    protected ClientRepository $clientRepository;

    /**
     * UpdateUserReferralClientLevelMutationResolver constructor.
     * @param ReferralClientLevelRepository $referralClientLevelRepository
     * @param ReferralLevelRepository $referralLevelRepository
     * @param ClientRepository $clientRepository
     */
    public function __construct(
        ReferralClientLevelRepository $referralClientLevelRepository,
        ReferralLevelRepository $referralLevelRepository,
        ClientRepository $clientRepository
    ) {
        $this->referralClientLevelRepository = $referralClientLevelRepository;
        $this->referralLevelRepository = $referralLevelRepository;
        $this->clientRepository = $clientRepository;
    }

    /**
     * @param object|null $item
     * @param array $context
     * @return object|null
     * @throws ResourceClassNotFoundException
     */
    public function __invoke($item, array $context)
    {
        $args = $context['args']['input'];
        $clientRefToken = $args['clientRefToken'];

        if (!$referralTokenOwner = $this->clientRepository->findOneBy(['referralToken' => $clientRefToken])) {
            return null;
        }

        $defaultFirstReferralLevel = $this->referralLevelRepository->findOneBy(
            ['isDefault' => true, 'isActive' => true, 'level' => 1]
        );
        if (!$defaultFirstReferralLevel) {
            throw new ResourceClassNotFoundException("Default loyalty-program level not found!");
        }

        $isSameReferralClientLevelRecord = $this->referralClientLevelRepository->findOneBy(
            ['client' => $referralTokenOwner, 'referralLevel' => $defaultFirstReferralLevel]
        );
        if ($isSameReferralClientLevelRecord) {
            return null;
        }

        $item->setClient($referralTokenOwner);
        $item->setReferralLevel($defaultFirstReferralLevel);

        return $item;
    }
}

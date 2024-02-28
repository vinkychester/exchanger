<?php


namespace App\Resolver\ReferralLevel;

use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Repository\ReferralLevelRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

/**
 * Class UpdateForNewClientsMutationResolver
 * @package App\Resolver\ReferralLevel
 */
class UpdateForNewClientsMutationResolver implements MutationResolverInterface
{
    /**
     * @var ReferralLevelRepository
     */
    protected ReferralLevelRepository $referralLevelRepository;
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * UpdateForNewClientsMutationResolver constructor.
     * @param ReferralLevelRepository $referralLevelRepository
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(
        ReferralLevelRepository $referralLevelRepository,
        EntityManagerInterface $entityManager
    ) {
        $this->referralLevelRepository = $referralLevelRepository;
        $this->entityManager = $entityManager;
    }

    /**
     * @param object|null $item
     * @param array $context
     * @return object|void|null
     */
    public function __invoke($item, array $context)
    {
        $args = $context['args']['input'];
        $referralLevelID = $args['referralLevelID'];

        $referralLevel = $this->referralLevelRepository->find($referralLevelID);
        if (!$referralLevel) {
            throw new ResourceNotFoundException('No such referral level');
        }

        $this->referralLevelRepository->setNotDefaultForDefaultLevels($referralLevel->getLevel());
        $this->referralLevelRepository->setDefaultReferralLevel($referralLevel->getId());

        $conn = $this->entityManager->getConnection();

        $stmt = $conn->prepare(
            $this->referralLevelRepository->deactivateNotUsedReferralLevelsSQL()
        );
        $stmt->execute();

        $stmt = $conn->prepare(
            $this->referralLevelRepository->activateUsedReferralLevelsSQL()
        );
        $stmt->execute();


        return $referralLevel;
    }
}

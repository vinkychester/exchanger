<?php


namespace App\Resolver\ReferralLevel;

use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\ReferralLevel;
use App\Repository\ReferralClientLevelRepository;
use App\Repository\ReferralLevelRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

/**
 * Class UpdateForAllExceptVipClientsMutationResolver
 * @package App\Resolver\ReferralLevel
 */
class UpdateForAllExceptVipClientsMutationResolver implements MutationResolverInterface
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * @var ReferralLevelRepository
     */
    protected ReferralLevelRepository $referralLevelRepository;

    /**
     * @var ReferralClientLevelRepository
     */
    protected ReferralClientLevelRepository $referralClientLevelRepository;

    /**
     * UpdateForAllExceptVipClientsMutationResolver constructor.
     * @param EntityManagerInterface $entityManager
     * @param ReferralLevelRepository $referralLevelRepository
     * @param ReferralClientLevelRepository $referralClientLevelRepository
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        ReferralLevelRepository $referralLevelRepository,
        ReferralClientLevelRepository $referralClientLevelRepository
    ) {
        $this->entityManager = $entityManager;
        $this->referralLevelRepository = $referralLevelRepository;
        $this->referralClientLevelRepository = $referralClientLevelRepository;
    }

    /**
     * @param object|null $item
     * @param array $context
     * @return object|void|null
     * @throws \Doctrine\DBAL\Driver\Exception
     * @throws \Doctrine\DBAL\Exception
     */
    public function __invoke($item, array $context)
    {
        $args = $context['args']['input'];
        $referralLevelID = $args['referralLevelID'];

        $referralLevel = $this->entityManager->getRepository(ReferralLevel::class)->find($referralLevelID);
        if (!$referralLevel) {
            throw new ResourceNotFoundException('No such referral level');
        }

        $conn = $this->entityManager->getConnection();
        $stmt = $conn->prepare(
            $this->referralClientLevelRepository->updateLevelForNotVipClientsSQL(
                $referralLevel->getLevel(),
                $referralLevel->getId()
            )
        );
        $stmt->execute();

        $stmt = $conn->prepare(
            $this->referralLevelRepository->deactivateNotUsedReferralLevelsSQL()
        );
        $stmt->execute();

        $stmt = $conn->prepare(
            $this->referralLevelRepository->activateUsedReferralLevelsSQL()
        );
        $stmt->execute();


        return null;
    }
}

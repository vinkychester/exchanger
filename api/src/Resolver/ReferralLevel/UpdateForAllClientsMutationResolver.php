<?php


namespace App\Resolver\ReferralLevel;

use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\Client;
use App\Entity\ReferralClientLevel;
use App\Entity\ReferralLevel;
use App\Repository\ReferralClientLevelRepository;
use App\Repository\ReferralLevelRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

/**
 * Class UpdateForAllClientsMutationResolver
 * @package App\Resolver\ReferralLevel
 */
class UpdateForAllClientsMutationResolver implements MutationResolverInterface
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
     * UpdateForAllClientsMutationResolver constructor.
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
     */
    public function __invoke($item, array $context)
    {
        $args = $context['args']['input'];
        $referralLevelID = $args['referralLevelID'];

        $referralLevel = $this->referralLevelRepository->find($referralLevelID);
        if (!$referralLevel) {
            throw new ResourceNotFoundException('No such referral level');
        }

        $allReferralLevelsByLevel = $this->entityManager->createQueryBuilder()
            ->select('referralLevel.id')
            ->from(ReferralLevel::class, 'referralLevel')
            ->where('referralLevel.level = ' . $referralLevel->getLevel())
            ->getDQL();

        $this->entityManager->createQueryBuilder()
            ->update()
            ->from(ReferralClientLevel::class, 'referralClientLevel')
            ->where(
                $this->entityManager->createQueryBuilder()->expr()->In(
                    'referralClientLevel.referralLevel',
                    $allReferralLevelsByLevel
                )
            )
            ->set('referralClientLevel.referralLevel', $referralLevel->getId())
            ->getQuery()
            ->execute();

        $clients = $this->entityManager->getRepository(Client::class)->findAll();

        $this->referralClientLevelRepository->createReferralLevelForAllClients($referralLevel, $clients);

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

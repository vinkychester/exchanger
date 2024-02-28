<?php


namespace App\Resolver\ReferralLevel;


use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;
use App\Repository\ReferralLevelRepository;
use Doctrine\ORM\EntityManagerInterface;

class CollectionWithActiveCheckingResolver implements QueryCollectionResolverInterface
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
     * CollectionWithActiveCheckingResolver constructor.
     * @param EntityManagerInterface $entityManager
     * @param ReferralLevelRepository $referralLevelRepository
     */
    public function __construct(EntityManagerInterface $entityManager, ReferralLevelRepository $referralLevelRepository)
    {
        $this->entityManager = $entityManager;
        $this->referralLevelRepository = $referralLevelRepository;
    }

    public function __invoke(iterable $collection, array $context): iterable
    {
        $conn = $this->entityManager->getConnection();

        $test1 = $this->referralLevelRepository->deactivateNotUsedReferralLevelsSQL();
        $stmt = $conn->prepare(
            $test1
        );
        $stmt->execute();

        $stmt = $conn->prepare(
            $this->referralLevelRepository->activateUsedReferralLevelsSQL()
        );
        $stmt->execute();

        return $collection;
    }
}
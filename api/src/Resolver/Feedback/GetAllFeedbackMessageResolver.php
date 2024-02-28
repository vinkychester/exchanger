<?php


namespace App\Resolver\Feedback;


use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;
use App\Entity\FeedbackMessage;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Security;

class GetAllFeedbackMessageResolver implements QueryCollectionResolverInterface
{

    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var Security
     */
    protected Security $security;

    /**
     * GetAllFeedbackMessageResolver constructor.
     * @param EntityManagerInterface $entityManager
     * @param Security $security
     */
    public function __construct(EntityManagerInterface $entityManager,Security $security)
    {
        $this->entityManager = $entityManager;
        $this->security = $security;
    }

    /**
     * @param iterable $collection
     * @param array $context
     * @return iterable
     */
    public function __invoke(iterable $collection, array $context): iterable
    {
        $args = $context['args'];
        $user = $this->security->getUser();

        dd($collection);

    }
}
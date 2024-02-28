<?php


namespace App\Resolver;


use ApiPlatform\Core\Bridge\Doctrine\Orm\AbstractPaginator;
use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;
use App\Entity\Client;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\Pagination\Paginator as ToolPaginator;

class ClientStatisticCollectionResolver implements QueryCollectionResolverInterface
{
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    /**
     * ClientStatisticCollectionResolver constructor.
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @param iterable<Client> $collection
     *
     * @return iterable<Client>
     */
    public function __invoke(iterable $collection, array $context): iterable
    {
        $args = $context['args'];
//        foreach ($collection as $key => $client) {
//            $count = $this->entityManager->getRepository(Client::class)->getRequisitionsCount($client, $args);
//            if ($count && $count["1"] <= 0) {
//                $collection = $collection->getCollection()->filter(function ($client) {
//                    return $client;
//                });
//            }
//            $this->entityManager->getRepository(Client::class)->getRequisitionBalanceByPeriod($client, $args);
//        }

        return $collection;
    }
}
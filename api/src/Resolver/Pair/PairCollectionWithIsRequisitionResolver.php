<?php


namespace App\Resolver\Pair;

use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;
use App\Entity\Pair;
use App\Repository\RequisitionRepository;
use Calculation\Service\Exchange;

/**
 * Class PairCollectionResolver
 * @package App\Resolver
 */
class PairCollectionWithIsRequisitionResolver implements QueryCollectionResolverInterface
{

    /**
     * @var RequisitionRepository
     */
    private RequisitionRepository $requisitionRepository;

    /**
     * PairCollectionResolver constructor.
     * @param RequisitionRepository $requisitionRepository
     */
    public function __construct(RequisitionRepository $requisitionRepository)
    {
        $this->requisitionRepository = $requisitionRepository;
    }

    /**
     * @param iterable<Pair> $collection
     * @param array $context
     * @return iterable<Pair>
     */
    public function __invoke(iterable $collection, array $context): iterable
    {
        $args = $context["args"];

        foreach ($collection as $pair) {
            $pair->setPaymentRate(Exchange::calculation("payment")->calculateRates($pair));
            $pair->setPayoutRate(Exchange::calculation("payout")->calculateRates($pair));

            $pair->setIsRequisitionBind(false);
            if ($this->requisitionRepository->findOneBy(['pair' => $pair->getId()])) {
                $pair->setIsRequisitionBind(true);
            }
        }

        return $collection;
    }
}

<?php


namespace App\Resolver\PairUnit;

use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use App\Entity\Pair;
use App\Repository\PairUnitRepository;

/**
 * Class PairUnitWithReverseDirectionResolver
 * @package App\Resolver\PairUnit
 */
class PairUnitWithReverseDirectionResolver implements QueryItemResolverInterface
{
    /**
     * @var PairUnitRepository
     */
    private PairUnitRepository $pairUnitRepository;

    /**
     * PairCollectionResolver constructor.
     * @param PairUnitRepository $pairUnitRepository
     */
    public function __construct(PairUnitRepository $pairUnitRepository)
    {
        $this->pairUnitRepository = $pairUnitRepository;
    }

    /**
     * @param Pair|null $item
     * @param array $context
     * @return Pair
     */
    public function __invoke($item, array $context)
    {
        $pairUnitId = $context["args"]["pairUnitId"];

        return $this->pairUnitRepository->findSecondPairUnitByCurrencyAndPaymentSystem($pairUnitId);
    }
}

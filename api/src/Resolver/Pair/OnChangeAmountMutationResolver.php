<?php


namespace App\Resolver\Pair;

use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\Pair;
use App\Repository\PairRepository;
use Calculation\Service\Exchange;

/**
 * Class InvoiceMutationResolver
 * @package App\Resolver
 */
class OnChangeAmountMutationResolver implements MutationResolverInterface
{
    /**
     * @var PairRepository
     */
    protected PairRepository $pairRepository;

    /**
     * OnChangeAmountMutationResolver constructor.
     * @param PairRepository $pairRepository
     */
    public function __construct(PairRepository $pairRepository)
    {
        $this->pairRepository = $pairRepository;
    }

    /**
     * @param object|null $item
     * @param array $context
     * @return Pair|object|null
     */
    public function __invoke($item, array $context)
    {
        $args = $context['args']['input'];
        $payment = $args['paymentID'];
        $payout = $args['payoutID'];
        $calculationDirection = $args['calculationDirection'];
        $amount = $args['amount'];

        /** @var Pair $pair */
        $pair = $this->pairRepository->findOneBy(['payment' => $payment, 'payout' => $payout]);

        if (null !== $pair) {
            Exchange::calculation($calculationDirection)->calculateAmount($pair, $amount);
        }

        return $pair;
    }
}

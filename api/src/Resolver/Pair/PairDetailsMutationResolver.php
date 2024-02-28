<?php


namespace App\Resolver\Pair;

use ApiPlatform\Core\Exception\RuntimeException;
use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\Pair;
use App\Repository\PairRepository;
use Calculation\Service\Exchange;
use Calculation\Service\Limits;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class InvoiceMutationResolver
 * @package App\Resolver
 */
class PairDetailsMutationResolver implements MutationResolverInterface
{
    /**
     * @var PairRepository
     */
    protected PairRepository $pairRepository;

    /**
     * PairDetailsMutationResolver constructor.
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
        $pairID = $args['pairID'];
        $direction = $args['direction'] ?? "payment";
        $name = $direction === "payment" ? "paymentAmount" : "payoutAmount";
        
        $amount = $args['amount'] ?? null;
        $errors = [];
        if (null !== $amount) {
            if (!preg_match('/^[+-]?([0-9]*[.])?[0-9]+$/', $amount)) {
                $errors[$name] = "Значение не должно содержать символы";
            }
            $amount = floatval($amount);
        }

        if (count($errors)) {
            throw new \RuntimeException(json_encode($errors), Response::HTTP_NOT_ACCEPTABLE);
        }

        /** @var Pair $pair */
        $pair = $this->pairRepository->findOneBy(['id' => $pairID, 'isActive' => true]);

        if (null !== $pair) {
            Limits::calculateMin($pair);
            Limits::calculateMax($pair);
            Exchange::calculation($direction)->calculateAmount($pair, $amount);
        }

        return $pair;
    }
}

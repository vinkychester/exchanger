<?php


namespace App\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use App\Entity\Currency;
use App\Entity\Pair;
use App\Entity\Requisition;
use App\Service\Document\VerificationService;
use Calculation\Service\Course;
use Calculation\Service\Exchange;


/**
 * Class RequisitionDetailsResolver
 * @package App\Resolver
 */
class RequisitionDetailsResolver implements QueryItemResolverInterface
{
    /**
     * @var VerificationService
     */
    protected VerificationService $verificationService;

    /**
     * RequisitionDetailsResolver constructor.
     * @param VerificationService $verificationService
     */
    public function __construct(
        VerificationService $verificationService
    ) {
        $this->verificationService = $verificationService;
    }

    /**
     * @param Requisition $item
     * @param array $context
     * @return object
     */
    public function __invoke($item, array $context): object
    {
//        /** @var Pair $pair */
//        $pair = $item->getPair();
//        $item->setCommission(Course::calculateLastFee($pair, $item->getPairPercent()));
//        $fiat = $pair->getPayment()->getCurrency()->getTag() === Currency::TYPE_CURRENCY ? $pair->getPayment() : $pair->getPayout();
//        if ($fiat && $fiat->getVerificationSchema()) {
//            $item->getClient()->setVerificationInfo(
//                $this->verificationService->verify($item->getClient(), $fiat->getVerificationSchema()->getName())
//            );
//        }
        return $item;
    }
}

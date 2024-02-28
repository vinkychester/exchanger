<?php


namespace App\Resolver\Client;

use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use App\Entity\Client;
use App\Entity\Currency;
use App\Entity\Pair;
use App\Entity\PayoutRequisition;
use App\Entity\RequisitionFeeHistory;
use App\Entity\RequisitionProfitHistory;
use App\Repository\ClientRepository;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Class GetAllClientsLoyaltyStatisticsResolver
 * @package App\Resolver\Client
 */
class GetClientLoyaltyStatisticResolver implements QueryItemResolverInterface
{
    /**
     * @var ClientRepository
     */
    protected ClientRepository $clientRepository;
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    /**
     * GetAllClientsLoyaltyStatisticsResolver constructor.
     * @param EntityManagerInterface $entityManager
     * @param ClientRepository $clientRepository
     */
    public function __construct(EntityManagerInterface $entityManager, ClientRepository $clientRepository)
    {
        $this->entityManager = $entityManager;
        $this->clientRepository = $clientRepository;
    }

    /**
     * @param Client $item
     * @param array $context
     * @return object
     */
    public function __invoke($item, array $context): object
    {
//        $requisitions = $item->getRequisitions();
//
//        $cashback = 0;
//        $referral = 0;
//
//        foreach ($requisitions as $requisition) {
//            $profits = $this->entityManager->getRepository(RequisitionProfitHistory::class)->findBy(['requisition' => $requisition]);
//            /** @var RequisitionFeeHistory $rate */
//            $rate = $this->entityManager->getRepository(RequisitionFeeHistory::class)->findOneBy(
//                ['requisition' => $requisition, 'type' => Pair::PAYMENT]
//            )->getRate();
//            $isCrypto = $requisition->getPair()->getPayment()->getCurrency()->getTag() === Currency::TYPE_CRYPTO;
//            if ($profits) {
//                foreach ($profits as $profit) {
//                    if ($profit->getFieldName() === RequisitionProfitHistory::CASHBACK_PROFIT_FIELD) {
//                        $cashback += $isCrypto ? round($profit->getValue(), 2) * $rate : round($profit->getValue() / $rate, 2);
//                    }
//
//                    if ($profit->getFieldName() === RequisitionProfitHistory::REFERRAL_PROFIT_FIELD) {
//                        $referral += $isCrypto ? round($profit->getValue(), 2) * $rate : round($profit->getValue() / $rate, 2);
//                    }
//
//                }
//            }
//        }
//
//        $item->setCashbackBalance($cashback);
//        $item->setReferralBalance($referral);
//        $item->setTotalBalance($cashback + $referral);
//        $args = $context['args'];
//
//        $payoutRequisitionAmount = 0;
//        $client->getPayoutRequisitions()
//            ->filter(fn($payoutRequisition) => $payoutRequisition->getStatus() === PayoutRequisition::STATUS_FINISHED)
//            ->map(function($payoutRequisition) use (&$payoutRequisitionAmount) {
//            $payoutRequisitionAmount += $payoutRequisition->getAmount();
//        });
//
//        $client->setPayoutRequisitionAmount($payoutRequisitionAmount);
//
//        $client->setReferralsRequisitionsSystemProfit(
//            $this->clientRepository
//                ->calculateReferralsRequisitionsSystemProfit($client)['referralsRequisitionsSystemProfit'] ?? 0
//        );

        return $item;
    }
}

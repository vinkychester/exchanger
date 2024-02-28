<?php


namespace App\Service\ReferralSystem;


use App\Entity\Balance;
use App\Entity\Client;
use App\Entity\ClientBalance;
use App\Entity\Requisition;
use App\Entity\RequisitionFeeHistory;
use App\Repository\ClientBalanceRepository;
use App\Repository\RequisitionProfitHistoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\PersistentCollection;

/**
 * Class ReferralRecountBalancesService
 * @package App\Service\ReferralSystem
 */
class ReferralRecountBalancesService
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var ClientBalanceRepository
     */
    protected ClientBalanceRepository $clientBalanceRepository;
    /**
     * @var ClientReferralParentsService
     */
    protected ClientReferralParentsService $clientReferralParentsService;
    /**
     * @var RequisitionProfitHistoryRepository
     */
    protected RequisitionProfitHistoryRepository $requisitionProfitHistoryRepository;

    /**
     * ReferralRecountBalancesService constructor.
     * @param EntityManagerInterface $entityManager
     * @param ClientBalanceRepository $clientBalanceRepository
     * @param ClientReferralParentsService $clientReferralParentsService
     * @param RequisitionProfitHistoryRepository $requisitionProfitHistoryRepository
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        ClientBalanceRepository $clientBalanceRepository,
        ClientReferralParentsService $clientReferralParentsService,
        RequisitionProfitHistoryRepository $requisitionProfitHistoryRepository
    )
    {
        $this->entityManager = $entityManager;
        $this->clientBalanceRepository = $clientBalanceRepository;
        $this->clientReferralParentsService = $clientReferralParentsService;
        $this->requisitionProfitHistoryRepository = $requisitionProfitHistoryRepository;
    }

    /**
     * @param Requisition $requisition
     * @return float|int
     */
    public function calculateReferralBalance(Requisition $requisition)
    {
        $fullReferralProfit = 0;

        $referralParentsRecords = $requisition->getClient()->getAncestors();

        foreach ($referralParentsRecords as $referralParentRecord) {
            /** @var Client $client */
            $client = $this->entityManager->getRepository(Client::class)->find($referralParentRecord->getClient());

            $referralClientLevel = $this->getReferralLevelByLevel(
                $client->getReferralClientLevels(),
                $referralParentRecord->getLevel()
            );

            if($referralClientLevel) {
                $value = ($requisition->getProfit()
                    * $referralClientLevel->getReferralLevel()->getPercent() / 100);

                $fullReferralProfit += $value;
                $level = $referralParentRecord->getLevel();
                $this->requisitionProfitHistoryRepository->setRequisitionProfitHistory(
                    $requisition,
                    "referralsProfit_$level",
                    $value
                );

                $tag = $requisition->getPair()->getPayment()->getCurrency()->getTag();
                $rate = $this->entityManager->getRepository(RequisitionFeeHistory::class)->findOneBy(['requisition' => $requisition, 'type' => 'payment']);
                $value = $this->convert($tag, $value, $rate->getRate());

                $referralClientLevel->setProfit($referralClientLevel->getProfit() + $value);

                $this->clientBalanceRepository->setClientBalance(
                    $client, Balance::BALANCE_FIELD, $value, '+'
                );

                $this->clientBalanceRepository->setClientBalance(
                    $client, ClientBalance::REFERRAL_PROFIT_FIELD, $value, '+'
                );

                $profit = $this->convert($tag, $requisition->getProfit(), $rate->getRate());

                $this->clientBalanceRepository->setClientBalance(
                    $client, Balance::PROFIT, $profit, '+'
                );

                $this->entityManager->persist($referralClientLevel);
                $this->entityManager->flush();
            }
        }

        return $fullReferralProfit;
    }

    /**
     * @param PersistentCollection $clientReferralClientLevels
     * @param int $level
     * @return false|mixed
     */
    public function getReferralLevelByLevel(PersistentCollection $clientReferralClientLevels, int $level)
    {
        if (!$clientReferralClientLevels) {
            return false;
        }

        $clientReferralClientLevel = $clientReferralClientLevels->filter(
            function ($clientReferralClientLevel) use ($level) {
                return $clientReferralClientLevel->getReferralLevel()->getLevel() === $level;
            }
        );

        if ($clientReferralClientLevel->count()) {
            return $clientReferralClientLevel->first();
        }

        return false;
    }

    /**
     * @param $tag
     * @param $profit
     * @param $rate
     * @return float
     */
    public function convert($tag, $profit, $rate): float
    {
        return ($tag === "CRYPTO" ? (($profit * $rate) * 100 / 100 ): (($profit / $rate) * 100) / 100);
    }
}

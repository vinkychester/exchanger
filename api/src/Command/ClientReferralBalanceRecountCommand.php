<?php

namespace App\Command;

use App\Entity\Balance;
use App\Entity\Client;
use App\Entity\ClientBalance;
use App\Entity\ReferralClientLevel;
use App\Entity\ReferralUserRelation;
use App\Entity\Requisition;
use App\Entity\RequisitionFeeHistory;
use App\Entity\RequisitionProfitHistory;
use App\Repository\ClientBalanceRepository;
use App\Service\ReferralSystem\ReferralRecountBalancesService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

/**
 * Class ClientReferralBalanceRecountCommand
 * @package App\Command
 */
class ClientReferralBalanceRecountCommand extends Command
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * @var ReferralRecountBalancesService
     */
    protected ReferralRecountBalancesService $balancesService;
    protected ClientBalanceRepository $balanceRepository;

    /**
     * ClientReferralBalanceRecountCommand constructor.
     * @param EntityManagerInterface $entityManager
     * @param ReferralRecountBalancesService $balancesService
     * @param ClientBalanceRepository $balanceRepository
     * @param string|null $name
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        ReferralRecountBalancesService $balancesService,
        ClientBalanceRepository $balanceRepository,
        string $name = null
    ) {
        parent::__construct($name);
        $this->entityManager = $entityManager;
        $this->balancesService = $balancesService;
        $this->balanceRepository = $balanceRepository;
    }

    /**
     * @var string
     */
    protected static $defaultName = 'client:referral_balance_recount';

    /**
     * @var string
     */
    protected static $defaultDescription = 'recount all client balances';

    protected function configure(): void
    {
        $this->setDescription(self::$defaultDescription);
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $clients = $this->entityManager->getRepository(Client::class)->getReferralClients();
        foreach ($clients as $client) {
            /** @var Client $client */
            $referralProfit = 0;
            $referralProfit1 = 0;
            $referralProfit2 = 0;
            $systemProfit = 0;
            $profit = 0;
            $cashbackProfit = 0;
            foreach ($client->getReferralUserRelations() as $referralUserRelation) {
                /** @var ReferralUserRelation $referralUserRelation */
                foreach ($referralUserRelation->getInvitedUser()->getRequisitions() as $requisition) {
                    /** Requisition $requisition */
                    if ($requisition->getStatus() !== Requisition::STATUS_FINISHED) {
                        continue;
                    }
                    $tag = $requisition->getPair()->getPayment()->getCurrency()->getTag();
                    /** @var RequisitionFeeHistory $rate */
                    $rate = $this->entityManager->getRepository(RequisitionFeeHistory::class)->findOneBy(
                        ['requisition' => $requisition, 'type' => 'payment']
                    );
                    $systemProfit += $this->balancesService->convert($tag, $requisition->getSystemProfit(), $rate->getRate());
                    $profit += $this->balancesService->convert($tag, $requisition->getProfit(), $rate->getRate());

                    foreach ($requisition->getRequisitionProfitHistories() as $profitHistory) {
                        /** @var RequisitionProfitHistory $profitHistory */
                        if ($profitHistory->getFieldName() === ClientBalance::REFERRAL_PROFIT_FIELD) {
                            $referralProfit += $this->balancesService->convert(
                                $tag,
                                $profitHistory->getValue(),
                                $rate->getRate()
                            );
                        }
                        if ($profitHistory->getFieldName() === ClientBalance::CASHBACK_PROFIT_FIELD) {
                            $cashbackProfit += $this->balancesService->convert(
                                $tag,
                                $profitHistory->getValue(),
                                $rate->getRate()
                            );
                        }
                        if ($profitHistory->getFieldName() === 'referralsProfit_1') {
                            $referralProfit1 += $this->balancesService->convert(
                                $tag,
                                $profitHistory->getValue(),
                                $rate->getRate()
                            );
                        }
                        if ($profitHistory->getFieldName() === 'referralsProfit_2') {
                            $referralProfit2 += $this->balancesService->convert(
                                $tag,
                                $profitHistory->getValue(),
                                $rate->getRate()
                            );
                        }
                    }
                }
            }

            $this->balanceRepository->setClientBalance($client, ClientBalance::REFERRAL_PROFIT_FIELD, $referralProfit);

            $this->balanceRepository->setClientBalance($client, ClientBalance::CASHBACK_PROFIT_FIELD, $cashbackProfit);

            $this->balanceRepository->setClientBalance($client, Balance::SYSTEM_PROFIT, $systemProfit);

            $this->balanceRepository->setClientBalance($client, Balance::PROFIT, $profit);

            $this->balanceRepository->setClientBalance($client, Balance::BALANCE_FIELD, $referralProfit + $cashbackProfit);

            foreach ($client->getReferralClientLevels() as $referralClientLevel) {
                /** @var ReferralClientLevel $referralClientLevel */
                if ($referralClientLevel->getReferralLevel()->getLevel() === 1) {
                    $referralClientLevel->setProfit($referralProfit1);
                }
                if ($referralClientLevel->getReferralLevel()->getLevel() === 2) {
                    $referralClientLevel->setProfit($referralProfit2);
                }
                $this->entityManager->persist($referralClientLevel);
            }
            $this->entityManager->flush();

        }

        $io->success('end recount');

        return Command::SUCCESS;
    }
}

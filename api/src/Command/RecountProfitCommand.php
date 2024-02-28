<?php

namespace App\Command;

use App\Entity\Profit;
use App\Entity\Requisition;
use App\Entity\RequisitionFeeHistory;
use App\Service\ReferralSystem\ReferralRecountBalancesService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class RecountProfitCommand extends Command
{
    /**
     * @var string
     */
    protected static $defaultName = 'RecountProfit';

    /**
     * @var string
     */
    protected static $defaultDescription = 'recalculation of profit on all requisitions';

    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * @var ReferralRecountBalancesService
     */
    protected ReferralRecountBalancesService $balancesService;

    /**
     * @param EntityManagerInterface $entityManager
     * @param ReferralRecountBalancesService $balancesService
     * @param string|null $name
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        ReferralRecountBalancesService $balancesService,
        string $name = null
    ) {
        parent::__construct($name);
        $this->entityManager = $entityManager;
        $this->balancesService = $balancesService;
    }

    protected function configure(): void
    {
        $this->setDescription(self::$defaultDescription);
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $systemProfit = 0;
        $profit = 0;

        $requisitions = $this->entityManager->getRepository(Requisition::class)->findBy(
            ['status' => Requisition::STATUS_FINISHED]
        );
        foreach ($requisitions as $requisition) {
            /** @var Requisition $requisition */
            $tag = $requisition->getPair()->getPayment()->getCurrency()->getTag();
            /** @var RequisitionFeeHistory $rate */
            $rate = $this->entityManager->getRepository(RequisitionFeeHistory::class)->findOneBy(
                ['requisition' => $requisition, 'type' => 'payment']
            );
            $systemProfit += $this->balancesService->convert($tag, $requisition->getSystemProfit(), $rate->getRate());
            $profit += $this->balancesService->convert($tag, $requisition->getProfit(), $rate->getRate());
        }

        $this->entityManager->getRepository(Profit::class)->setProfit(Profit::PROFIT, $profit);
        $this->entityManager->getRepository(Profit::class)->setProfit(Profit::SYSTEM_PROFIT, $systemProfit);

        $io->success('You have a new command! Now make it your own! Pass --help to see your options.');

        return Command::SUCCESS;
    }
}

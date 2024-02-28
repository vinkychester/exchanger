<?php

namespace App\Command;

use App\Service\CashbackSystem\CashbackRecountBalancesService;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

/**
 * Class CheckCashbackLevelMonthCommand
 * @package App\Command
 */
class CheckCashbackLevelMonthCommand extends Command
{
    /**
     * @var string
     */
    protected static $defaultName = 'cashback:check';
    protected CashbackRecountBalancesService $cashbackRecountBalancesService;


    /**
     * CheckCashbackLevelMonthCommand constructor.
     * @param string|null $name
     * @param CashbackRecountBalancesService $cashbackRecountBalancesService
     */
    public function __construct(CashbackRecountBalancesService $cashbackRecountBalancesService, string $name = null)
    {
        parent::__construct($name);
        $this->cashbackRecountBalancesService = $cashbackRecountBalancesService;
    }

    protected function configure()
    {
        $this->setDescription('Add a short description for your command');
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $this->cashbackRecountBalancesService->checkingUsersCashbackLevelsByProfit();

        $io->success("Client cashback levels were successfully updated");

        return Command::SUCCESS;
    }
}


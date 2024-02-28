<?php

namespace App\Command;

use App\Entity\PairUnit;
use App\Service\RateHistory\RateHistoryService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class RatesChangesCommand extends Command
{
    protected static $defaultName = 'RatesChanges';
    protected static $defaultDescription = 'Add a short description for your command';
    private EntityManagerInterface $entityManager;
    private RateHistoryService $rateHistoryService;

    /**
     * RatesChangesCommand constructor.
     * @param EntityManagerInterface $entityManager
     * @param RateHistoryService $rateHistoryService
     * @param string|null $name
     */
    public function __construct(EntityManagerInterface $entityManager, RateHistoryService $rateHistoryService, string $name = null)
    {
        parent::__construct($name);
        $this->entityManager = $entityManager;
        $this->rateHistoryService = $rateHistoryService;
    }

    protected function configure(): void
    {
        $this
            ->setDescription(self::$defaultDescription)
            ->addArgument('arg1', InputArgument::OPTIONAL, 'Argument description')
            ->addOption('option1', null, InputOption::VALUE_NONE, 'Option description')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $pairUnits = $this->entityManager->getRepository(PairUnit::class)->getActivePairUnitsByCurrencyTag();
        foreach ($pairUnits as $item) {
            $item->setDayChange(
                number_format(
                    (float)$this->rateHistoryService->getChangePercentByTime($item),
                    5,
                    '.',
                    ''
                )
            );
            $this->entityManager->persist($item);
        }

        $this->entityManager->flush();

        date_default_timezone_set('Europe/Kiev');
        $io->success('Day changes updated ' . date('d/m/Y h:i:s', time()));

        return Command::SUCCESS;
    }
}

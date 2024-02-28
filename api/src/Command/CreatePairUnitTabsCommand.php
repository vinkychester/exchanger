<?php

namespace App\Command;

use App\Entity\PairUnitTab;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class CreatePairUnitTabsCommand extends Command
{
    protected static $defaultName = 'CreatePairUnitTabs';
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * CreatePairUnitTabsCommand constructor.
     * @param EntityManagerInterface $entityManager
     * @param string|null $name
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        string $name = null
    ) {
        parent::__construct($name);
        $this->entityManager = $entityManager;
    }

    protected function configure()
    {
        $this
            ->setDescription('Add a short description for your command')
            ->addArgument('arg1', InputArgument::OPTIONAL, 'Argument description')
            ->addOption('option1', null, InputOption::VALUE_NONE, 'Option description')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        foreach (PairUnitTab::PAIR_UNIT_TABS as $tab) {
            $pairUnitTab = new PairUnitTab();
            $pairUnitTab->setName($tab);

            $this->entityManager->persist($pairUnitTab);
        }

        $this->entityManager->flush();

        $io->success("Tabs wor pair units was inserted successfully");

        return Command::SUCCESS;
    }
}

<?php

namespace App\Command;

use App\Entity\Client;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class DeleteUnconfirmedUsersCommand extends Command
{
    /**
     * @var string
     */
    protected static $defaultName = 'delete-unconfirmed-users';

    /**
     * @var string
     */
    protected static $defaultDescription = 'delete unconfirmed users';

    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * CronDeleteUnconfirmedUsersCommand constructor.
     * @param EntityManagerInterface $entityManager
     * @param string|null $name
     */
    public function __construct(EntityManagerInterface $entityManager, string $name = null)
    {
        parent::__construct($name);
        $this->entityManager = $entityManager;
    }

    protected function configure(): void
    {
        $this->setDescription(self::$defaultDescription)
            ->addArgument('date', InputArgument::REQUIRED, 'date before delete');
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $users = $this->entityManager->getRepository(Client::class)->getUnconfirmedUsersByDate(
            $input->getArgument('date')
        );
//        dd($users);

        foreach ($users as $user) {
            $this->entityManager->remove($user);
        }
        $this->entityManager->flush();

        if (count($users)) {
            $io->success('success at delete users.');

            return Command::SUCCESS;
        } else {
            $io->section('fail at delete users.');

            return Command::FAILURE;
        }
    }
}

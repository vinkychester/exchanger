<?php

namespace App\Command;

use App\Entity\Mailing;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class CronFinishMailingCommand extends Command
{
    /**
     * @var string
     */
    protected static $defaultName = 'cron:mailing_finish';

    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;


    /**
     * CronFinishMailingCommand constructor.
     * @param EntityManagerInterface $entityManager
     * @param string|null $name
     */
    public function __construct(EntityManagerInterface $entityManager, string $name = null)
    {
        parent::__construct($name);
        $this->entityManager = $entityManager;
    }

    protected function configure()
    {
        $this->setDescription('This command change active status mailing on passive');
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $mailings = $this->entityManager->getRepository(Mailing::class)->findBy(
            [
                'status' => true
            ]
        );

        foreach ($mailings as $mailing) {
            $mailing->setStatus(false);
            $this->entityManager->persist($mailing);
        }
        $this->entityManager->flush();

        if (empty($mailings)) {
            $io->success('no mailings for finish');
        } else {
            $io->success('mailings is finished');
        }

        return Command::SUCCESS;
    }
}

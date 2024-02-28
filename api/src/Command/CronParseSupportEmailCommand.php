<?php

namespace App\Command;

use App\Service\FeedbackMessage\ParseEmail;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class CronParseSupportEmailCommand extends Command
{
    protected static $defaultName = 'cron:parse_support_email';
    /**
     * @var ParseEmail
     */
    protected ParseEmail $parseEmail;

    /**
     * CronParseSupportEmailCommand constructor.
     * @param ParseEmail $parseEmail
     * @param string|null $name
     */
    public function __construct( ParseEmail $parseEmail, string $name = null)
    {
        parent::__construct($name);
        $this->parseEmail = $parseEmail;
    }

    protected function configure()
    {
        $this->setDescription('This command will be parse support email for feedback message');
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $messages =  $this->parseEmail->getListOfMails();
        date_default_timezone_set('Europe/Kiev');
        if (empty($messages)) {
            $io->success('no new messages ' . date('d/m/Y h:i:s', time()));
        } else {
            $io->success('new messages saved ' . date('d/m/Y h:i:s', time()));
        }

        return Command::SUCCESS;
    }
}

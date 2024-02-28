<?php

namespace App\Command;

use Sonata\GoogleAuthenticator\GoogleAuthenticator;
use Sonata\GoogleAuthenticator\GoogleQrUrl;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\Question;
use Symfony\Component\Console\Style\SymfonyStyle;

class GenerateGoogleSecretCommand extends Command
{
    protected static $defaultName = 'GenerateGoogleSecret';

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $output->writeln([
            'Google Secret Creator',
            '============',
            '',
        ]);

        $helper = $this->getHelper('question');

        $domains = ['coin24.dev.com', 'dev7.itlab-studio.com', 'coin24.com.ua', 'v2.coin24.com.ua'];
        $question = new Question('Enter Domain: ');
        $question->setAutocompleterValues($domains);
        $domain = $helper->ask($input, $output, $question);

        $roles = ['admin', 'manager', 'seo', 'client'];
        $question = new Question('Enter Role: ');
        $question->setAutocompleterValues($roles);
        $role = $helper->ask($input, $output, $question);

        $google = new GoogleAuthenticator();
        $secret = $google->generateSecret();
        $link = GoogleQrUrl::generate("{$domain} ({$role})", $secret);

        $io = new SymfonyStyle($input, $output);
        $io->section('Secret ' . $secret . "\nLink " . $link);

        return Command::SUCCESS;
    }
}

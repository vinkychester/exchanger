<?php

namespace App\Command;

use App\Entity\CreditCard;
use App\Events\ClientCreditCardNotificationEvent;
use App\Events\TenDaysClientCreditCardNotificationEvent;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

class CronClientCreditCardNotificationCommand extends Command
{
    /**
     * @var string
     */
    protected static $defaultName = 'cron:ClientCreditCardNotification';
    /**
     * @var string
     */
    protected static string $defaultDescription = 'check expire date at client credit card.';
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var EventDispatcherInterface
     */
    protected EventDispatcherInterface $eventDispatcher;

    /**
     * CronClientCreditCardNotificationCommand constructor.
     * @param EntityManagerInterface $entityManager
     * @param EventDispatcherInterface $eventDispatcher
     * @param string|null $name
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        EventDispatcherInterface $eventDispatcher,
        string $name = null
    ) {
        parent::__construct($name);
        $this->entityManager = $entityManager;
        $this->eventDispatcher = $eventDispatcher;
    }

    protected function configure()
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

        $before = $this->entityManager->getRepository(CreditCard::class)->expireDate('+10 days');
        $now = $this->entityManager->getRepository(CreditCard::class)->expireDate('now');

        if (!empty($before)) {
            $this->eventDispatcher->dispatch(new TenDaysClientCreditCardNotificationEvent($before));
            $io->success('customers receive a 10-day credit card expiration notice.');
        } else {
            if (!empty($now)) {
                $this->eventDispatcher->dispatch(new ClientCreditCardNotificationEvent($now));
                $io->success('clients are notified of the credit card\'s expiration date.');
            } else {
                $io->success('no clients to notify credit card expiration.');
            }
        }

        return Command::SUCCESS;
    }
}

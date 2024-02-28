<?php

namespace App\Command;

use App\Entity\Client;
use App\Events\RemoveUnconfirmedUsersEvent;
use App\Events\ThreeDaysClientNotificationEvent;
use App\Events\TwoWeekClientNotificationEvent;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

class RemoveUnconfirmedUsersCommand extends Command
{
    /**
     * @var string
     */
    protected static $defaultName = 'RemoveUnconfirmedUsers';

    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * @var EventDispatcherInterface
     */
    private EventDispatcherInterface $eventDispatcher;

    /**
     * TwoWeekClientNotificationCommand constructor.
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
        $this->setDescription(
            'for non-activated users 30 days after registration on the site, a letter is sent stating that the account has been deleted'
        );
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $twoWeeks = $this->entityManager->getRepository(Client::class)->getUnConfirmedUsers('- 2 weeks');
        $twentySeven = $this->entityManager->getRepository(Client::class)->getUnConfirmedUsers('- 27 days');
        $month = $this->entityManager->getRepository(Client::class)->getUnConfirmedUsers('- 30 days');
        $users = count(array_merge($twentySeven, $month, $twoWeeks));

        if (!empty($month)) {
            $this->eventDispatcher->dispatch(new RemoveUnconfirmedUsersEvent($month));
        }
        if (!empty($twoWeeks)) {
            $this->eventDispatcher->dispatch(new TwoWeekClientNotificationEvent($twoWeeks));
        }
         if (!empty($twentySeven)) {
             $this->eventDispatcher->dispatch(new ThreeDaysClientNotificationEvent($twentySeven));
         }

         if ($users) {
             $io->success('reminder sent to unverified users - ' . $users );
         } else {
             $io->success('no users to delete were found');
         }

        return Command::SUCCESS;
    }
}

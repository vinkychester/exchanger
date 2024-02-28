<?php

namespace App\Command;

use App\Entity\Currency;
use App\Entity\Pair;
use App\Entity\PairUnit;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Notifier\ChatterInterface;
use Symfony\Component\Notifier\Message\ChatMessage;

class CronBalanceNotificationCommand extends Command
{
    protected static $defaultName = 'cron:balance_notification';

    protected static $defaultDescription = 'when the balance approaches the minimum value, a message is sent in telegram';
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var ChatterInterface
     */
    protected ChatterInterface $chatter;

    protected array $unique = [];

    /**
     * CronBalanceNotificationCommand constructor.
     * @param EntityManagerInterface $entityManager
     * @param ChatterInterface $chatter
     * @param string|null $name
     */
    public function __construct(EntityManagerInterface $entityManager, ChatterInterface $chatter, string $name = null)
    {
        parent::__construct($name);
        $this->entityManager = $entityManager;
        $this->chatter = $chatter;
    }

    protected function configure()
    {
        $this->setDescription(self::$defaultDescription);
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int
     * @throws \Symfony\Component\Notifier\Exception\TransportExceptionInterface
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $pairs = $this->entityManager->getRepository(Pair::class)->findBy(['isActive' => true]);

        $chatMessage = new ChatMessage('');
        $chatMessage->transport($_ENV['APP_ENV'] === 'dev'? "telegram_info" : "telegram_coin_bot");

        foreach ($pairs as $pair) {
            /** @var Pair $pair */
            if (array_key_exists($pair->getPayout()->getPaymentSystem()->getName() .'-'.$pair->getPayout()->getCurrency()->getAsset(), $this->unique)) {
                continue;
            }
            if ($pair->getPayout()->getCurrency()->getTag() == Currency::TYPE_CURRENCY && $pair->getPayout()->getBalance() <= PairUnit::BALANCE_MIN) {
                $this->chatter->send(
                    $chatMessage->subject(
                        'Баланс по Платежной системе ' . $pair->getPayout()->getPaymentSystem()->getName()
                        . ' ' . $pair->getPayout()->getCurrency()->getAsset()
                        . ' менее ' . PairUnit::BALANCE_MIN . ' ' . $pair->getPayout()->getCurrency()->getAsset()
                    )
                );
                $this->unique[$pair->getPayout()->getPaymentSystem()->getName() .'-'.$pair->getPayout()->getCurrency()->getAsset()] = 'exist';
            }
        }

        $io->success('Notification send successfully');

        return Command::SUCCESS;
    }
}

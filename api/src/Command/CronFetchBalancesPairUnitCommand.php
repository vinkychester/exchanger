<?php

namespace App\Command;

use App\Entity\Currency;
use App\Entity\PairUnit;
use Doctrine\ORM\EntityManagerInterface;
use ItlabStudio\ApiClient\Service\ApiClient;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class CronFetchBalancesPairUnitCommand extends Command
{
    protected static $defaultName = 'cron:FetchBalancesPairUnit';
    protected static $defaultDescription = 'get balances for each PairUnit';
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var ApiClient
     */
    protected ApiClient $apiClient;

    public function __construct(
        EntityManagerInterface $entityManager,
        ApiClient $apiClient,
        string $name = null
    ) {
        parent::__construct($name);
        $this->entityManager = $entityManager;
        $this->apiClient = $apiClient;
    }

    protected function configure()
    {
        $this->setDescription(self::$defaultDescription);
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $api = $this->apiClient;
        $pairUSDT = $this->entityManager->getRepository(PairUnit::class)->findPairUnitByCurrency('USDT', 'payout');
        $balanceUSDT = $api->ControlPanel()
            ->Balances()
            ->getByConnection( $pairUSDT->getCurrency()->getAsset(), $pairUSDT->getService()->getConnection())
            ->getData()
            ->first()
            ->getAmount();

        $pairUnits = $this->entityManager->getRepository(PairUnit::class)->getAllPairsByWhiteBit();
        foreach ($pairUnits as $pairUnit) {
            /** @var PairUnit $pairUnit $balance */
            $balance = $api->ControlPanel()
                ->Balances()
                ->getByConnection($pairUnit->getCurrency()->getAsset(), $pairUnit->getService()->getConnection())
                ->getData()
                ->first();
            if ($balance) {
                $pairUnit->setBalance($balance->getAmount());
            } else if ($pairUnit->getCurrency()->getTag() === Currency::TYPE_CRYPTO) {
                $rate = 'get' . ucfirst($pairUnit->getDirection()) . 'Rate';
                $USDTBalance = $balanceUSDT / $pairUnit->getCurrency()->$rate();
                $pairUnit->setBalance($USDTBalance);
            }
            $this->entityManager->persist($pairUnit);
        }
        $this->entityManager->flush();

        date_default_timezone_set('Europe/Kiev');
        $io->success('Balances saved successfully ' . date('d/m/Y h:i:s', time()));

        return Command::SUCCESS;
    }
}

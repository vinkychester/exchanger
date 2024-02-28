<?php

namespace App\Command;

use App\Entity\Currency;
use App\Service\RateBuilder\RateBuilder;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use ItlabStudio\ApiClient\Service\ApiClient;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class CronFetchFiatRatesNewCommand extends Command
{
    /**
     * @var string
     */
    protected static $defaultName = 'cron:fetchFiatRatesNew';

    /**
     * @var string
     */
    protected static $defaultDescription = 'Cron command to update currencies` rates';

    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * @var ApiClient
     */
    protected ApiClient $apiClient;

    /**
     * @param EntityManagerInterface $entityManager
     * @param ApiClient $apiClient
     * @param string|null $name
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        ApiClient $apiClient,
        string $name = null
    ) {
        parent::__construct($name);
        $this->entityManager = $entityManager;
        $this->apiClient = $apiClient;
    }

    protected function configure(): void
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
        $availableCurrencies = $this->entityManager->getRepository(Currency::class)
            ->findBy(['tag' => Currency::TYPE_CURRENCY]);

        try {
            (new RateBuilder($this->entityManager))
                ->setAvailableCurrencies($availableCurrencies)
                ->setItems(
                    $this->apiClient->ControlPanel()->Rate()
                        ->setFilter('currency.type', Currency::TYPE_CURRENCY)
                        ->getAll()->getData()
                )
                ->storeItems();
        } catch (Exception $e) {
            $io->error('Your command failed or have been executed partially. Error message:' . $e->getMessage());

            return Command::FAILURE;
        }

        $io->success('Rates have been successfully inserted to database. Time: ' . date("Y-m-d H:i:s"));

        return Command::SUCCESS;
    }
}

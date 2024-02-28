<?php

namespace App\Command;

use App\Entity\Currency;
use App\Entity\Invoice;
use App\Entity\RateHistory;
use App\Service\RateBuilder\RateBuilder;
use Doctrine\ORM\EntityManagerInterface;
use ItlabStudio\ApiClient\Service\ApiClient;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Mercure\PublisherInterface;
use Symfony\Component\Mercure\Update;

class CronFetchRatesCommand extends Command
{
    /**
     * @var string
     */
    protected static $defaultName = 'cron:fetchCryptoRates';

    /**
     * @var ApiClient
     */
    protected ApiClient $apiClient;

    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var PublisherInterface
     */
    protected PublisherInterface $publisher;

    /**
     * CronFetchRatesCommand constructor.
     * @param EntityManagerInterface $entityManager
     * @param ApiClient $apiClient
     * @param PublisherInterface $publisher
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        ApiClient $apiClient,
        PublisherInterface $publisher,
        string $name = null
    ) {
        parent::__construct($name);
        $this->entityManager = $entityManager;
        $this->apiClient = $apiClient;
        $this->publisher = $publisher;
    }

    protected function configure()
    {
        $this
            ->setDescription('Cron command to update currencies` rates')
            ->addArgument('id', InputArgument::OPTIONAL, 'Please add the "id" argument to fetch rate by id');
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $argID = $input->getArgument('id');

        if ($argID) {
            $io->note(sprintf('You passed an argument: %s', $argID));
        } else {

            $availableCurrencies = $this->entityManager->getRepository(Currency::class)
                ->findBy(['tag' => Currency::TYPE_CRYPTO]);

            try {
                (new RateBuilder($this->entityManager))
                    ->setAvailableCurrencies($availableCurrencies)
                    ->setItems(
                        $this->apiClient->ControlPanel()->Rate()
                            ->setFilter('currency.type', Currency::TYPE_CRYPTO)
                            ->getAll()->getData()
                    )
                    ->storeItems();
            } catch (\Exception $e) {
                $io->error('Your command failed or have been executed partially. Error message:' . $e->getMessage());

                return Command::FAILURE;
            }
        }

        $update = new Update(
            RateHistory::RATES_TOPIC,
            json_encode(['rates' => true])
        );

        $publisher = $this->publisher;
        // The Publisher service is an invokable object
        $publisher($update);

        $io->success('Rates have been successfully inserted to database. Time: ' . date("Y-m-d H:i:s"));

        return Command::SUCCESS;
    }
}

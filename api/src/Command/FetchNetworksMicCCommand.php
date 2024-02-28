<?php

namespace App\Command;

use App\Entity\Network as NetworkEntity;
use App\Service\Network\NetworkBuilder;
use Doctrine\ORM\EntityManagerInterface;
use ItlabStudio\ApiClient\Service\ApiClient;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Mercure\PublisherInterface;

class FetchNetworksMicCCommand extends Command
{
    protected static $defaultName = 'MicCNetworks:fetch';
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var PublisherInterface
     */
    protected PublisherInterface $publisher;

    /**
     * @var NetworkBuilder
     */
    protected NetworkBuilder $networkBuilder;
    /**
     * @var ApiClient
     */
    protected ApiClient $apiClient;

    /**
     * ParsePairUnitCommand constructor.
     * @param EntityManagerInterface $entityManager
     * @param PublisherInterface $publisher
     * @param NetworkBuilder $networkBuilder
     * @param ApiClient $apiClient
     * @param string|null $name
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        PublisherInterface $publisher,
        NetworkBuilder $networkBuilder,
        ApiClient $apiClient,
        string $name = null
    ) {
        parent::__construct($name);
        $this->entityManager = $entityManager;
        $this->publisher = $publisher;
        $this->networkBuilder = $networkBuilder;
        $this->apiClient = $apiClient;
    }

    protected function configure()
    {
        $this->setDescription('Fetch Networks from Microservice Cash');
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $networkResponse = $this->apiClient->ControlPanel()->Payment()->external(
            [
                "connection"    => $_ENV['CP_MICC_CONNECTION']
            ]
        );

        if ($networkResponse) {
            $this->networkBuilder
                ->setItems($networkResponse)
                ->storeItems();

            $io->success('You have a new command! Now make it your own! Pass --help to see your options.');

            return Command::SUCCESS;
        }

        $io->success('No items to fetch');

        return Command::FAILURE;
    }
}

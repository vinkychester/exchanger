<?php

namespace App\Command;

use App\Entity\RequisitionStatus;
use App\Utils\RequestManager;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

class ParseRequisitionStatusesCommand extends Command
{
    /**
     * @var string
     */
    protected static $defaultName = "parse:requisition-statuses";

    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var RequestManager
     */
    protected RequestManager $requestManager;

    /**
     * ParsePairUnitCommand constructor.
     * @param EntityManagerInterface $entityManager
     * @param RequestManager $requestManager
     * @param string|null $name
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        RequestManager $requestManager,
        string $name = null
    ) {
        parent::__construct($name);
        $this->entityManager = $entityManager;
        $this->requestManager = $requestManager;
    }

    protected function configure()
    {
        $this->setDescription('Add a short description for your command');
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int
     * @throws ClientExceptionInterface
     * @throws DecodingExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ServerExceptionInterface
     * @throws TransportExceptionInterface
     * @throws Exception
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $statuses = RequisitionStatus::statuses;
        foreach ($statuses as $status) {
            $searchedStatus = $this->entityManager->getRepository(RequisitionStatus::class)->findOneBy(
                ['status' => $status]
            );
            if (null === $searchedStatus) {
                $newStatusObject = new RequisitionStatus();
                $newStatusObject->setStatus($status);

                $this->entityManager->persist($newStatusObject);
            }
        }

        $this->entityManager->flush();

        $io->success('Statuses were successfully inserted to database');

        return 0;
    }
}

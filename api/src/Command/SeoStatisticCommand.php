<?php

namespace App\Command;

use App\Entity\Client;
use App\Entity\Requisition;
use App\Entity\RequisitionFeeHistory;
use App\Service\ReferralSystem\ReferralRecountBalancesService;
use DateTime;
use DateTimeZone;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\Question;

/**
 * Class SeoStatisticCommand
 * @package App\Command
 */
class SeoStatisticCommand extends Command
{
    /**
     * @var string
     */
    protected static $countRequisitionAll = 'number all requisition ';
    /**
     * @var string
     */
    protected static $countRequisition = 'number completed requisition';
    /**
     * @var string
     */
    protected static $countRequisitionAndProfit = 'number requisition and profit';
    /**
     * @var string
     */
    protected static $defaultName = 'SeoStatistic';

    /**
     * @var string
     */
    protected static $defaultDescription = 'Displays certain statistics depending on the criteria';
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    protected ReferralRecountBalancesService $balancesService;

    /**
     * SeoStatisticCommand constructor.
     * @param EntityManagerInterface $entityManager
     * @param ReferralRecountBalancesService $balancesService
     * @param string|null $name
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        ReferralRecountBalancesService $balancesService,
        string $name = null
    ) {
        parent::__construct($name);
        $this->entityManager = $entityManager;
        $this->balancesService = $balancesService;
    }

    protected function configure(): void
    {
        $this
            ->setDescription(self::$defaultDescription);
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $output->writeln(
            [
                'SEO Statistic Creator',
                '============',
                '',
            ]
        );

        $helper = $this->getHelper('question');
        $typesRegistration = [
            Client::REGISTRATION_DEFAULT,
            Client::REGISTRATION_REFERRAL,
            Client::REGISTRATION_TRAFFIC,
            'All'
        ];
        $question = new Question('Select the type of registration: ');
        $question->setAutocompleterValues($typesRegistration);
        $typeRegistration = $helper->ask($input, $output, $question);

        $question = new Question('Enter the date to in the format d:m:y: ');
        $dateFrom = explode(':', $helper->ask($input, $output, $question));

        $question = new Question('Enter the date from in the format d:m:y: ');
        $dateTo = explode(':', $helper->ask($input, $output, $question));

        $finalValue = [self::$countRequisitionAll, self::$countRequisition, self::$countRequisitionAndProfit];
        $question = new Question('Select the end result: ');
        $question->setAutocompleterValues($finalValue);
        $result = $helper->ask($input, $output, $question);

        $numberRequisitionAll = 0;
        $numberRequisitionFinished = 0;
        $profit = 0;

        $date = new DateTime();
        $date->setTimezone(new DateTimeZone('Europe/Kiev'));
        $dateFrom = $date->setDate($dateFrom[2], $dateFrom[1], $dateFrom[0])->setTime('00', '00', '00')->getTimestamp();
        $dateTo = $date->setDate($dateTo[2], $dateTo[1], $dateTo[0])->setTime('23', '59', '00')->getTimestamp();


        if ($typeRegistration !== 'All') {
            $clients = $this->entityManager->getRepository(Client::class)->getClientsForSeo(
                $dateFrom,
                $dateTo,
                $typeRegistration
            );
        } else {
            $clients = $this->entityManager->getRepository(Client::class)->getClientsForSeo($dateFrom, $dateTo);
        }

        foreach ($clients as $client) {
            /** @var Client $client */
            if ($client->getRequisitions()) {
                $numberRequisitionAll += count($client->getRequisitions());
                if ($result === self::$countRequisitionAndProfit) {
                    foreach ($client->getRequisitions() as $requisition) {
                        if ($requisition->getStatus() !== Requisition::STATUS_FINISHED) {
                            continue;
                        }
                        $numberRequisitionFinished += 1;
                        $tag = $requisition->getPair()->getPayment()->getCurrency()->getTag();
                        /** @var RequisitionFeeHistory $rate */
                        $rate = $this->entityManager->getRepository(RequisitionFeeHistory::class)->findOneBy(
                            ['requisition' => $requisition, 'type' => 'payment']
                        );
                        $profit += $this->balancesService->convert(
                            $tag,
                            $requisition->getSystemProfit(),
                            $rate->getRate()
                        );
                    }
                }
            }
        }

        $output->writeln(
            'Clients - ' . count($clients) .
            ". All requisition - $numberRequisitionAll. Finished requisition - $numberRequisitionFinished. Profit - $profit"
        );

        return Command::SUCCESS;
    }
}

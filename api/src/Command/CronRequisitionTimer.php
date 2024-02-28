<?php


namespace App\Command;


use App\Entity\Currency;
use App\Entity\Requisition;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class CronRequisitionTimer extends Command
{


    /**
     * @var string
     */
    protected static $defaultName = 'cron:requisition_timer';

    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * CronRequisitionTimer constructor.
     * @param EntityManagerInterface $entityManager
     * @param string|null $name
     */
    public function __construct(EntityManagerInterface $entityManager, string $name = null)
    {
        parent::__construct($name);
        $this->entityManager = $entityManager;
    }


    protected function configure()
    {
        $this->setDescription(
            'checks the time of creation of the requisition, if it came out the requisition is closed by system'
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

        $requisitionBankFiveDay = $this->entityManager->getRepository(Requisition::class)->requisitionTimerFiveDays();
        $requisitionCash = $this->entityManager->getRepository(Requisition::class)->requisitionTimer('-3 days', 'cash', Currency::TYPE_CURRENCY);
        $requisitionBank = $this->entityManager->getRepository(Requisition::class)->requisitionTimer('-1 days', 'bank', Currency::TYPE_CRYPTO);
        /** @var Requisition $requisition */
        $requisitions = array_merge($requisitionCash, $requisitionBank, $requisitionBankFiveDay );
        $count = count($requisitions);
        if ($count) {
            foreach ($requisitions as $requisition) {
                $requisition->setStatus(Requisition::STATUS_DISABLED);
                $this->entityManager->persist($requisition);
            }
            $this->entityManager->flush();
        }

        $io->success("$count requisition was bee disabled");

        return Command::SUCCESS;
    }
}
<?php

namespace App\Command;

use App\Entity\Client;
use App\Entity\ReferralUserRelation;
use App\Entity\Requisition;
use DateTime;
use DateTimeZone;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Mercure\PublisherInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Validator\Constraints\Timezone;

class AddClientReferralsCommand extends Command
{
    protected static $defaultName = 'ClientsssReferrals';
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var PublisherInterface
     */
    protected PublisherInterface $publisher;

    /**
     * ParsePairUnitCommand constructor.
     * @param EntityManagerInterface $entityManager
     * @param PublisherInterface $publisher
     * @param string|null $name
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        PublisherInterface $publisher,
        string $name = null
    ) {
        parent::__construct($name);
        $this->entityManager = $entityManager;
        $this->publisher = $publisher;
    }

    protected function configure()
    {
        $this
            ->setDescription('Add a short description for your command')
            ->addArgument('arg1', InputArgument::OPTIONAL, 'Argument description')
            ->addOption('option1', null, InputOption::VALUE_NONE, 'Option description')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);



        include __DIR__ . '/client_referrals.php';


        foreach ($client as $item){

            $clientEntity = $this->entityManager->getRepository(Client::class)->findOneBy(['email'=>$item['client_id']]);
            $clientEntityReferral = $this->entityManager->getRepository(Client::class)->findOneBy(['email'=>$item['invited_user_id']]);

            $refEntity = new ReferralUserRelation();

            $refEntity->setClient($clientEntity);
            $refEntity->setInvitedUser($clientEntityReferral);

            $this->entityManager->persist($refEntity);

        }


        $this->entityManager->flush();


        $io->success('You have a new command! Now make it your own! Pass --help to see your options.');

        return Command::SUCCESS;
    }
}


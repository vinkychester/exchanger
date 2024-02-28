<?php

namespace App\Command;

use App\Entity\ReferralLevel;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class ReferralLevelsCreateDefaultCommand extends Command
{
    protected static $defaultName = 'referral-levels:create:default';
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * ReferralLevelsCreateDefaultCommand constructor.
     * @param string|null $name
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(string $name = null, EntityManagerInterface $entityManager)
    {
        parent::__construct($name);
        $this->entityManager = $entityManager;
    }

    protected function configure()
    {
        $this->setDescription('Add a short description for your command');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $defaultLevel1 = $this->entityManager->getRepository(ReferralLevel::class)->findOneBy(
            [
                'isDefault' => true,
                'isActive' => true,
                'level' => 1,
            ]
        );

        if(!$defaultLevel1) {
            $newReferralLevel = new ReferralLevel();

            $newReferralLevel->setIsDefault(true);
            $newReferralLevel->setIsActive(true);
            $newReferralLevel->setName("first_level");
            $newReferralLevel->setPercent(5);
            $newReferralLevel->setLevel(1);

            $this->entityManager->persist($newReferralLevel);
            $this->entityManager->flush();
        } else {
            $io->warning('Referral level is not inserted. Default level 1 exist.');
        }

        $defaultLevel2 = $this->entityManager->getRepository(ReferralLevel::class)->findOneBy(
            [
                'isDefault' => true,
                'isActive' => true,
                'level' => 2,
            ]
        );

        if(!$defaultLevel2) {
            $newReferralLevel = new ReferralLevel();
            $newReferralLevel->setIsDefault(true);
            $newReferralLevel->setIsActive(true);
            $newReferralLevel->setName("second_level");
            $newReferralLevel->setPercent(1);
            $newReferralLevel->setLevel(2);

            $this->entityManager->persist($newReferralLevel);
            $this->entityManager->flush();
        } else {
            $io->warning('Referral level is not inserted. Default level 2 exist.');
        }

        if(!$defaultLevel1 && !$defaultLevel2) {
            $io->success('Default referral levels have been successfully inserted to database. .');
            return Command::SUCCESS;
        }

        return Command::FAILURE;
    }
}

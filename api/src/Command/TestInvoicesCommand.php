<?php

namespace App\Command;

use App\Entity\Client;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Hackzilla\PasswordGenerator\Generator\ComputerPasswordGenerator;

class TestInvoicesCommand extends Command
{
    /**
     * @var string
     */
    protected static $defaultName = 'test-invoices';
    /**
     * @var EntityManagerInterface $entityManager
     */
    private EntityManagerInterface $entityManager;
    private MailerInterface $mailer;
    private UserPasswordEncoderInterface $passwordEncoder;
    private ComputerPasswordGenerator $generator;

    /**
     * TestInvoicesCommand constructor.
     * @param EntityManagerInterface $entityManager
     * @param string|null $name
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        MailerInterface $mailer,
        UserPasswordEncoderInterface $passwordEncoder,
        string $name = null)
    {
        $this->entityManager = $entityManager;
        $this->mailer = $mailer;
        $this->passwordEncoder = $passwordEncoder;
        $this->generator = new ComputerPasswordGenerator();
        $this->generator->setLength(16);
        parent::__construct($name);
    }

    protected function configure()
    {
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {

        $client = $this->entityManager->getRepository(Client::class)->findOneBy(['email'=> 'den13061985@gmail.com']);

        $template = "client_registration.html.twig";


        $password = $this->generator->generatePassword();
        $client->setGeneratedPassword($password);
        $client->setPassword($this->passwordEncoder->encodePassword($client, $password));

        $email = (new TemplatedEmail())
            ->to($client->getEmail())
            ->subject('Регистрация на сайте')
            ->htmlTemplate("emails/{$template}")
            ->context(['user' => $client, 'password' => $client->getGeneratedPassword()]);

        $this->mailer->send($email);

        $this->entityManager->persist($client);
        $this->entityManager->flush();

        return Command::SUCCESS;
    }
}

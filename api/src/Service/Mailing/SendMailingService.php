<?php


namespace App\Service\Mailing;


use App\Entity\Client;
use App\Entity\Mailing;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\Messenger\SendEmailMessage;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Messenger\Stamp\DelayStamp;

class SendMailingService
{

    /**
     * @var MessageBusInterface
     */
    protected MessageBusInterface $messageBus;
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    protected string $storageDir;

    public function __construct(EntityManagerInterface $entityManager,MessageBusInterface $messageBus, string $storageDir)
    {
        $this->messageBus = $messageBus;
        $this->entityManager = $entityManager;
        $this->storageDir = $storageDir;
    }

    public function sending(Mailing $mailing)
    {
        $clients = $this->entityManager->getRepository(Client::class)->findBy(
            [
                'isEnabled' => true,
                'isBanned' => false
            ]
        );
        $message = htmlspecialchars_decode($mailing->getMessage());
        $time = 2000;
        foreach ($clients as $client) {
            $time += 2000;
            $email = (new TemplatedEmail())
                ->to($client->getEmail())
                ->subject($mailing->getTitle())
                ->htmlTemplate('emails/mailing.html.twig')
                ->context(
                    [
                        'file' => $mailing->getFile(),
                        'message' => $message
                    ]
                );
            $this->messageBus->dispatch(new SendEmailMessage($email), [
                new DelayStamp( $time),
            ]);
        }
    }
}
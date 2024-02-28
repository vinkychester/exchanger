<?php


namespace App\Resolver\CashbackClientLevel;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\CashbackClientLevel;
use App\Entity\CashbackLevel;
use App\Entity\User;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Security\Core\Security;

class UpdateWithLogCashbackClientLevelResolver implements MutationResolverInterface
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var LogServiceODM
     */
    protected LogServiceODM $LogServiceODM;
    /**
     * @var Security
     */
    protected Security $security;
    /**
     * @var MailerInterface
     */
    protected MailerInterface $mailer;

    /**
     * UpdateWithLogCashbackClientLevelResolver constructor.
     * @param EntityManagerInterface $entityManager
     * @param LogServiceODM $LogServiceODM
     * @param Security $security
     * @param MailerInterface $mailer
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        LogServiceODM $LogServiceODM,
        Security $security,
        MailerInterface $mailer
    ) {
        $this->entityManager = $entityManager;
        $this->LogServiceODM = $LogServiceODM;
        $this->security = $security;
        $this->mailer = $mailer;
    }

    public function __invoke($item, array $context)
    {
        $args = $context['args']['input'];
        $cashbackClientLevelID = $args['cashbackClientLevelID'];
        $cashbackLevelID = $args['cashbackLevelID'];

        /** @var CashbackClientLevel $cashbackClientLevel */
        $cashbackClientLevel = $this->entityManager->getRepository(CashbackClientLevel::class)->find(
            $cashbackClientLevelID
        );
        if (!$cashbackClientLevel) {
            return null;
        }

        /** @var CashbackLevel $cashbackLevel */
        $cashbackLevel = $this->entityManager->getRepository(CashbackLevel::class)->find($cashbackLevelID);
        if (!$cashbackLevel) {
            return null;
        }

        $cashbackClientLevel->setCashbackLevel($cashbackLevel);
        $this->entityManager->persist($cashbackClientLevel);
        $this->entityManager->flush();

        $adminEmail = current($this->entityManager->getUnitOfWork()->getIdentityMap()[User::class])->getEmail();

        $message = 'Администратор ' .  $adminEmail . ' изменил кешбэк уровень на ' . $cashbackClientLevel->getCashbackLevel()->getName()
            . ' с процентом ' . $cashbackClientLevel->getCashbackLevel()->getPercent()
            . '  пользователю "' . $cashbackClientLevel->getClient()->getEmail() . '"';

        $this->LogServiceODM->info(
            $message,
            $this->security->getUser()
        );

        $variables = [
            'clientLevelName' => 'кешбэк',
            'adminEmail' => $adminEmail,
            'clientEmail' => $cashbackClientLevel->getClient()->getEmail(),
            'levelName' => $cashbackClientLevel->getCashbackLevel()->getName(),
            'percent' => $cashbackClientLevel->getCashbackLevel()->getPercent(),
        ];
        $this->sendNotification($variables);

        return $cashbackClientLevel;
    }

    /**
     * Администратор [osip.29.1999@gmail.com]
     * изменил кешбэк уровень на [second_cashback_level]
     * с процентом [20] пользователю ["test5@gmail.com"]
     * @param array $variables
     * @throws \Symfony\Component\Mailer\Exception\TransportExceptionInterface
     */
    public function sendNotification(array $variables): void
    {
        $email = (new TemplatedEmail())
            ->to($_ENV['SUPERADMIN_EMAIL'])
            ->subject('Изменение процента кешбэка у пользователя')
            ->htmlTemplate('emails/change_cashback_client_level_percent.html.twig')
            ->context(['variables' => $variables]);

        $this->mailer->send($email);
    }
}
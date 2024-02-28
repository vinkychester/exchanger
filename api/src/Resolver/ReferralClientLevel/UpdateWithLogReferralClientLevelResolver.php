<?php


namespace App\Resolver\ReferralClientLevel;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\ReferralClientLevel;
use App\Entity\ReferralLevel;
use App\Entity\User;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Security\Core\Security;

class UpdateWithLogReferralClientLevelResolver implements MutationResolverInterface
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
     * UpdateWithLogReferralClientLevelResolver constructor.
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
        $referralClientLevelID = $args['referralClientLevelID'];
        $referralLevelID = $args['referralLevelID'];

        /** @var ReferralClientLevel $referralClientLevel */
        $referralClientLevel = $this->entityManager->getRepository(ReferralClientLevel::class)->find(
            $referralClientLevelID
        );
        if (!$referralClientLevel) {
            return null;
        }

        /** @var ReferralLevel $referralLevel */
        $referralLevel = $this->entityManager->getRepository(ReferralLevel::class)->find($referralLevelID);
        if (!$referralLevel) {
            return null;
        }

        $referralClientLevel->setReferralLevel($referralLevel);
        $this->entityManager->persist($referralClientLevel);
        $this->entityManager->flush();

        $adminEmail = current($this->entityManager->getUnitOfWork()->getIdentityMap()[User::class])->getEmail();

        $message = 'Администратор ' .  $adminEmail . ' изменил реферальный уровень на ' . $referralClientLevel->getReferralLevel()->getName()
            . ' с процентом ' . $referralClientLevel->getReferralLevel()->getPercent()
            . '  пользователю "' . $referralClientLevel->getClient()->getEmail() . '"';

        $this->LogServiceODM->info(
            $message,
            $this->security->getUser()
        );

        $variables = [
            'clientLevelName' => 'реферальный',
            'adminEmail' => $adminEmail,
            'clientEmail' => $referralClientLevel->getClient()->getEmail(),
            'levelName' => $referralClientLevel->getReferralLevel()->getName(),
            'percent' => $referralClientLevel->getReferralLevel()->getPercent(),
        ];
        $this->sendNotification($variables);

        return $referralClientLevel;
    }

    /**
     * Администратор [osip.29.1999@gmail.com]
     * изменил кешбэк уровень на [second_referral_level]
     * с процентом [20] пользователю ["test5@gmail.com"]
     * @param array $variables [clientLevelName, adminEmail clientEmail referralName referralPercent
     * @throws \Symfony\Component\Mailer\Exception\TransportExceptionInterface
     */
    public function sendNotification(array $variables): void
    {
        $email = (new TemplatedEmail())
            ->to($_ENV['SUPERADMIN_EMAIL'])
            ->subject('Изменение процента реферального уровня у пользователя')
            ->htmlTemplate('emails/change_referral_client_level_percent.html.twig')
            ->context(['variables' => $variables]);

        $this->mailer->send($email);
    }
}
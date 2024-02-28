<?php


namespace App\EventSubscriber;


use App\Entity\User;
use App\Events\LoginGoogle2FactorFailedAttemptEvent;
use App\Events\LoginUserWithBannEvent;
use App\Events\UserAuthorizationSuccessEvent;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;

/**
 * Class UserAuthorizationSubscriber
 * @package App\EventSubscriber
 */
class UserAuthorizationSubscriber implements EventSubscriberInterface
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
     * @var MailerInterface
     */
    protected MailerInterface $mailer;

    /**
     * PasswordHashSubscriber constructor.
     * @param LogServiceODM $LogServiceODM
     * @param MailerInterface $mailer
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(LogServiceODM $LogServiceODM, MailerInterface $mailer, EntityManagerInterface $entityManager)
    {
        $this->LogServiceODM = $LogServiceODM;
        $this->mailer = $mailer;
        $this->entityManager = $entityManager;
    }

    /**
     * @return array|array[]
     */
    public static function getSubscribedEvents()
    {
        return [
            UserAuthorizationSuccessEvent::class        => ['googleAuthorizedSuccessfully', 50],
            LoginUserWithBannEvent::class               => ['sendNotification', 50],
            LoginGoogle2FactorFailedAttemptEvent::class => ['loginGoogle2FactorFailed', 50],
            Events::AUTHENTICATION_SUCCESS              => ['formAuthorizedSuccessfully', 50]
        ];
    }

    /**
     * @param UserAuthorizationSuccessEvent $event
     * @throws \Exception
     */
    public function googleAuthorizedSuccessfully(UserAuthorizationSuccessEvent $event)
    {
        $this->LogServiceODM->info(
            'Пользователь вошел в систему с помощью ' . $event->getReferrer(),
            $event->getUser()
        );

        $this->entityManager->getRepository(User::class)->updateIsOnline($event->getUser());

    }

    /**
     * @param LoginUserWithBannEvent $event
     * @throws TransportExceptionInterface
     */
    public function sendNotification(LoginUserWithBannEvent $event): void
    {
        $this->LogServiceODM->error(
            'Пользователя заблокировано системой',
            $event->getUser()
        );

        $email = (new TemplatedEmail())
            ->to($_ENV['BANNED_USER_NOTIFICATION_EMAIL'])
            ->subject('Забанен пользователь')
            ->htmlTemplate('emails/login_user_with_bann.html.twig')
            ->context(['user' => $event->getUser()]);

        $this->mailer->send($email);
    }

    /**
     * @param LoginGoogle2FactorFailedAttemptEvent $event
     * @throws \Exception
     */
    public function loginGoogle2FactorFailed(LoginGoogle2FactorFailedAttemptEvent $event): void
    {
        $this->LogServiceODM->error(
            'Пользователь ввел неправильный код двухфакторной авторизации. Количество попыток: ' . $event->getAttempt(),
            $event->getUser()
        );
    }

    /**
     * @param AuthenticationSuccessEvent $event
     * @throws \Exception
     */
    public function formAuthorizedSuccessfully(AuthenticationSuccessEvent $event): void
    {
        $this->LogServiceODM->info(
            'Пользователь вошел в систему с помощью формы авторизации',
            $event->getUser()
        );
    }
}


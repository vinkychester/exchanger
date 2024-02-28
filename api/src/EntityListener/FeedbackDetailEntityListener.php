<?php


namespace App\EntityListener;


use App\Entity\FeedbackDetail;
use App\Entity\FeedbackMessage;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Notifier\ChatterInterface;
use Symfony\Component\Notifier\Message\ChatMessage;
use Symfony\Component\Security\Core\Security;

/**
 * Class FeedbackDetailEntityListener
 * @package App\EntityListener
 */
class FeedbackDetailEntityListener
{
    /**
     * @var MailerInterface
     */
    protected MailerInterface $mailer;
    /**
     * @var Security
     */
    protected Security $security;
    /**
     * @var LogServiceODM
     */
    protected LogServiceODM $logServiceODM;
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var ChatterInterface
     */
    protected ChatterInterface $chatter;

    /**
     * FeedbackDetailEntityListener constructor.
     * @param LogServiceODM $logServiceODM
     * @param Security $security
     * @param MailerInterface $mailer
     * @param EntityManagerInterface $entityManager
     * @param ChatterInterface $chatter
     */
    public function __construct(
        LogServiceODM $logServiceODM,
        Security $security,
        MailerInterface $mailer,
        EntityManagerInterface $entityManager,
        ChatterInterface $chatter
    ) {
        $this->mailer = $mailer;
        $this->security = $security;
        $this->logServiceODM = $logServiceODM;
        $this->entityManager = $entityManager;
        $this->chatter = $chatter;
    }

    /**
     * @param FeedbackDetail $feedbackDetail
     * @param LifecycleEventArgs $eventArgs
     * @throws \Symfony\Component\Mailer\Exception\TransportExceptionInterface
     * @throws \Symfony\Component\Notifier\Exception\TransportExceptionInterface
     */
    public function postPersist(FeedbackDetail $feedbackDetail, LifecycleEventArgs $eventArgs)
    {
        if ($feedbackDetail->getFeedbackMessage()->getType() === FeedbackMessage::CASH) {
            $subject = 'Наличный расчет. Город:' . $feedbackDetail->getFeedbackMessage()->getCity()->getName();
        } else {
            $subject = 'Безналичный расчет';
        }
        $question = $this->entityManager->getRepository(FeedbackDetail::class)->findBy(
            [
                'author' => FeedbackDetail::Client,
                'feedbackMessage' => $feedbackDetail->getFeedbackMessage()
            ], ['createdAt' => 'DESC']
        );

        if ($feedbackDetail->getAuthor() === FeedbackDetail::Manager) {
            $email = (new TemplatedEmail())
                ->to($feedbackDetail->getFeedbackMessage()->getEmail())
                ->from( new Address($_ENV['PROD_LOGIN'], 'Coin24.com.ua'))
                ->subject($subject)
                ->htmlTemplate("emails/feedback-answer.html.twig")
                ->context(
                    [
                        'question' => count($question) ? $question[0]->getMessage() : $feedbackDetail->getFeedbackMessage()->getMessage(),
                        'answer'   => $feedbackDetail->getMessage()
                    ]
                );
            $this->mailer->send($email);
        }
        if ($feedbackDetail->getAuthor() === FeedbackDetail::Client) {
            $message = 'Пользователь обновил тикет '. $subject . ' E-mail ' . $feedbackDetail->getFeedbackMessage()->getEmail();
            $chatMessage = new ChatMessage('');
            $chatMessage->transport($_ENV['APP_ENV'] === 'dev'? "telegram_info" : "telegram_coin_bot");
            $this->chatter->send($chatMessage->subject($message));
        }
    }
}

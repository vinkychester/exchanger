<?php


namespace App\EntityListener;


use App\Entity\FeedbackMessage;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Component\Notifier\ChatterInterface;
use Symfony\Component\Notifier\Message\ChatMessage;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Mercure\PublisherInterface;
use Symfony\Component\Mercure\Update;


class FeedbackMessageEntityListener
{


    /**
     * @var LogServiceODM
     */
    protected LogServiceODM $logServiceODM;
    /**
     * @var Security
     */
    protected Security $security;
    /**
     * @var ChatterInterface
     */
    protected ChatterInterface $chatter;
    /**
     * @var PublisherInterface
     */
    protected PublisherInterface $publisher;

    /**
     * FeedbackMessageEntityListener constructor.
     * @param LogServiceODM $logServiceODM
     * @param Security $security
     * @param ChatterInterface $chatter
     * @param PublisherInterface $publisher
     */
    public function __construct(
        LogServiceODM $logServiceODM,
        Security $security,
        ChatterInterface $chatter,
        PublisherInterface $publisher
    ) {
        $this->logServiceODM = $logServiceODM;
        $this->security = $security;
        $this->chatter = $chatter;
        $this->publisher = $publisher;
    }

    /**
     * @param FeedbackMessage $feedbackMessage
     * @throws \Symfony\Component\Notifier\Exception\TransportExceptionInterface
     * @throws \Exception
     */
    public function postPersist(FeedbackMessage $feedbackMessage)
    {
        $publisher = $this->publisher;
        $update = new Update(FeedbackMessage::FEEDBACK_TOPIC, json_encode(['message' => $feedbackMessage->getId()]));
        $publisher($update);
        switch ($feedbackMessage->getType()) {
            case FeedbackMessage::BANK:
                $message = 'Пользователь создал тикет на Безналичный расчет E-mail ' . $feedbackMessage->getEmail();
                break;
            case FeedbackMessage::CASH:
                $message = 'Пользователь создал тикет на Наличный расчет. Город:' . $feedbackMessage->getCity()->getName() . ' E-mail ' . $feedbackMessage->getEmail();
                break;
        }

        $chatMessage = new ChatMessage('');
        $chatMessage->transport($_ENV['APP_ENV'] === 'dev'? "telegram_info" : "telegram_coin_bot");
        $this->chatter->send($chatMessage->subject($message));
        $this->logServiceODM->info($message, $this->security->getUser());

    }

    /**
     * @param FeedbackMessage $feedbackMessage
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postUpdate(FeedbackMessage $feedbackMessage, LifecycleEventArgs $eventArgs)
    {
        $publisher = $this->publisher;
        $update = new Update(FeedbackMessage::FEEDBACK_TOPIC, json_encode(['message' => $feedbackMessage->getId()]));
        $publisher($update);
        $changeSets = $eventArgs->getEntityManager()->getUnitOfWork()->getEntityChangeSet($feedbackMessage);
        if ($feedbackMessage->getType() == FeedbackMessage::CASH) {
            $subject = 'Наличный расчет. Город:' . $feedbackMessage->getCity()->getName();
        } else {
            $subject = 'Безналичный расчет';
        }

        if (isset($changeSets['status'])) {
            switch ($changeSets['status'][1]) {
                case FeedbackMessage::WELL_DONE:
                    $message = 'Тикет ' . $subject .' E-mail ' . $feedbackMessage->getEmail() . ' отмеченый как "Обработан"';
                    break;
                case FeedbackMessage::NOT_VIEWED:
                    $message = 'Тикет ' . $subject .' E-mail ' . $feedbackMessage->getEmail() . ' имеет новое сообщение';
                    break;
                case FeedbackMessage::VIEWED:
                    $message = 'Тикет ' . $subject .' E-mail ' . $feedbackMessage->getEmail() . ' просмотрен';
                    break;
            }
        }
        if (isset($changeSets['deleted'])) {
            switch ($changeSets['deleted'][1]) {
                case true:
                    $message = 'Тикет ' . $subject .' E-mail ' . $feedbackMessage->getEmail() . ' удален';
                    break;
                case false:
                    $message = 'Тикет ' . $subject .' E-mail ' . $feedbackMessage->getEmail() . ' востановлен';
                    break;
            }
        }
        $this->logServiceODM->info($message, $this->security->getUser());
    }

    /**
     * @param FeedbackMessage $feedbackMessage
     * @throws \Exception
     */
    public function postRemove(FeedbackMessage $feedbackMessage)
    {
        if ($feedbackMessage->getType() == FeedbackMessage::CASH) {
            $subject = 'Наличный расчет. Город:' . $feedbackMessage->getCity()->getName();
        } else {
            $subject = 'Безналичный расчет';
        }

        $this->logServiceODM->info('Тикет ' . $subject .' E-mail ' . $feedbackMessage->getEmail() . ' удален полностью', $this->security->getUser());
    }
}
<?php


namespace App\EntityListener;


use App\Entity\Mailing;
use App\Message\SendMailing;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Security\Core\Security;

class MailingEntityListener
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
     * @var MailerInterface
     */
    protected MailerInterface $mailer;
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var MessageBusInterface
     */
    protected MessageBusInterface $messageBus;
    /**
     * @var string
     */
    protected string $mailingFileDir;

    /**
     * MailingEntityListener constructor.
     * @param LogServiceODM $logServiceODM
     * @param Security $security
     * @param MailerInterface $mailer
     * @param EntityManagerInterface $entityManager
     * @param string $mailingFileDir
     * @param MessageBusInterface $messageBus
     */
    public function __construct(
        LogServiceODM $logServiceODM,
        Security $security,
        MailerInterface $mailer,
        EntityManagerInterface $entityManager,
        string $mailingFileDir,
        MessageBusInterface $messageBus
    ) {
        $this->logServiceODM = $logServiceODM;
        $this->security = $security;
        $this->mailer = $mailer;
        $this->entityManager = $entityManager;
        $this->messageBus = $messageBus;
        $this->mailingFileDir = $mailingFileDir;
    }

    /**
     * @param Mailing $mailing
     * @throws \Exception
     */
    public function postPersist(Mailing $mailing)
    {
        $user = $this->security->getUser();
        $this->logServiceODM->info('Администратор создал рассылку с темой ' . $mailing->getTitle(), $user);
    }

    /**
     * @param Mailing $mailing
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postUpdate(Mailing $mailing, LifecycleEventArgs $eventArgs)
    {
        $user = $this->security->getUser();

        $message = 'щось пропустив';

        $changeSets = $eventArgs->getEntityManager()->getUnitOfWork()->getEntityChangeSet($mailing);
        if (isset($changeSets['status']) && $changeSets['status'][1] === true) {
            $message = 'Администратор начал рассылку с темой ' . $mailing->getTitle();
            $this->messageBus->dispatch(new SendMailing($mailing));
        }
        if (isset($changeSets['status']) && $changeSets['status'][1] === false) {
            $message = 'Рассылка с темой ' . $mailing->getTitle() . ' закончена';
        }
        if(isset($changeSets['title'])) {
            $message = 'Администратор редактировал рассылку. Изменил тему с ' . $changeSets['title'][0] . ' на ' . $changeSets['title'][1] ;
        }
        if(isset($changeSets['message'])) {
            $message = 'Администратор редактировал рассылку. Изменил сообщение с ' . $changeSets['message'][0] . ' на ' . $changeSets['message'][1] ;
        }

        if(isset($changeSets['file'])) {
            $message = 'Администратор редактировал рассылку. Изменил картинку' ;
            if ($changeSets['file'][0]) {
                unlink($this->mailingFileDir . $changeSets['file'][0] );
            }
        }

        $this->logServiceODM->info($message, $user);
    }

}
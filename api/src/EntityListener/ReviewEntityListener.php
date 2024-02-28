<?php


namespace App\EntityListener;

use App\Entity\Review;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Component\Mercure\PublisherInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Security\Core\Security;

/**
 * Class ReferralLevelEntityListener
 * @package App\EntityListener
 */
class ReviewEntityListener
{
    /**
     * @var LogServiceODM
     */
    protected LogServiceODM $LogServiceODM;
    /**
     * @var Security
     */
    protected Security $security;
    /**
     * @var PublisherInterface
     */
    protected PublisherInterface $publisher;

    /**
     * UserImageEntityListener constructor.
     * @param LogServiceODM $LogServiceODM
     * @param Security $security
     * @param PublisherInterface $publisher
     */
    public function __construct(LogServiceODM $LogServiceODM, Security $security, PublisherInterface $publisher)
    {
        $this->LogServiceODM = $LogServiceODM;
        $this->security = $security;
        $this->publisher = $publisher;
    }

    public function postPersist(Review $review)
    {
        $publisher = $this->publisher;
        $update = new Update(Review::REVIEW_TOPIC, json_encode(['message' => $review->getId()]));
        $publisher($update);
    }

    /**
     * @param Review $review
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postUpdate(Review $review, LifecycleEventArgs $eventArgs)
    {
        $publisher = $this->publisher;
        $update = new Update(Review::REVIEW_TOPIC, json_encode(['message' => $review->getId()]));
        $publisher($update);
        $changeSets = $eventArgs->getEntityManager()->getUnitOfWork()->getEntityChangeSet($review);

        if (isset($changeSets['publish'])) {
            $message = 'Администратор обработал отзыв клиента "' . $review->getId() . '" на ' .
                (($changeSets['publish'][1] == 1) ? '"Опубликовал"' : '"Не опубликовал"');
        } else {
            $message = 'Администратор обработал отзыв клиента  "' . $review->getId() . '" и изменил ' .
                implode(', ', array_keys($changeSets));
        }

        $this->LogServiceODM->info(
            $message,
            $this->security->getUser()
        );
    }

    /**
     * @param Review $review
     * @throws \Exception
     */
    public function preRemove(Review $review)
    {
        $this->LogServiceODM->info(
            'Администратор удалил отзыв клиента ' . $review->getId(),
            $this->security->getUser()
        );
    }
}

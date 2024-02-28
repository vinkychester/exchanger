<?php


namespace App\EntityListener;


use App\Entity\Post;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Component\Security\Core\Security;

/**
 * Class PostEntityListener
 * @package App\EntityListener
 */
class PostEntityListener
{
    /**
     * @var LogServiceODM
     */
    protected LogServiceODM $LogServiceODM;
    /**
     * @var Security
     */
    protected Security $security;
    private string $postDir;

    /**
     * UserImageEntityListener constructor.
     * @param LogServiceODM $LogServiceODM
     * @param Security $security
     * @param string $postDir
     */
    public function __construct(LogServiceODM $LogServiceODM, Security $security, string $postDir)
    {
        $this->LogServiceODM = $LogServiceODM;
        $this->security = $security;
        $this->postDir = $postDir;
    }

    /**
     * @param Post $post
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postPersist(Post $post, LifecycleEventArgs $eventArgs)
    {
        $this->LogServiceODM->info(
            'Администратор создал новость ' . $post->getMetaTitle(),
            $this->security->getUser()
        );
    }

    /**
     * @param Post $post
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postUpdate(Post $post, LifecycleEventArgs $eventArgs)
    {
        $changeSets = $eventArgs->getEntityManager()->getUnitOfWork()->getEntityChangeSet($post);

        if (isset($changeSets['publish'])) {
            $message = 'Администратор изменил статус публикации новости "' . $post->getMetaTitle() . '" на ' .
                (($changeSets['publish'][1] == 1) ? '"Опубликована"' : '"Не опубликована"');
        } else {
            $message = 'Администратор отредактировал новость "' . $post->getMetaTitle() . '" и изменил ' .
                implode(', ', array_keys($changeSets));
        }
        $this->LogServiceODM->info(
            $message,
            $this->security->getUser()
        );
    }

    /**
     * @param Post $post
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postRemove(Post $post, LifecycleEventArgs $eventArgs)
    {
        $this->LogServiceODM->info(
            ' Администратор удалил новость ' . $post->getMetaTitle(),
            $this->security->getUser()
        );
        if (count($post->getMediaObjects()) !== 0) {
            $dir = $this->postDir . $post->getMediaObjects()->first()->getStorage();
            array_map('unlink', glob("$dir/*.*"));
            rmdir($dir);
        }
    }
}

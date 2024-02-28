<?php


namespace App\EntityListener;

use App\Entity\SystemImage;
use App\Service\Log\LogServiceODM;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Component\Security\Core\Security;

/**
 * Class UserImageEntityListener
 * @package App\EntityListener
 */
class SystemImageEntityListener
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
     * UserImageEntityListener constructor.
     * @param LogServiceODM $LogServiceODM
     * @param Security $security
     */
    public function __construct(LogServiceODM $LogServiceODM, Security $security)
    {
        $this->LogServiceODM = $LogServiceODM;
        $this->security = $security;
    }

    /**
     * @param SystemImage $userImage
     * @param LifecycleEventArgs $eventArgs
     * @throws \Exception
     */
    public function postUpdate(SystemImage $userImage, LifecycleEventArgs $eventArgs): void
    {
//        if ($userImage->getType() === 'avatar') {
//            $this->LogServiceODM->info(
//                'Пользователь изменил фотографию',
//                $this->security->getUser()
//            );
//        }
    }
}

<?php


namespace App\Factory\Account\Media;


use App\Service\Image\ClientAvatarMediaService;
use App\Service\Image\ImageService;
use App\Service\Image\SystemImageMediaService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Security\Core\Security;

/**
 * Class ImageMediaFactory
 * @package App\Factory\Account\Media
 */
class ImageMediaFactory
{
    /**
     * @var string|\Stringable|\Symfony\Component\Security\Core\User\UserInterface
     */
    protected $user;
    /**
     * @var ImageService
     */
    protected ImageService $imageService;
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var Security
     */
    protected Security $security;

    /**
     * ImageMediaFactory constructor.
     * @param Security $security
     * @param ImageService $imageService
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(
        Security $security,
        ImageService $imageService,
        EntityManagerInterface $entityManager
    ) {
        $this->user = $security->getUser();
        $this->imageService = $imageService;
        $this->entityManager = $entityManager;
    }

    /**
     * @param $imageMediaType
     * @return ClientAvatarMediaService
     */
    public function getService($imageMediaType)
    {
        if (!$imageMediaType) {
            throw new ResourceNotFoundException('Image Resource "type" is not set');
        }

        switch ($imageMediaType) {
            case 'avatar':
            {
                if (!$this->user) {
                    throw new AccessDeniedException();
                }

                return new ClientAvatarMediaService($this->imageService, $this->entityManager);
                break;
            }
            case 'system':
            {
                return new SystemImageMediaService($this->imageService, $this->entityManager);
                break;
            }
        }
    }
}

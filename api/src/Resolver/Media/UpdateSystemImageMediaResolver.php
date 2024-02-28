<?php


namespace App\Resolver\Media;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Factory\Account\Media\ImageMediaFactory;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * Class ClientUpdateImageMediaResolver
 * @package App\Resolver\Media
 */
class UpdateSystemImageMediaResolver implements MutationResolverInterface
{
    /**
     * @var TokenStorageInterface
     */
    protected TokenStorageInterface $tokenManager;
    /**
     * @var ImageMediaFactory
     */
    protected ImageMediaFactory $imageMediaFactory;
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * AccountDetailsResolver constructor.
     * @param TokenStorageInterface $tokenManager
     * @param ImageMediaFactory $imageMediaFactory
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(
        TokenStorageInterface $tokenManager,
        ImageMediaFactory $imageMediaFactory,
        EntityManagerInterface $entityManager
    ) {
        $this->tokenManager = $tokenManager;
        $this->imageMediaFactory = $imageMediaFactory;
        $this->entityManager = $entityManager;
    }

    /**
     * @param object|null $item
     * @param array $context
     * @return object|null
     * @throws \Safe\Exceptions\FilesystemException
     */
    public function __invoke($item, array $context)
    {
        $inputs = $context['args']['input'];
        $object = $this->entityManager
            ->getRepository('App:' . ucfirst($inputs['target']))
            ->find($inputs['targetId']);

        return $this->imageMediaFactory->getService('system')
            ->upload($inputs['contentUrl'], $inputs['type'], $object, $inputs['mediaId'] ?? null, $inputs['filePath'] ?? null);
    }
}

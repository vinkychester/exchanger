<?php


namespace App\Resolver\Media;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Factory\Account\Media\ImageMediaFactory;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * Class ClientUpdateImageMediaResolver
 * @package App\Resolver\Media
 */
class ClientUpdateImageMediaResolver implements MutationResolverInterface
{
    /**
     * @var ImageMediaFactory
     */
    protected ImageMediaFactory $imageMediaFactory;
    /**
     * @var Security
     */
    protected Security $security;
    protected ?UserInterface $user;

    /**
     * AccountDetailsResolver constructor.
     * @param Security $security
     * @param ImageMediaFactory $imageMediaFactory
     */
    public function __construct(
        Security $security,
        ImageMediaFactory $imageMediaFactory
    ) {
        $this->imageMediaFactory = $imageMediaFactory;
        $this->user = $security->getUser();
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
        $mediaItemService = $this->imageMediaFactory->getService($inputs['type']);

        return $mediaItemService->upload(
            $inputs['contentUrl'],
            $inputs['type'],
            $this->user
        );
    }
}

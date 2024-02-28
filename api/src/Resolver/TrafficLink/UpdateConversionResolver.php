<?php


namespace App\Resolver\TrafficLink;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Service\TrafficLinks\TrafficLinksService;
use Symfony\Component\Security\Core\Security;

/**
 * Class UpdateConversionResolver
 * @package App\Resolver\TrafficLink
 */
class UpdateConversionResolver implements MutationResolverInterface
{
    /**
     * @var TrafficLinksService
     */
    protected TrafficLinksService $trafficLinksService;
    /**
     * @var Security
     */
    protected Security $security;

    /**
     * UpdateConversionResolver constructor.
     * @param TrafficLinksService $trafficLinksService
     * @param Security $security
     */
    public function __construct(
        TrafficLinksService $trafficLinksService,
        Security $security
    ) {
        $this->trafficLinksService = $trafficLinksService;
        $this->security = $security;
    }

    /**
     * @param object|null $item
     * @param array $context
     * @return object|void|null
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function __invoke($item, array $context)
    {
        $token = $context['args']['input'];

        $this->trafficLinksService->updateClickConversion($token);
    }
}

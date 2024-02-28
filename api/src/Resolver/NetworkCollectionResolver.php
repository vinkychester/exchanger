<?php


namespace App\Resolver;


use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;
use App\Entity\Network;
use App\Entity\PairUnit;
use Doctrine\ORM\EntityManagerInterface;
use ItlabStudio\ApiClient\Service\ApiClient;

class NetworkCollectionResolver implements QueryCollectionResolverInterface
{
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;
    /**
     * @var ApiClient
     */
    private ApiClient $apiClient;

    /**
     * NetworkCollectionResolver constructor.
     * @param EntityManagerInterface $entityManager
     * @param ApiClient $apiClient
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        ApiClient $apiClient
    ) {
        $this->entityManager = $entityManager;
        $this->apiClient = $apiClient;
    }

    /**
     * @param iterable<Network> $collection
     *
     * @return iterable<Network>
     */
    public function __invoke(iterable $collection, array $context): iterable
    {
        $collection = [];
        $args = $context['args'];
        $externalId = $args['external_id'];

        /** @var PairUnit $pairUnit */
        $pairUnit = $this->entityManager->getRepository(PairUnit::class)->find($args['pairUnit_id']);

        $class = ucfirst($pairUnit->getDirection());
        $mcCashResponse = $this->apiClient->ControlPanel()->$class()->external([
            "paymentSystem" => $pairUnit->getPaymentSystem()->getSubName(),
            "currency"      => $pairUnit->getCurrency()->getAsset(),
            "connection"    => $_ENV['CP_MICC_CONNECTION']
        ])->getData()->first()->getData();

        array_walk($mcCashResponse, static function ($value) use (&$collection, $externalId) {
            $cities = $value->getCities();
            array_walk($cities, static function ($city) use (&$collection, $externalId, $value) {
                $item = $city->getCity();
                if ($item->getId() === $externalId) {
                    $mcCashNetworkResponse = $value->getNetwork();
                    $network = new Network();
                    $network
                        ->setName($mcCashNetworkResponse->getName())
                        ->setExternalId($mcCashNetworkResponse->getId())
                        ->setAttributes($mcCashNetworkResponse->getAttributes())
                        ->setType($mcCashNetworkResponse->getType());
                    $collection[] = $network;
                }
            });
        });

        return $collection;
    }
}
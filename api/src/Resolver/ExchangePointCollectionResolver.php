<?php


namespace App\Resolver;


use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;
use App\Entity\ExchangePoint;
use App\Entity\PairUnit;
use Doctrine\ORM\EntityManagerInterface;
use ItlabStudio\ApiClient\Service\ApiClient;

/**
 * Class ExchangePointCollectionResolver
 * @package App\Resolver
 */
class ExchangePointCollectionResolver implements QueryCollectionResolverInterface
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
     * @param iterable<ExchangePoint> $collection
     *
     * @return iterable<ExchangePoint>
     */
    public function __invoke(iterable $collection, array $context): iterable
    {
        $collection = [];
        $args = $context['args'];
        $networkId = $args['network_id'];
        $city_id = $args['city_id'];

        /** @var PairUnit $pairUnit */
        $pairUnit = $this->entityManager->getRepository(PairUnit::class)->find($args['pairUnit_id']);

        $class = ucfirst($pairUnit->getDirection());
        $mcCashResponse = $this->apiClient->ControlPanel()->$class()->external([
            "paymentSystem" => $pairUnit->getPaymentSystem()->getSubName(),
            "currency"      => $pairUnit->getCurrency()->getAsset(),
            "connection"    => $_ENV['CP_MICC_CONNECTION']
        ])->getData()->first()->getData();

        array_walk($mcCashResponse, static function ($value) use (&$collection, $networkId, $city_id) {
            $network = $value->getNetwork();
            if ($network->getId() === $networkId) {
                $cities = $value->getCities();
                array_walk($cities, static function ($city) use (&$collection, $city_id) {
                    if ($city->getCity()->getId() === $city_id) {
                        $exchangePoints = $city->getExchangePoints();
                        array_walk($exchangePoints, static function ($exchangePointItem) use (&$collection) {
                            $exchangePoint = new ExchangePoint();
                            $exchangePoint
                                ->setName($exchangePointItem->getName())
                                ->setDescription($exchangePointItem->getDescription())
                                ->setAddress($exchangePointItem->getAddress())
                                ->setExternalId($exchangePointItem->getId());
                            $collection[] = $exchangePoint;
                        });
                    }
                });
            }
        });
        return $collection;
    }
}
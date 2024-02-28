<?php


namespace App\Resolver\City;


use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;
use App\Entity\City;
use App\Entity\PairUnit;
use Doctrine\ORM\EntityManagerInterface;
use ItlabStudio\ApiClient\Service\ApiClient;
use stdClass;

class CityCollectionResolver implements QueryCollectionResolverInterface
{
    /**
     * @var ApiClient
     */
    private ApiClient $apiClient;
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    /**
     * CityCollectionResolver constructor.
     * @param ApiClient $apiClient
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(
        ApiClient $apiClient,
        EntityManagerInterface $entityManager
    )
    {
        $this->apiClient = $apiClient;
        $this->entityManager = $entityManager;
    }

    /**
     * @param iterable<City> $collection
     *
     * @return iterable<City>
     */
    public function __invoke(iterable $collection, array $context): iterable
    {
        $collection = [];
        $args = $context['args'];
        $pairUnitId = $args['pairUnit_id'];
        $direction = $args['direction'];

        /** @var PairUnit $pairUnit */
        $pairUnit = $this->entityManager->getRepository(PairUnit::class)->find($pairUnitId);

        $class = ucfirst($direction);
        $mcCashResponse = $this->apiClient->ControlPanel()->$class()->external([
            "paymentSystem" => $pairUnit->getPaymentSystem()->getSubName(),
            "currency"      => $pairUnit->getCurrency()->getAsset(),
            "connection"    => $_ENV['CP_MICC_CONNECTION']
        ])->getData()->first()->getFetchingCities();

        array_walk($mcCashResponse, static function ($value) use (&$collection) {
            $city = new City();
            $city->setName($value->getName())
                ->setExternalId($value->getId())
                ->setTransliteName($value->getTranslateName());
            $collection[] = $city;
        });

        return $collection;
    }
}
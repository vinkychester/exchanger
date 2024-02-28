<?php


namespace App\Resolver\City;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use ItlabStudio\ApiClient\Service\ApiClient;

/**
 * Class ExchangePointResolver
 * @package App\Resolver\City
 */
class ExchangePointResolver implements MutationResolverInterface
{
    /**
     * @var ApiClient
     */
    protected ApiClient $apiClient;

    /**
     * ExchangePointResolver constructor.
     * @param ApiClient $apiClient
     */
    public function __construct(ApiClient $apiClient)
    {
        $this->apiClient = $apiClient;
    }

    /**
     * @param object|null $item
     * @param array $context
     * @return object|null
     */
    public function __invoke($item, array $context)
    {
        $input = $context['args']['input'];

        $id = $input['id'];
        $cityId = $input['cityId'];
        $networkId = $input['networkId'];

        $networks = $item->getNetworks()->toArray();

        $networkExternalId = $networks[0]->getExternalId();

        $networkResponse = $this->apiClient->ControlPanel()->Payment()->external(
            [
                "connection" => $_ENV['CP_MICC_CONNECTION']
            ]
        )->getData()->first();

        foreach ($networkResponse->getData() as $network) {
            if ($network['network']['id'] == (int)$networkExternalId) {
                foreach ($network['cities'] as $city) {
                    if ($city['city']['id'] == $item->getExternalId()) {
                        $item->setExchangePoints($city['exchangePoints']);
                    }
                }
            }
        }

        return $item;
    }
}

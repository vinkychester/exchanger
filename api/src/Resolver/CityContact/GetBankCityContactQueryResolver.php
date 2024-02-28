<?php


namespace App\Resolver\CityContact;


use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use App\Repository\CityContactRepository;

class GetBankCityContactQueryResolver implements QueryItemResolverInterface
{

    /**
     * @var CityContactRepository
     */
    protected CityContactRepository $cityContactRepository;

    /**
     * GetBankCityContactQueryResolver constructor.
     * @param CityContactRepository $cityContactRepository
     */
    public function __construct(CityContactRepository $cityContactRepository) {
        $this->cityContactRepository = $cityContactRepository;
    }

    public function __invoke($item, array $context)
    {
        return $this->cityContactRepository->findOneBy(['type' => 'bank']);
    }
}
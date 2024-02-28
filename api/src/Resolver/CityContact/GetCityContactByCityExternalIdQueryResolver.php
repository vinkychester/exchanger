<?php


namespace App\Resolver\CityContact;


use ApiPlatform\Core\GraphQl\Resolver\QueryItemResolverInterface;
use App\Entity\City;
use App\Repository\CityContactRepository;
use Doctrine\ORM\EntityManagerInterface;

class GetCityContactByCityExternalIdQueryResolver implements QueryItemResolverInterface
{
    /**
     * @var CityContactRepository
     */
    protected CityContactRepository $cityContactRepository;
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    /**
     * GetBankCityContactQueryResolver constructor.
     * @param CityContactRepository $cityContactRepository
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(CityContactRepository $cityContactRepository, EntityManagerInterface $entityManager)
    {
        $this->cityContactRepository = $cityContactRepository;
        $this->entityManager = $entityManager;
    }

    public function __invoke($item, array $context)
    {
        $args = $context['args'];
        $cityExternalId = $args['cityExternalId'];

        $city = $this->entityManager->getRepository(City::class)->findOneBy(['externalId' => $cityExternalId]);
        if (!$city) {
            throw new \RuntimeException('Such city not found!');
        }

        return $this->cityContactRepository->findOneBy(['city' => $city]);
    }
}
<?php


namespace App\Resolver\CityContact;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\CityContact;
use App\Repository\CityContactRepository;
use Doctrine\ORM\EntityManagerInterface;

class CreateBankMutationResolver implements MutationResolverInterface
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var CityContactRepository
     */
    protected CityContactRepository $cityContactRepository;

    /**
     * CreateBankMutationResolver constructor.
     * @param EntityManagerInterface $entityManager
     * @param CityContactRepository $cityContactRepository
     */
    public function __construct(EntityManagerInterface $entityManager, CityContactRepository $cityContactRepository) {
        $this->entityManager = $entityManager;
        $this->cityContactRepository = $cityContactRepository;
    }

    public function __invoke($item, array $context)
    {
        $bank = $this->cityContactRepository->findOneBy(['type' => 'bank']);
        if (!$bank) {
            return $this->cityContactRepository->createCityContact(null, CityContact::TYPE_BANK, false);
        }

        return $bank;
    }
}
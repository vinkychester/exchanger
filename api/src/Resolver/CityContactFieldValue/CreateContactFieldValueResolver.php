<?php


namespace App\Resolver\CityContactFieldValue;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\City;
use App\Entity\CityContact;
use App\Entity\CityContactField;
use App\Repository\CityContactFieldValueRepository;
use App\Repository\CityContactRepository;
use Doctrine\ORM\EntityManagerInterface;

class CreateContactFieldValueResolver implements MutationResolverInterface
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
     * @var CityContactFieldValueRepository
     */
    protected CityContactFieldValueRepository $cityContactFieldValueRepository;

    /**
     * CreateContactFieldValueResolver constructor.
     * @param EntityManagerInterface $entityManager
     * @param CityContactRepository $cityContactRepository
     * @param CityContactFieldValueRepository $cityContactFieldValueRepository
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        CityContactRepository $cityContactRepository,
        CityContactFieldValueRepository $cityContactFieldValueRepository
    ) {
        $this->entityManager = $entityManager;
        $this->cityContactRepository = $cityContactRepository;
        $this->cityContactFieldValueRepository = $cityContactFieldValueRepository;
    }

    public function __invoke($item, array $context)
    {
        $args = $context['args']['input'];
        $cityID = $args['cityID'];
        $fieldID = $args['fieldID'];
        $fieldValue = $args['fieldValue'];

        $cityContact = null;

        if($cityID === "bank") {
            $cityContact = $this->cityContactRepository->findOneBy(["city" => null]);
            if (!$cityContact) {
                $cityContact = $this->cityContactRepository->createCityContact(null, CityContact::TYPE_BANK);
            }
        } else {
            $city = $this->entityManager->getRepository(City::class)->find($cityID);
            if(!$city) {
                return null;
            }

            $cityContact = $this->cityContactRepository->findOneBy(['city' => $city]);
            if (!$cityContact) {
                $cityContact = $this->cityContactRepository->createCityContact($city);
            }
        }

        $field = $this->entityManager->getRepository(CityContactField::class)->find($fieldID);
        $cityContactFieldValue = $this->cityContactFieldValueRepository->findOneBy(
            [
                'cityContact'      => $cityContact,
                'cityContactField' => $field
            ]
        );

        if(!$cityContactFieldValue) {
            return $this->cityContactFieldValueRepository->createCityContactFieldValue($cityContact, $field, $fieldValue);
        }

        return $this->cityContactFieldValueRepository->updateCityContactFieldValue($cityContactFieldValue, $field, $fieldValue);
    }
}
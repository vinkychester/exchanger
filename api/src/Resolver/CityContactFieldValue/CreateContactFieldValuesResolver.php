<?php


namespace App\Resolver\CityContactFieldValue;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\City;
use App\Entity\CityContact;
use App\Entity\CityContactField;
use App\Repository\CityContactFieldValueRepository;
use App\Repository\CityContactRepository;
use Doctrine\ORM\EntityManagerInterface;

class CreateContactFieldValuesResolver implements MutationResolverInterface
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

    //Used for city contact form
    public function __invoke($item, array $context)
    {
        $args = $context['args']['input'];
        $cityID = $args['cityID'];
        $isPublic = $args['isPublic'];
        $contactNames = $args['contactNames'];
        $contactValues = $args['contactValues'];

        $cityContact = null;
        if ($cityID === "bank") {
            $cityContact = $this->cityContactRepository->findOneBy(["city" => null]);
            if (!$cityContact) {
                $cityContact = $this->cityContactRepository->createCityContact(null, CityContact::TYPE_BANK, $isPublic);
            }
        } else {
            $city = $this->entityManager->getRepository(City::class)->find($cityID);
            if (!$city) {
                return null;
            }

            $cityContact = $this->cityContactRepository->findOneBy(['city' => $city]);
            if (!$cityContact) {
                $cityContact = $this->cityContactRepository->createCityContact(
                    $city,
                    CityContact::TYPE_CASH,
                    $isPublic
                );
            }
        }

        $contactFields = array_combine($contactNames, $contactValues);
        $existedFields = $this->entityManager->getRepository(CityContactField::class)->findAll();
        foreach ($contactFields as $field => $value) {
            $currentField = null;
            foreach ($existedFields as $existedField) {
                if ($existedField->getName() === $field) {
                    $currentField = $existedField;
                }
            }

            $this->cityContactFieldValueRepository->createCityContactFieldValue($cityContact, $currentField, $value);
        }

        return null;
    }
}
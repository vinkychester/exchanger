<?php

namespace App\Repository;

use App\Entity\CityContactFieldValue;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method CityContactFieldValue|null find($id, $lockMode = null, $lockVersion = null)
 * @method CityContactFieldValue|null findOneBy(array $criteria, array $orderBy = null)
 * @method CityContactFieldValue[]    findAll()
 * @method CityContactFieldValue[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CityContactFieldValueRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CityContactFieldValue::class);
    }

    /**
     * @param $cityContact
     * @param $field
     * @param $fieldValue
     * @return CityContactFieldValue
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function createCityContactFieldValue($cityContact, $field, $fieldValue) {
        $cityContactFieldValue = new CityContactFieldValue();

        $cityContactFieldValue->setCityContact($cityContact);
        $cityContactFieldValue->setCityContactField($field);
        $cityContactFieldValue->setValue($fieldValue);

        $this->_em->persist($cityContactFieldValue);
        $this->_em->flush();

        return $cityContactFieldValue;
    }

    /**
     * @param CityContactFieldValue $cityContactFieldValue
     * @param $field
     * @param $fieldValue
     * @return CityContactFieldValue
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function updateCityContactFieldValue(CityContactFieldValue $cityContactFieldValue, $field, $fieldValue) {
        $cityContactFieldValue->setCityContactField($field);
        $cityContactFieldValue->setValue($fieldValue);

        $this->_em->persist($cityContactFieldValue);
        $this->_em->flush();

        return $cityContactFieldValue;
    }
}

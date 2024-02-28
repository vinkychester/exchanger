<?php

namespace App\Repository;

use App\Entity\CityContact;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method CityContact|null find($id, $lockMode = null, $lockVersion = null)
 * @method CityContact|null findOneBy(array $criteria, array $orderBy = null)
 * @method CityContact[]    findAll()
 * @method CityContact[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CityContactRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CityContact::class);
    }

    public function createCityContact($city, $type = CityContact::TYPE_CASH, $isPublic = false) {
        $cityContact = new CityContact();

        $cityContact->setCity($city);
        $cityContact->setType($type);
        $cityContact->setIsPublic($isPublic);

        if($city) {
            $city->setCityContact($cityContact);
            $this->_em->persist($city);
        }

        $this->_em->persist($cityContact);

        $this->_em->flush();

        return $cityContact;
    }

    // /**
    //  * @return CityContact[] Returns an array of CityContact objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?CityContact
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}

<?php

namespace App\Repository;

use App\Entity\Attribute;
use App\Entity\BankDetail;
use App\Entity\Client;
use App\Entity\PairUnit;
use App\Entity\Requisition;
use Calculation\Utils\Exchange\PairUnitInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Attribute|null find($id, $lockMode = null, $lockVersion = null)
 * @method Attribute|null findOneBy(array $criteria, array $orderBy = null)
 * @method Attribute[]    findAll()
 * @method Attribute[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AttributeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Attribute::class);
    }

    /**
     * @param PairUnitInterface $pairUnit
     * @param Client $client
     * @param array $attribute
     * @param string $direction
     * @return int|mixed|string|null
     * @throws NonUniqueResultException
     */
    public function findAttribute(PairUnitInterface $pairUnit, Client $client, array $attribute, string $direction)
    {
        return $this->createQueryBuilder("attribute")
            ->innerJoin("attribute.bankDetail", "bankDetail", "with", "bankDetail.id = attribute.bankDetail")
            ->innerJoin("bankDetail.pairUnit", "pairUnit", "with", "pairUnit.id = bankDetail.pairUnit")
            ->innerJoin("bankDetail.client", "client", "with", "client.id = bankDetail.client")
            ->where("attribute.name = :name")
            ->andWhere("attribute.value = :value")
            ->andWhere("attribute.isHidden = :isHidden")
            ->andWhere("attribute.information = :information")
            ->andWhere("pairUnit = :pairUnit")
            ->andWhere("client = :client")
            ->andWhere("bankDetail.direction = :direction")
            ->setParameters([
                "name"        => $attribute["name"],
                "value"       => $attribute["value"],
                "isHidden"    => $attribute["isHidden"],
                "information" => $attribute["information"],
                "pairUnit"    => $pairUnit,
                "client"      => $client,
                "direction"   => $direction
            ])
            ->getQuery()
            ->getOneOrNullResult();
    }
}

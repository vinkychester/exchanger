<?php

namespace App\Repository;

use App\Entity\BankDetail;
use App\Entity\Client;
use App\Entity\PairUnit;
use App\Entity\Requisition;
use Calculation\Utils\Exchange\PairUnitInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * @method BankDetail|null find($id, $lockMode = null, $lockVersion = null)
 * @method BankDetail|null findOneBy(array $criteria, array $orderBy = null)
 * @method BankDetail[]    findAll()
 * @method BankDetail[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BankDetailRepository extends ServiceEntityRepository
{
    /**
     * @var TokenStorageInterface
     */
    private TokenStorageInterface $storage;

    /**
     * BankDetailRepository constructor.
     * @param ManagerRegistry $registry
     * @param TokenStorageInterface $storage
     */
    public function __construct(ManagerRegistry $registry, TokenStorageInterface $storage)
    {
        parent::__construct($registry, BankDetail::class);
        $this->storage = $storage;
    }

    /**
     * @param PairUnitInterface $pairUnit
     * @param Requisition $requisition
     * @param string $direction
     * @return int|mixed|string|null
     * @throws NonUniqueResultException
     */
    public function findBankDetailsByDirection(PairUnitInterface $pairUnit, Requisition $requisition, string $direction)
    {
        return $this->createQueryBuilder("bank_detail")
            ->join("bank_detail.requisitions", "requisition")
            ->join("bank_detail.pairUnit", "pair_unit")
            ->where('bank_detail.direction = :direction')
            ->andWhere("pair_unit = :pair_unit")
            ->andWhere("requisition = :requisition")
            ->andWhere("bank_detail.isDeleted = :isDeleted")
            ->setParameter("direction", $direction)
            ->setParameter("pair_unit", $pairUnit)
            ->setParameter("requisition", $requisition)
            ->setParameter("isDeleted", false)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @param Client $client
     * @param PairUnit $pairUnit
     * @param string $wallet
     * @param string $direction
     * @return int|mixed|string|null
     * @throws NonUniqueResultException
     */
    public function findWallet(Client $client, PairUnit $pairUnit, string $wallet, string $direction)
    {
        return $this->createQueryBuilder("bank_detail")
            ->join("bank_detail.attributes", "attributes")
            ->where("attributes.name = :name")
            ->andWhere("attributes.value = :value")
            ->andWhere("bank_detail.client = :client")
            ->andWhere("bank_detail.direction = :direction")
            ->andWhere("bank_detail.pairUnit = :pairUnit")
            ->setParameters([
                "name" => "wallet",
                "value" => $wallet,
                "client" => $client,
                "direction" => $direction,
                "pairUnit" => $pairUnit
            ])
            ->getQuery()->getOneOrNullResult();
    }

    public function findClientAttributeByName(Client $client, string $name, string $value)
    {
        return $this->createQueryBuilder("bank_detail")
            ->join("bank_detail.attributes", "attributes")
            ->where("attributes.name = :name")
            ->andWhere("attributes.value = :value")
            ->andWhere("bank_detail.client = :client")
            ->setParameters([
                "name" => $name,
                "value" => $value,
                "client" => $client,
            ])
            ->getQuery()->getResult();
    }

    /**
     * @param array $criteria
     * @return false|int|mixed|string|null
     */
    public function uniqueTitle(array $criteria)
    {
        $qb = $this->createQueryBuilder("bank_detail");
        $qb->where("bank_detail.title = :title")
            ->andWhere("bank_detail.client = :client")
            ->setParameters([
                "title" => $criteria['title'],
                "client" => $this->storage->getToken()->getUser()
            ]);
        try {
            return $qb->getQuery()->getOneOrNullResult();
        } catch (NonUniqueResultException $e) {
            return false;
        }
    }
}

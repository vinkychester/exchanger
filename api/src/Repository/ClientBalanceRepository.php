<?php

namespace App\Repository;

use App\Entity\Client;
use App\Entity\ClientBalance;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ClientBalance|null find($id, $lockMode = null, $lockVersion = null)
 * @method ClientBalance|null findOneBy(array $criteria, array $orderBy = null)
 * @method ClientBalance[]    findAll()
 * @method ClientBalance[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ClientBalanceRepository extends ServiceEntityRepository
{
    /**
     * ClientBalanceRepository constructor.
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ClientBalance::class);
    }
    
    /**
     * @param Client $client
     * @param $field
     * @param $value
     * @param null $operation
     * @return ClientBalance
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function setClientBalance(Client $client, $field, $value, $operation = null): ClientBalance
    {
        $clientFieldBalance = $this->findOneBy(
            [
                'user'  => $client,
                'field' => $field
            ]
        );

        if (!$clientFieldBalance) {
            return $this->createClientBalance($client, $field, $value);
        }

        return $this->updateClientBalance($clientFieldBalance, $field, $value, $operation);
    }

    /**
     * @param Client $client
     * @param $field
     * @param $value
     * @return ClientBalance
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function createClientBalance(Client $client, $field, $value): ClientBalance
    {
        $balance = new ClientBalance();

        $balance->setUser($client);
        $balance->setField($field);
        $balance->setValue($value);

        $this->_em->persist($balance);
        $this->_em->flush();

        return $balance;
    }

    /**
     * @param ClientBalance $balance
     * @param $field
     * @param $value
     * @param null $operation
     * @return ClientBalance
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function updateClientBalance(ClientBalance $balance, $field, $value, $operation = null): ClientBalance
    {
        $balance->setField($field);

        if ($operation !== '-' && $operation !== '+') {
            $balance->setValue($value);
        } else {
            if ($operation === '+') {
                $balance->setValue($balance->getValue() + $value);
            }

            if ($operation === '-') {
                $balance->setValue($balance->getValue() - $value);
            }
        }

        $this->_em->flush();

        return $balance;
    }
}

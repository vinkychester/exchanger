<?php

namespace App\Repository;

use App\Entity\Client;
use App\Entity\Manager;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bridge\Doctrine\Security\User\UserLoaderInterface;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository implements UserLoaderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * @param $id
     * @return int|mixed|string|null
     * @throws NonUniqueResultException
     */
    public function getUserByUUID($id)
    {
        return $this->createQueryBuilder('user')
            ->where('user.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @param string $username
     * @return int|mixed|string|UserInterface|null
     * @throws NonUniqueResultException
     */
    public function loadUserByUsername(string $username)
    {
        return $this->createQueryBuilder('user')
            ->where('user.email = :email')
            ->setParameter('email', $username)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @param $payload
     * @return Client
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function createClientFromGooglePayload($payload): Client
    {
        $user = new Client();
        $user->setFirstname($payload["given_name"]);
        $user->setLastname($payload["family_name"]);
        $user->setEmail($payload["email"]);
        $user->setIsEnabled(true);

        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();

        return $user;
    }

    /**
     * @param User $user
     * @param $payload
     */
    public function updateUserInfoFromGooglePayload(User $user, $payload)
    {
        if ($user->getFirstname() !== $payload["given_name"]
            || $user->getLastname() !== $payload["family_name"]
        ) {
            $user->setFirstname($payload["given_name"]);
            $user->setLastname($payload["family_name"]);
        }
    }

    /**
     * @param UserInterface $user
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function updateIsOnline(UserInterface $user)
    {
        if ($user instanceof Manager) {
            $user->setIsOnline(true);
            $this->getEntityManager()->persist($user);
            $this->getEntityManager()->flush();
        }
    }
}

<?php

namespace App\Repository;

use App\Entity\Post;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Post|null find($id, $lockMode = null, $lockVersion = null)
 * @method Post|null findOneBy(array $criteria, array $orderBy = null)
 * @method Post[]    findAll()
 * @method Post[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PostRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Post::class);
    }

    /**
     * @throws NonUniqueResultException
     */
    public function getPrevious(int $id)
    {
        $qb = $this->createQueryBuilder('post')
            ->select('post')

            // Filter users.
            ->where('post.id < :id')
            ->setParameter(':id', $id)

            // Order by id.
            ->orderBy('post.createdAt', 'DESC')

            // Get the first record.
            ->setFirstResult(0)
            ->setMaxResults(1)
        ;

        return $qb->getQuery()->getOneOrNullResult();
    }

    /**
     * @throws NonUniqueResultException
     */
    public function getNext(int $id)
    {
        $qb = $this->createQueryBuilder('post')
            ->select('post')

            ->where('post.id > :id')
            ->setParameter(':id', $id)

            ->orderBy('post.id', 'ASC')

            ->setFirstResult(0)
            ->setMaxResults(1)
        ;

        return $qb->getQuery()->getOneOrNullResult();
    }

}

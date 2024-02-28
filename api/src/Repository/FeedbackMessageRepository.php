<?php

namespace App\Repository;

use App\Entity\FeedbackMessage;
use App\Entity\Manager;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Paginator;
use Doctrine\ORM\Tools\Pagination\Paginator as ToolPaginator;

/**
 * @method FeedbackMessage|null find($id, $lockMode = null, $lockVersion = null)
 * @method FeedbackMessage|null findOneBy(array $criteria, array $orderBy = null)
 * @method FeedbackMessage[]    findAll()
 * @method FeedbackMessage[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FeedbackMessageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FeedbackMessage::class);
    }

    /**
     * @param $args
     * @param $user
     * @return QueryBuilder
     */
    public function getMessageWithFilter($args, $user): QueryBuilder
    {
        $queryBuilder = $this->createQueryBuilder('feedbackMessage')
            ->addSelect(
                "(CASE feedbackMessage.status WHEN :not_viewed THEN 1 WHEN :viewed THEN 2 WHEN :done THEN 3 ELSE 4 END) AS HIDDEN FSTATUS"
            )
            ->orderBy('FSTATUS, feedbackMessage.createdAt', 'ASC')
            ->andWhere('feedbackMessage.deleted = :deleted')
            ->setParameters(
                [
                    'not_viewed' => FeedbackMessage::NOT_VIEWED,
                    'viewed'     => FeedbackMessage::VIEWED,
                    'done'       => FeedbackMessage::DONE,
                    'deleted'    => $args['deleted']
                ]
            );
        if (isset($args['firstname'])) {
            $queryBuilder->andWhere('feedbackMessage.firstname LIKE :firstname')
                ->setParameter('firstname', '%' . $args['firstname'] . '%');
        }
        if (isset($args['lastname'])) {
            $queryBuilder->andWhere('feedbackMessage.lastname LIKE :lastname')
                ->setParameter('lastname', '%' . $args['lastname'] . '%');
        }
        if (isset($args['email'])) {
            $queryBuilder->andWhere('feedbackMessage.email LIKE :email')
                ->setParameter('email', '%' . $args['email'] . '%');
        }
        if (isset($args['status'])) {
            $queryBuilder->andWhere('feedbackMessage.status = :status')
                ->setParameter('status', $args['status']);
        }
        if (isset($args['createdAt'][0]['gt'])) {
            $queryBuilder
                ->andWhere('feedbackMessage.createdAt >= :dateFrom')
                ->setParameter('dateFrom', $args['createdAt'][0]['gt']);
        }
        if (isset($args['createdAt'][0]['lt'])) {
            $queryBuilder
                ->andWhere('feedbackMessage.createdAt <= :dateTo')
                ->setParameter('dateTo', $args['createdAt'][0]['lt']);
        }

        if ($user instanceof Manager) {
            $queryBuilder->andWhere('feedbackMessage.type = :Type')
                ->setParameter('Type', FeedbackMessage::CASH)
                ->andWhere('feedbackMessage.city  IN(:city)')
                ->setParameter('city', $user->getCities());
        }

        return $queryBuilder;
    }


    /**
     * @param $args
     * @param $user
     * @return Paginator
     */
    public function getAllFeedbackMessage($args, $user): Paginator
    {
        $firstResult = (($args['page'] ?? 1) - 1) * $args['itemsPerPage'];

        return new Paginator(
            (new ToolPaginator(
                $this->getMessageWithFilter($args, $user)
                    ->setFirstResult($firstResult)
                    ->setMaxResults($args['itemsPerPage'])
            ))
                ->setUseOutputWalkers(false)
        );
    }

    /**
     * @param $type
     * @param $email
     * @param null $city
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function exist($type, $email, $city = null)
    {
        $this->createQueryBuilder('feedbackMessage')
            ->where('feedbackMessage.type = :type')
            ->andWhere('feedbackMessage.email = :email')
            ->andWhere('feedbackMessage.deleted = :deleted')
            ->andWhere('feedbackMessage.city = :city')
            ->andWhere('feedbackMessage.status != :status')
            ->setParameters([
                'type' => $type,
                'email' => $email,
                'city' => $city,
                'deleted' => false,
                'status' => FeedbackMessage::DONE
                            ])
            ->getQuery()
            ->getOneOrNullResult();
    }
}

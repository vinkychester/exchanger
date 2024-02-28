<?php

namespace App\Repository;

use App\Entity\Client;
use DateTime;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\Persistence\ManagerRegistry;
use Exception;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @method Client|null find($id, $lockMode = null, $lockVersion = null)
 * @method Client|null findOneBy(array $criteria, array $orderBy = null)
 * @method Client[]    findAll()
 * @method Client[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ClientRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    /**
     * ClientRepository constructor.
     * @param ManagerRegistry $registry
     */
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Client::class);
    }

    /**
     * @param UserInterface $user
     * @param string $newEncodedPassword
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function upgradePassword(UserInterface $user, string $newEncodedPassword): void
    {
        $user->setPassword($newEncodedPassword);
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }

    /**
     * @param Client $client
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function save($client): void
    {
        $this->getEntityManager()->persist($client);
        $this->getEntityManager()->flush();
    }

    /**
     * @param $email
     * @return string
     */
    public function hideEmail($email)
    {
        $tmp = explode("@", $email);
        substr($tmp[0], 0, 2);

        return substr($tmp[0], 0, 2) . "***@" . $tmp[1];
    }

    /**
     * TODO: Replace
     *
     * @param $id
     * @return int|mixed|string|null
     * @throws NonUniqueResultException
     */
    public function getClientByUUID($id)
    {
        return $this->createQueryBuilder('client')
            ->where('client.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Get system profit that was retrieved by client referrals requisitions
     *
     * @param Client $client
     * @return array|int|string
     * @throws NonUniqueResultException
     */
    public function calculateReferralsRequisitionsSystemProfit(Client $client)
    {
        return $this->createQueryBuilder('client')
            ->select('SUM(requisitions.systemProfit) AS referralsRequisitionsSystemProfit')
            ->innerJoin('client.referralUserRelations', 'relations')
            ->innerJoin('relations.invitedUser', 'invitedUsers')
            ->innerJoin('invitedUsers.requisitions', 'requisitions')
            ->where('client.id = :client')
            ->setParameter('client', $client)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * get unconfirmed users with interval after registration
     * @param $interval
     * @return int|mixed|string
     * @throws Exception
     */
    public function getUnConfirmedUsers($interval)
    {
        $date = new DateTime($interval);
        $date->setTime('00', '00', '00');
        $start_day = $date->getTimestamp();
        $date->setTime('23', '59', '00');
        $end_day = $date->getTimestamp();

        return $this->createQueryBuilder('client')
            ->where('client.isEnabled = false')
            ->andWhere('client.createdAt >= :date_start')
            ->andWhere('client.createdAt <= :date_end')
            ->setParameter('date_start', $start_day)
            ->setParameter('date_end', $end_day)
            ->getQuery()
            ->getResult();
    }

    /**
     * @param Client $client
     * @param array $args
     * @return array|int|string
     * @throws NonUniqueResultException
     */
    public function getRequisitionBalanceByPeriod(Client $client, array $args)
    {
        return $this->createQueryBuilder('client')
            ->innerJoin('client.requisitions', 'requisitions')
            ->where('client.id = :id')
            ->andWhere('requisitions.createdAt >= :date_gte')
            ->setParameter('date_gte', $args['date_gte'])
            ->andWhere('requisitions.createdAt <= :date_lte')
            ->setParameter('date_lte', $args['date_lte'])
            ->setParameter('id', $client->getId())
            ->addGroupBy('client.id')
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @param array $args
     * @param string $token
     * @return mixed|null
     */
    public function getTrafficLInksClients(array $args, string $token)
    {
        return $this->createQueryBuilder('client')
            ->andWhere('client.trafficToken = :token')
            ->setParameter('token', $token)
            ->andWhere('client.isEnabled = 1')
            ->andWhere('client.createdAt >= :dateFrom')
            ->andWhere('client.createdAt <= :dateTo')
            ->setParameter('dateFrom', strtotime($args['tdate_gte']))
            ->setParameter('dateTo', strtotime($args['tdate_lte'])+24*3600)
            ->getQuery()->getResult();
    }

    public function getRequisitionsCount(Client $client, array $args) {
        return $this->createQueryBuilder("client")
            ->join("client.requisitions", "requisitions")
            ->select("count(requisitions.id)")
            ->andWhere("client.id = :id")
            ->andWhere('requisitions.createdAt >= :date_gte')
            ->setParameter('date_gte', $args['date_gte'])
            ->andWhere('requisitions.createdAt <= :date_lte')
            ->setParameter('date_lte', $args['date_lte'])
            ->setParameter("id", $client->getId())
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * @param $date
     * @return int|mixed|string
     */
    public function getUnconfirmedUsersByDate($date)
    {
        return $this->createQueryBuilder('client')
            ->where('client.isEnabled = :enabled')
            ->andWhere('client.createdAt <= :date')
            ->setParameters(
                [
                    'enabled' => false,
                    'date'    => $date
                ]
            )
            ->getQuery()
            ->getResult();
    }

    /**
     * return all clients who has referrals
     * @return int|mixed|string
     */
    public function getReferralClients()
    {
        return $this->createQueryBuilder('client')
            ->join('client.referralUserRelations', 'referralUserRelations')
            ->getQuery()
            ->getResult();
    }

    /**
     * @return int|mixed|string
     */
    public function getClientWithRequisition()
    {
        return $this->createQueryBuilder('client')
            ->join('client.requisitions', 'requisitions')
            ->getQuery()
            ->getResult();
    }

    /**
     * @param $from
     * @param $to
     * @param null $registrationType
     * @return int|mixed|string
     */
    public function getClientsForSeo($from, $to, $registrationType = null)
    {
        $qb = $this->createQueryBuilder('client')
            ->where('client.createdAt >= :from')
            ->andWhere('client.createdAt <= :to')
            ->setParameters(
                [
                    'from' => $from,
                    'to'   => $to,
                ]
            );
        if ($registrationType) {
            $qb->andWhere('client.registrationType = :type')
                ->setParameter('type', $registrationType);
        }

        return $qb->getQuery()->getResult();
    }

}

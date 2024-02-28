<?php

namespace App\Document;

use App\Entity\Admin;
use DateTime;
use Doctrine\ODM\MongoDB\Iterator\Iterator;
use Doctrine\ODM\MongoDB\Repository\DocumentRepository;
use Exception;
use MongoDB\DeleteResult;
use MongoDB\InsertOneResult;
use MongoDB\UpdateResult;

/**
 * Class LogRepository
 * @package App\Document
 */
class LogRepository extends DocumentRepository
{
    const ADMIN_LOGIN_TEXT = 'Пользователь вошел в систему';

    /**
     * @param array $search
     * @return mixed
     * @throws Exception
     */
    public function getCountOfLogs(array $search)
    {
        return $this->findAllVisibleQuery($search)
            ->count()
            ->getQuery()
            ->execute();
    }

    /**
     * @param array $search
     * @return array|Iterator|int|DeleteResult|InsertOneResult|UpdateResult|object
     * @throws Exception
     */
    public function findAllVisibleQuery(array $search)
    {
        $query = $this->getDocumentManager()
            ->createQueryBuilder(Log::class)
            ->sort('date', -1);
        /**
         * @var LogSearch $search
         */
        if (!empty($search['email'])) {
            $query->field('userEmail')->equals(['$regex' => $search['email']]);
        }
        if (!empty($search['role'])) {
            $query->field('entityClass')->equals($search['role']);
        }
        if (!empty($search['dateTo']) && !empty($search['dateFrom'])) {
            $dateTo = (new DateTime($search['dateTo']))->modify('+1 day');
            $dateFrom = new DateTime($search['dateFrom']);
            $query->field('date')->range($dateFrom, $dateTo)->sort('date', -1);
        } elseif (!empty($search['dateTo'])) {
            $firstDate = new DateTime("1970-01-01");
            $date = (new DateTime($search['dateTo']))->modify('+1 day');
            $query->field('date')->range($firstDate, $date)->sort('date', -1);
        } elseif (!empty($search['dateFrom'])) {
            $currentDate = new DateTime();
            $date = new DateTime($search['dateFrom']);
            $query->field('date')->range($date, $currentDate)->sort('date', -1);
        }

        return $query;
    }

    /**
     * @param Admin $admin
     * @return array|Iterator|int|DeleteResult|InsertOneResult|UpdateResult|object
     */
    public function findLogsForAdmin(Admin $admin)
    {
        $query = $this->getDocumentManager()
            ->createQueryBuilder(Log::class)
            ->sort('date', -1);

        $query->field('userEmail')->equals(['$regex' => $admin->getEmail()]);
        $query->field('text')->equals(['$regex' => self::ADMIN_LOGIN_TEXT]);

        return $query;
    }
}

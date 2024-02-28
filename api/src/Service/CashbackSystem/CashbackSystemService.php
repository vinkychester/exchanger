<?php


namespace App\Service\CashbackSystem;

use Doctrine\ORM\EntityManagerInterface;

/**
 * Class CashbackSystemService
 * @package App\Service\CashbackSystem
 */
class CashbackSystemService
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * ClientReferralRelationService constructor.
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @param $clientsLevelsSQL
     * @param $cashbackLevelID
     * @return string
     */
    public function updateLevelForAllSelectedClientsLevelsSQL($clientsLevelsSQL, $cashbackLevelID)
    {
        return "
            UPDATE cashback_client_level
            SET cashback_level_id = " . $cashbackLevelID . "                      
            WHERE id IN (SELECT clientVipLevel.id FROM (" . $clientsLevelsSQL . " ) as clientVipLevel)
        ";
    }

    /**
     * @param $levelCashbackLevel
     * @param $cashbackLevelID
     * @return string
     */
    public function updateLevelForNotVipClientsSQL($levelCashbackLevel, $cashbackLevelID)
    {
        return "
            UPDATE cashback_client_level
            SET cashback_level_id = " . $cashbackLevelID . "                        
            WHERE id IN (SELECT clientNotVipLevel.id FROM (" . $this->getClientNotVipLevelsSQL($levelCashbackLevel) . " ) as clientNotVipLevel)
        ";
    }

    /**
     * @param $levelCashbackLevel
     * @return string
     */
    public function getClientVipLevelsSQL($levelCashbackLevel)
    {
        return '
            SELECT cashbackClientLevel1.id
            FROM cashback_client_level cashbackClientLevel1
            INNER JOIN cashback_level cashbackLevel1 ON cashbackClientLevel1.cashback_level_id = cashbackLevel1.id
            WHERE cashbackClientLevel1.cashback_level_id NOT IN (' . $this->getDefaultCashbackLevelByLevelSQL(
                $levelCashbackLevel
            ) . ')
            AND cashbackLevel1.level IN( ' . $this->getDefaultCashbackLevelByLevelSQL($levelCashbackLevel) . ')
        ';
    }

    /**
     * @param $levelCashbackLevel
     * @return string
     */
    public function getClientNotVipLevelsSQL($levelCashbackLevel)
    {
        return '
            SELECT cashbackClientLevel1.id
            FROM cashback_client_level cashbackClientLevel1
            INNER JOIN cashback_level cashbackLevel1 ON cashbackClientLevel1.cashback_level_id = cashbackLevel1.id
            WHERE cashbackClientLevel1.cashback_level_id IN (' . $this->getDefaultCashbackLevelByLevelSQL(
                $levelCashbackLevel
            ) . ')
            AND cashbackLevel1.level IN( ' . $levelCashbackLevel . ' )
        ';
    }

    /**
     * @param $levelCashbackLevel
     * @return string
     */
    public function getDefaultCashbackLevelByLevelSQL($levelCashbackLevel)
    {
        return '
            SELECT cashbackLevel1.id
            FROM cashback_level cashbackLevel1
            WHERE cashbackLevel1.is_default = true
            AND cashbackLevel1.level = ' . $levelCashbackLevel . '
        ';
    }
}
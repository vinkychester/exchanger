<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\ManagerBalanceRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Action\NotFoundAction;

/**
 * @ApiResource(
 *     attributes={"pagination_enabled"=false},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *  )
 * @ORM\Entity(repositoryClass=ManagerBalanceRepository::class)
 */
class ManagerBalance extends Balance
{
    public const CASH_PROFIT_FIELD = 'cash';
    public const BANK_PROFIT_FIELD = 'bank';

}

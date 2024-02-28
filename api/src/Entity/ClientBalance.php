<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\ClientBalanceRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Action\NotFoundAction;

/**
 * @ApiResource(
 *     attributes={"pagination_enabled"=false},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *         "item_query"={
 *              "normalization_context"={"groups"={"balance:item_query"}},
 *              "security"="(is_granted('ROLE_CLIENT') and object === user) or is_granted('ROLE_ADMIN')",
 *         },
 *         "collection_query"={
 *              "normalization_context"={"groups"={"balance:collection_query"}},
 *              "security"="is_granted('ROLE_ADMIN')"
 *         },
 *         "create"={
 *             "denormalization_context"={"groups"={"balance:mutation"}},
 *         },
 *         "update"={
 *              "denormalization_context"={"groups"={"balance:mutation"}},
 *              "security"="is_granted('ROLE_ADMIN')",
 *         },
 *     }
 *  )
 * @ORM\Entity(repositoryClass=ClientBalanceRepository::class)
 */
class ClientBalance extends Balance
{
    public const CASHBACK_PROFIT_FIELD = 'cashbackProfit';
    public const REFERRAL_PROFIT_FIELD = 'referralProfit';

}

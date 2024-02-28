<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity()
 * @ApiResource(
 *     attributes={
 *          "order"={"createdAt": "DESC"},
 *          "pagination_client_enabled"=true,
 *          "pagination_type"="page",
 *          "security"="is_granted('ROLE_ADMIN')"
 *     },
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *         "create"={
 *             "normalization_context"={"groups"={"user:collection_query"}},
 *             "denormalization_context"={"groups"={"user:mutation"}}
 *         },
 *         "collection_query"={
 *              "normalization_context"={"groups"={"user:collection_query"}},
 *              "security"="is_granted('ROLE_ADMIN')"
 *         },
 *        "item_query"={
 *              "normalization_context"={"groups"={"user:item_query"}},
 *              "security"="is_granted('ROLE_ADMIN')"
 *         },
 *         "update"={
 *              "denormalization_context"={"groups"={"user:update_mutation"}},
 *              "security"="is_granted('ROLE_ADMIN') and object === user"
 *          }
 *     }
 * )
 */
class Admin extends User
{
    public const ROLE_DEFAULT = self::ADMIN;

    /**
     * @return array|string[]
     */
    public function getRoles()
    {
        $this->roles[] = self::ADMIN;

        return array_unique($this->roles);
    }
}

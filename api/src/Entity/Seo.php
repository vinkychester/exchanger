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
 *           "item_query"={
 *              "normalization_context"={"groups"={"user:item_query"}},
 *              "security"="(is_granted('ROLE_ADMIN')) or (is_granted('ROLE_SEO') and object == user )"
 *         },
 *         "create"={
 *             "normalization_context"={"groups"={"user:collection_query"}},
 *             "denormalization_context"={"groups"={"user:mutation"}}
 *         },
 *          "update"={
 *              "denormalization_context"={"groups"={"seo:update_mutation"}},
 *              "security"="is_granted('ROLE_SEO') and object === user"
 *          },

 *     }
 * )
 */
class Seo extends User
{
    public const ROLE_DEFAULT = self::SEO;

    /**
     * @return array|string[]
     */
    public function getRoles()
    {
        $this->roles[] = self::SEO;

        return array_unique($this->roles);
    }
}

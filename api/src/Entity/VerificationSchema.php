<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\PersistentCollection;
use ApiPlatform\Core\Action\NotFoundAction;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Resolver\SetVerificationFlowResolver;

/**
 * @ORM\Entity()
 * @ApiResource(
 *     attributes={"pagination_client_enabled"=true, "pagination_type"="page"},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *          "item_query"={
 *              "normalization_context"={"groups"={"verificationSchema:item_query"}},
 *              "security"="is_granted('ROLE_CLIENT')",
 *         },
 *         "collection_query"={
 *              "collection_query"=SetVerificationFlowResolver::class,
 *              "normalization_context"={"groups"={"verificationSchema:collection_query"}},
 *              "security"="is_granted('ROLE_CLIENT')",
 *         },
 *     }
 * )
 */
class VerificationSchema
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private int $id;

    /**
     * @ORM\Column(type="string", length=50)
     * @Groups({"verificationSchema:collection_query"})
     */
    private string $name;

    /**
     * @ORM\OneToMany(targetEntity=PairUnit::class, mappedBy="verificationSchema")
     * @Groups({"verificationSchema:collection_query"})
     */
    private PersistentCollection $pairUnit;

    /**
     * @ORM\ManyToMany (targetEntity=ClientVerificationSchema::class, mappedBy="verificationSchema")
     * @Groups({"verificationSchema:item_query","verificationSchema:collection_query"})
     */
    private PersistentCollection $clientVerificationSchema;

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return string|null
     */
    public function getName(): ?string
    {
        return $this->name;
    }

    /**
     * @param string $name
     * @return $this
     */
    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return PersistentCollection
     */
    public function getPairUnit(): PersistentCollection
    {
        return $this->pairUnit;
    }

    /**
     * @return PersistentCollection
     */
    public function getClientVerificationSchema(): PersistentCollection
    {
        return $this->clientVerificationSchema;
    }

    /**
     * @param PersistentCollection $clientVerificationSchema
     */
    public function setClientVerificationSchema(PersistentCollection $clientVerificationSchema): void
    {
        $this->clientVerificationSchema = $clientVerificationSchema;
    }


}

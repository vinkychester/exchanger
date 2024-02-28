<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Resolver\ExchangePointCollectionResolver;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *     attributes={"pagination_enabled"=false},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *          "collection_query"={
 *              "normalization_context"={"groups"={"exchange-point:collection_query"}}
 *          },
 *          "collectionQuery"={
 *              "collection_query"=ExchangePointCollectionResolver::class,
 *              "args"={
 *                  "network_id"={"type"="Int!"},
 *                  "pairUnit_id"={"type"="Int!"},
 *                  "city_id"={"type"="Int!"}
 *              }
 *         }
 *     }
 * )
 */
class ExchangePoint
{
    /**
     * @var UuidInterface
     * @ORM\Id()
     * @ORM\Column(type="uuid")
     */
    private UuidInterface $id;

    /**
     * @Groups({"exchange-point:collection_query"})
     */
    private ?string $name;

    /**
     * @Groups({"exchange-point:collection_query"})
     */
    private ?string $description;

    /**
     * @Groups({"exchange-point:collection_query"})
     */
    private ?string $address;

    /**
     * @Groups({"exchange-point:collection_query"})
     */
    private ?int $externalId;

    /**
     * ExchangePoint constructor.
     */
    public function __construct()
    {
        $this->id = Uuid::uuid4();
    }

    /**
     * @return UuidInterface
     */
    public function getId(): ?UuidInterface
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
     * @return string|null
     */
    public function getDescription(): ?string
    {
        return $this->description;
    }

    /**
     * @param string $description
     * @return $this
     */
    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getAddress(): ?string
    {
        return $this->address;
    }

    /**
     * @param string $address
     * @return $this
     */
    public function setAddress(string $address): self
    {
        $this->address = $address;

        return $this;
    }

    /**
     * @return int|null
     */
    public function getExternalId(): ?int
    {
        return $this->externalId;
    }

    /**
     * @param int $externalId
     * @return $this
     */
    public function setExternalId(int $externalId): self
    {
        $this->externalId = $externalId;

        return $this;
    }
}

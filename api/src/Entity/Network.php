<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Action\NotFoundAction;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use App\Resolver\NetworkCollectionResolver;

/**
 * @ApiResource(
 *    attributes={"pagination_enabled"=false, "order"={"createdAt": "DESC"}},
 *    collectionOperations={},
 *    itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *    graphql={
 *         "item_query"={
 *              "normalization_context"={"groups"={"networks:item_query"}},
 *              "security"="is_granted('ROLE_CLIENT')"
 *         },
 *         "collection_query"={
 *              "normalization_context"={"groups"={"networks:collection_query"}}
 *         },
 *         "collectionQuery"={
 *              "collection_query"=NetworkCollectionResolver::class,
 *              "args"={
 *                  "external_id"={"type"="Int!"},
 *                  "pairUnit_id"={"type"="Int!"}
 *              },
 *         }
 *     }
 * )
 */
class Network
{
    public const INTERNAL_NETWORK = "internalNetwork"; // Внутренняя сеть
    public const EXTERNAL_NETWORK = "externalNetwork"; // Внешняя сеть

    /**
     * @var UuidInterface
     * @ORM\Id()
     * @ORM\Column(type="uuid")
     */
    private UuidInterface $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({
     *     "network:item_query",
     *     "network:collection_query",
     *     "city:item_query",
     *     "city:collection_query",
     *     "networks:collection_query"
     * })
     */
    private string $name;

    /**
     * @ORM\Column(type="string", length=50)
     * @Groups({
     *     "network:item_query",
     *     "network:collection_query",
     *     "city:item_query",
     *     "city:collection_query",
     *     "networks:collection_query"
     * })
     */
    private string $externalId;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({
     *     "network:item_query",
     *     "network:collection_query",
     *     "city:item_query",
     *     "city:collection_query",
     *     "networks:collection_query"
     * })
     */
    private bool $active;

    /**
     * @ORM\Column(type="string")
     * @Assert\Choice({"internal", "external"})
     * @Groups({
     *     "network:item_query",
     *     "network:collection_query",
     *     "city:item_query",
     *     "city:collection_query",
     *     "networks:collection_query"
     * })
     */
    private string $type;

//    /**
//     * @var Collection
//     * @ORM\ManyToMany(targetEntity=City::class, inversedBy="networks", cascade={"persist"})
//     * @Groups({
//     *     "network:item:read",
//     *     "networks:collection_query"
//     * })
//     */
//    private Collection $cities;

    /**
     * @Groups({
     *     "network:item:read",
     *     "networks:collection_query"
     * })
     */
    private ?array $attributes = [];

    /**
     * Network constructor.
     */
    public function __construct()
    {
        $this->id = Uuid::uuid4();
        $this->active = true;
//        $this->cities = new ArrayCollection();
    }

    /**
     * @return UuidInterface
     */
    public function getId(): ?UuidInterface
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getName(): string
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
     * @return bool|null
     */
    public function getActive(): ?bool
    {
        return $this->active;
    }

    /**
     * @param bool $active
     * @return $this
     */
    public function setActive(bool $active): self
    {
        $this->active = $active;

        return $this;
    }

    /**
     * @return string
     */
    public function getType(): string
    {
        return $this->type;
    }

    /**
     * @param string $type
     * @return Network
     */
    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

//    /**
//     * @param City $city
//     * @return $this
//     */
//    public function addCity(City $city): Network
//    {
//        if (!$this->cities->contains($city)) {
//            $this->cities[] = $city;
//        }
//
//        return $this;
//    }
//
//    /**
//     * @param City $city
//     * @return $this
//     */
//    public function removeCity(City $city): self
//    {
//        $this->cities->removeElement($city);
//
//        return $this;
//    }
//
//    /**
//     * @return PersistentCollection|Collection
//     */
//    public function getCities()
//    {
//        return $this->cities;
//    }

    /**
     * @param string $externalId
     * @return Network
     */
    public function setExternalId(string $externalId): Network
    {
        $this->externalId = $externalId;

        return $this;
    }

    /**
     * @return string
     */
    public function getExternalId(): string
    {
        return $this->externalId;
    }

    /**
     * @return array|null
     */
    public function getAttributes(): ?array
    {
        return $this->attributes;
    }

    /**
     * @param array|null $attributes
     * @return $this
     */
    public function setAttributes(?array $attributes): self
    {
        $this->attributes = $attributes;

        return $this;
    }
}

<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\{BooleanFilter, ExistsFilter, SearchFilter, NumericFilter};
use App\Entity\Traits\TimestampableTrait;
use App\Resolver\City\CityCollectionResolver;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *     attributes={"pagination_enabled"=false, "order"={"name"}},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *         "item_query"={
 *              "normalization_context"={"groups"={"city:item_query"}},
 *              "security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_MANAGER')"
 *         },
 *         "collection_query"={
 *              "normalization_context"={"groups"={"city:collection_query"}}
 *         },
 *         "update"={
 *              "denormalization_context"={"groups"={"city:update-mutation"}},
 *              "security"="is_granted('ROLE_ADMIN')"
 *          },
 *         "getExchangePoints"={
 *             "mutation"="App\Resolver\City\ExchangePointResolver",
 *             "args"={
 *                  "id"={"type"="ID!"},
 *                  "cityId"={"type"="String!"},
 *                  "networkId"={"type"="String!"},
 *              },
 *         },
 *         "collectionQuery"={
 *              "collection_query"=CityCollectionResolver::class,
 *              "args"={
 *                  "pairUnit_id"={"type"="Int!"},
 *                  "direction"={"type"="String!"},
 *              }
 *         },
 *     }
 * )
 * @ORM\Entity()
 * @ORM\EntityListeners(value={"App\EntityListener\CityEntityListener"})
 * @ORM\HasLifecycleCallbacks()
 * @ApiFilter(BooleanFilter::class, properties={"cityDescription.isPublish", "disable"})
 * @ApiFilter(ExistsFilter::class, properties={"cityDescription", "cityContact"})
 * @ApiFilter(NumericFilter::class, properties={"externalId"})
 */
class City
{
    use TimestampableTrait;

    /**
     * @var UuidInterface
     * @ORM\Id()
     * @ORM\Column(type="uuid")
     */
    private UuidInterface $id;

    /**
     * @ORM\Column(type="string", length=50)
     * @Groups({
     *     "city:item_query",
     *     "city:collection_query",
     *     "managers:item_query",
     *     "network:item:read",
     *     "network:cells:write",
     *     "city:read",
     *     "city-details:item_query",
     *     "city-details:collection_query",
     *     "city-details:mutation",
     *     "city-contact:item_query",
     *     "city-contact:collection_query",
     *     "feedback:collection_query"
     * })
     */
    private string $name;

    /**
     * @ORM\Column(type="integer")
     * @Groups({
     *     "city:collection_query",
     *     "managers:item_query",
     *     "network:item:read",
     *     "city:item_query",
     * })
     */
    private string $externalId;

    /**
     * @ORM\Column(type="string", length=50)
     * @Groups({
     *     "city:collection_query",
     *     "managers:item_query",
     *     "network:item_query",
     *     "network:collection_query",
     *     "city-contact:collection_query",
     *     "city:item_query"
     * })
     */
    private string $transliteName;

//    /**
//     * @ORM\ManyToMany(targetEntity=Network::class, mappedBy="cities", cascade={"persist"})
//     * @Groups({
//     *     "city:collection_query",
//     *     "managers:item_query"
//     * })
//     */
//    protected Collection $networks;

    /**
     * @ORM\ManyToMany(targetEntity=Manager::class, mappedBy="cities", cascade={"persist"})
     * @Groups({
     *     "city:collection_query"
     * })
     */
    protected Collection $managers;


    /**
     * @ORM\Column(type="boolean")
     * @Groups({
     *     "feedback:collection_query",
     *     "city:collection_query",
     *     "city:update-mutation",
     *     "city-contact:item_query",
     *     "city-contact:collection_query",
     * })
     */
    private bool $disable;

    /**
     * @ORM\OneToOne(targetEntity=CityContact::class, mappedBy="city", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=true)
     * @Groups({
     *     "city:collection_query",
     *     "city:item_query",
     *     "city-details:item_query",
     *     "city-details:collection_query",
     *     "city-details:mutation"
     * })
     */
    private $cityContact;

//    /**
//     * @var mixed
//     * @Groups({
//     *     "network:item_query",
//     *     "network:collection_query",
//     *     "cities:item_query",
//     *     "cities:collection_query"
//     * })
//     */
//    protected $exchangePoints = [];

    /**
     * City constructor.
     */
    public function __construct()
    {
        $this->id = Uuid::uuid4();
        $this->setDisable(false);
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
     * @return City
     */
    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return string
     */
    public function getTransliteName(): string
    {
        return $this->transliteName;
    }

    /**
     * @param string $transliteName
     * @return City
     */
    public function setTransliteName(string $transliteName): self
    {
        $this->transliteName = $transliteName;

        return $this;
    }

//    /**
//     * @param $network
//     * @return City
//     */
//    public function addNetworks($network): City
//    {
//        if (!$this->networks->contains($network)) {
//            $this->networks[] = $network;
//        }
//
//        return $this;
//    }
//
//    /**
//     * @param $network
//     * @return $this
//     */
//    public function removeNetworks($network): City
//    {
//        $this->networks->removeElement($network);
//
//        return $this;
//    }
//
//    /**
//     * @return PersistentCollection|Collection
//     */
//    public function getNetworks()
//    {
//        return $this->networks;
//    }

//    /**
//     * @param mixed $exchangePoints
//     * @return City
//     */
//    public function setExchangePoints($exchangePoints)
//    {
//        $this->exchangePoints = $exchangePoints;
//
//        return $this;
//    }
//
//    /**
//     * @return mixed
//     */
//    public function getExchangePoints()
//    {
//        return $this->exchangePoints;
//    }

    /**
     * @param int $externalId
     * @return City
     */
    public function setExternalId(int $externalId): City
    {
        $this->externalId = $externalId;

        return $this;
    }

    /**
     * @return int
     */
    public function getExternalId(): int
    {
        return $this->externalId;
    }

    /**
     * @param bool $disable
     */
    public function setDisable(bool $disable): void
    {
        $this->disable = $disable;
    }

    /**
     * @return bool
     */
    public function isDisable(): bool
    {
        return $this->disable;
    }

    /**
     * @return CityContact|null
     */
    public function getCityContact(): ?CityContact
    {
        return $this->cityContact;
    }

    /**
     * @param CityContact|null $cityContact
     * @return $this
     */
    public function setCityContact(?CityContact $cityContact): self
    {
        // unset the owning side of the relation if necessary
        if ($cityContact === null && $this->cityContact !== null) {
            $this->cityContact->setCity(null);
        }

        // set the owning side of the relation if necessary
        if ($cityContact !== null && $cityContact->getCity() !== $this) {
            $cityContact->setCity($this);
        }

        $this->cityContact = $cityContact;

        return $this;
    }

}

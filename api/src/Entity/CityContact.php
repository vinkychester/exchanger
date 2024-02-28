<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\{BooleanFilter, ExistsFilter, NumericFilter, SearchFilter};
use App\Repository\CityContactRepository;
use App\Resolver\CityContact\{CreateBankMutationResolver,
    GetBankCityContactQueryResolver,
    GetCityContactByCityExternalIdQueryResolver};
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\PersistentCollection;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *     attributes={
 *          "pagination_client_enabled"=true,
 *          "pagination_type"="page",
 *     },
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *         "item_query"={
 *              "normalization_context"={"groups"={"city-contact:item_query"}},
 *         },
 *         "collection_query"={
 *              "normalization_context"={"groups"={"city-contact:collection_query"}},
 *         },
 *         "update" = {
 *              "security"="is_granted('ROLE_MANAGER') or is_granted('ROLE_ADMIN')",
 *          },
 *         "create" = {
 *              "security"="is_granted('ROLE_MANAGER') or is_granted('ROLE_ADMIN')",
 *          },
 *         "createBank" = {
 *              "mutation"=CreateBankMutationResolver::class,
 *              "args"={},
 *              "security"="is_granted('ROLE_MANAGER') or is_granted('ROLE_ADMIN')",
 *          },
 *          "getBank" = {
 *              "item_query"=GetBankCityContactQueryResolver::class,
 *              "args"={}
 *          },
 *          "getByCityExternalId" = {
 *              "item_query"=GetCityContactByCityExternalIdQueryResolver::class,
 *              "args"={
 *                  "cityExternalId"={"type"="Int!"},
 *              }
 *          }
 *
 *     }
 * )
 * @ORM\Entity(repositoryClass=CityContactRepository::class)
 * @ApiFilter(BooleanFilter::class, properties={"isPublic"})
 * @ApiFilter(ExistsFilter::class, properties={"city"})
 * @ApiFilter(NumericFilter::class, properties={"cityContactFieldValues.cityContactField.value"})
 * @ApiFilter(SearchFilter::class, properties={
 *     "city.name": "partial",
 *     "type": "exact",
 *     "type": "exact",
 *     "cityContactFieldValues.value": "partial",
 * })
 *
 * @ORM\EntityListeners(value={"App\EntityListener\CityContactEntityListener"})
 *
 */
class CityContact
{
    public const TYPE_CASH = 'cash';
    public const TYPE_BANK = 'bank';

    /**
     * @var int|null
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=50)
     * @Groups({
     *     "city-contact:item_query",
     *     "city-contact:collection_query",
     *     "city:item_query",
     *     "city:collection_query",
     * })
     */
    private string $type;

    /**
     * @var bool
     * @ORM\Column(type="boolean")
     * @Groups({
     *     "city-contact:item_query",
     *     "city-contact:collection_query",
     *     "city:item_query",
     *     "city:collection_query",
     * })
     */
    private bool $isPublic;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=CityContactFieldValue::class, mappedBy="cityContact", cascade={"persist", "remove"})
     * @Groups({
     *     "city-contact:item_query",
     *     "city-contact:collection_query",
     *     "city:item_query",
     *     "city:collection_query",
     * })
     */
    private $cityContactFieldValues;

    /**
     * @var City|null
     * @ORM\OneToOne(targetEntity=City::class, inversedBy="cityContact", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=true)
     * @Groups({
     *     "city-contact:item_query",
     *     "city-contact:collection_query",
     * })
     */
    private ?City $city;

    public function __construct()
    {
        $this->isPublic = false;
        $this->type = self::TYPE_CASH;
        $this->cityContactFieldValues = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return string|null
     */
    public function getType(): ?string
    {
        return $this->type;
    }

    /**
     * @param string $type
     * @return $this
     */
    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    /**
     * @return bool|null
     */
    public function getIsPublic(): ?bool
    {
        return $this->isPublic;
    }

    /**
     * @param bool $isPublic
     * @return $this
     */
    public function setIsPublic(bool $isPublic): self
    {
        $this->isPublic = $isPublic;

        return $this;
    }

    /**
     * @return Collection|CityContactFieldValue[]
     */
    public function getCityContactFieldValues(): Collection
    {
        return $this->cityContactFieldValues;
    }

    /**
     * @param CityContactFieldValue $cityContactFieldValue
     * @return $this
     */
    public function addCityContactFieldValue(CityContactFieldValue $cityContactFieldValue): self
    {
        if (!$this->cityContactFieldValues->contains($cityContactFieldValue)) {
            $this->cityContactFieldValues[] = $cityContactFieldValue;
            $cityContactFieldValue->setCityContact($this);
        }

        return $this;
    }

    /**
     * @param CityContactFieldValue $cityContactFieldValue
     * @return $this
     */
    public function removeCityContactFieldValue(CityContactFieldValue $cityContactFieldValue): self
    {
        if ($this->cityContactFieldValues->removeElement($cityContactFieldValue)) {
            // set the owning side to null (unless already changed)
            if ($cityContactFieldValue->getCityContact() === $this) {
                $cityContactFieldValue->setCityContact(null);
            }
        }

        return $this;
    }

    /**
     * @return City|null
     */
    public function getCity(): ?City
    {
        return $this->city;
    }

    /**
     * @param City|null $city
     * @return $this
     */
    public function setCity(?City $city): self
    {
        $this->city = $city;

        return $this;
    }

}

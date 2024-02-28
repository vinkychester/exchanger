<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\{BooleanFilter, NumericFilter, SearchFilter};
use App\Entity\Traits\TimestampableTrait;
use App\Repository\BankDetailRepository;
use App\Resolver\CreateBankDetailMutationResolver;
use Calculation\Utils\Exchange\PairUnitInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\PersistentCollection;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\HasLifecycleCallbacks
 * @ORM\Entity(repositoryClass=BankDetailRepository::class)
 * @ORM\EntityListeners(value={"App\EntityListener\BankDetailEntityListener"})
 * @ApiResource(
 *      attributes={
 *          "order"={"createdAt": "DESC"},
 *          "pagination_client_enabled"=true,
 *          "pagination_type"="page"
 *      },
 *      collectionOperations={},
 *      itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *      graphql={
 *          "collection_query"={
 *              "normalization_context"={"groups"={"bank-detail:collection_query"}},
 *              "security"="is_granted('ROLE_CLIENT') or is_granted('ROLE_MANAGER')"
 *          },
 *          "item_query"={
 *              "normalization_context"={"groups"={"bank-detail:item_query"}},
 *              "security"="is_granted('ROLE_CLIENT')"
 *          },
 *          "create"={
 *              "mutation"=CreateBankDetailMutationResolver::class,
 *              "args"={
 *                  "attributes"={"type"="Iterable!"},
 *                  "pairUnit"={"type"="String!"},
 *                  "client"={"type"="String!"},
 *                  "direction"={"type"="String!"},
 *                  "title"={"type"="String!"},
 *              },
 *              "denormalization_context"={"groups"={"bank-detail:mutation_create"}},
 *              "security"="is_granted('ROLE_CLIENT')",
 *          },
 *          "update"={
 *              "denormalization_context"={"groups"={"bank-detail:mutation_update"}},
 *              "security"="is_granted('ROLE_CLIENT')"
 *          },
 *          "delete"={"security"="is_granted('ROLE_CLIENT')"}
 *     }
 * )
 * @ApiFilter(SearchFilter::class, properties={
 *     "client.id": "exact",
 *     "direction": "exact",
 *     "pairUnit.paymentSystem.name": "exact",
 *     "pairUnit.currency.asset": "partial",
 *     "title": "partial",
 *     "attributes.value": "partial"
 * })
 * @ApiFilter(NumericFilter::class, properties={"pairUnit.id"})
 * @ApiFilter(BooleanFilter::class, properties={"isDeleted"})
 * @UniqueEntity(
 *     fields={"title"},
 *     repositoryMethod="uniqueTitle",
 *     message="Указанное название уже используется",
 * )
 */
class BankDetail
{
    use TimestampableTrait;

    /**
     * @var UuidInterface
     * @ORM\Id()
     * @ORM\Column(type="uuid")
     * @Groups({"bank-detail:collection_query"})
     */
    private UuidInterface $id;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=10)
     * @Groups({
     *     "bank-detail:mutation_create",
     *     "bank-detail:collection_query",
     *     "bank-detail:item_query"
     * })
     */
    private ?string $direction;

    /**
     * @var Client|null
     * @ORM\ManyToOne(targetEntity=Client::class)
     * @ORM\JoinColumn(nullable=true)
     * @Groups({
     *     "bank-detail:mutation_create",
     *     "bank-detail:collection_query"
     * })
     */
    private ?Client $client = null;

    /**
     * @var PairUnitInterface|null
     * @ORM\ManyToOne(targetEntity=PairUnit::class)
     * @ORM\JoinColumn(nullable=true)
     * @Groups({
     *     "bank-detail:mutation_create",
     *     "bank-detail:collection_query",
     *     "bank-detail:item_query"
     * })
     */
    private ?PairUnitInterface $pairUnit;

    /**
     * @var bool|null
     * @ORM\Column(type="boolean")
     * @Groups({
     *     "bank-detail:mutation_update",
     *     "bank-detail:collection_query",
     *     "bank-detail:item_query"
     * })
     */
    private ?bool $isDeleted;

    /**
     * @var PersistentCollection
     * @ORM\ManyToMany(targetEntity=Requisition::class, inversedBy="bankDetails", cascade={"persist"})
     * @Groups({"bank-detail:item_query"})
     */
    private $requisitions;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=Attribute::class, mappedBy="bankDetail", fetch="EAGER", orphanRemoval=true, cascade={"persist", "remove"})
     * @Groups({
     *     "bank-detail:collection_query",
     *     "bank-detail:item_query"
     * })
     */
    private $attributes;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=50, nullable=true)
     * @Assert\NotBlank(
     *     message="Поле с названием должно быть заполнено",
     *     groups={"bank-detail:mutation_create"}
     * )
     * @Groups({
     *     "bank-detail:mutation_create",
     *     "bank-detail:mutation_update",
     *     "bank-detail:collection_query",
     *     "bank-detail:item_query"
     * })
     */
    private ?string $title;

    /**
     * Attribute constructor.
     */
    public function __construct()
    {
        $this->id = Uuid::uuid4();
        $this->isDeleted = false;
        $this->requisitions = new ArrayCollection();
        $this->attributes = new ArrayCollection();
    }

    /**
     * @return UuidInterface|null
     */
    public function getId(): ?UuidInterface
    {
        return $this->id;
    }

    /**
     * @return string|null
     */
    public function getDirection(): ?string
    {
        return $this->direction;
    }

    /**
     * @param string $direction
     * @return $this
     */
    public function setDirection(string $direction): self
    {
        $this->direction = $direction;

        return $this;
    }

    /**
     * @return Client|null
     */
    public function getClient(): ?Client
    {
        return $this->client;
    }

    /**
     * @param Client|null $client
     * @return $this
     */
    public function setClient(?Client $client): self
    {
        $this->client = $client;

        return $this;
    }

    /**
     * @return PairUnitInterface|null
     */
    public function getPairUnit(): ?PairUnitInterface
    {
        return $this->pairUnit;
    }

    /**
     * @param PairUnitInterface|null $pairUnit
     * @return $this
     */
    public function setPairUnit(?PairUnitInterface $pairUnit): self
    {
        $this->pairUnit = $pairUnit;

        return $this;
    }

    /**
     * @return bool|null
     */
    public function getIsDeleted(): ?bool
    {
        return $this->isDeleted;
    }

    /**
     * @param bool $isDeleted
     * @return $this
     */
    public function setIsDeleted(bool $isDeleted): self
    {
        $this->isDeleted = $isDeleted;

        return $this;
    }

    /**
     * @return Collection|Requisition[]
     */
    public function getRequisitions(): Collection
    {
        return $this->requisitions;
    }

    /**
     * @param Requisition $requisition
     * @return $this
     */
    public function addRequisition(Requisition $requisition): self
    {
        if (!$this->requisitions->contains($requisition)) {
            $this->requisitions[] = $requisition;
        }

        return $this;
    }

    /**
     * @param Requisition $requisition
     * @return $this
     */
    public function removeRequisition(Requisition $requisition): self
    {
        $this->requisitions->removeElement($requisition);

        return $this;
    }

    /**
     * @return Collection|Attribute[]
     */
    public function getAttributes(): Collection
    {
        return $this->attributes;
    }

    /**
     * @param Attribute $attribute
     * @return $this
     */
    public function addAttribute(Attribute $attribute): self
    {
        if (!$this->attributes->contains($attribute)) {
            $this->attributes[] = $attribute;
            $attribute->setBankDetail($this);
        }

        return $this;
    }

    /**
     * @param Attribute $attribute
     * @return $this
     */
    public function removeAttribute(Attribute $attribute): self
    {
        if ($this->attributes->removeElement($attribute)) {
            // set the owning side to null (unless already changed)
            if ($attribute->getBankDetail() === $this) {
                $attribute->setBankDetail(null);
            }
        }

        return $this;
    }

    /**
     * @return string|null
     */
    public function getTitle(): ?string
    {
        return $this->title;
    }

    /**
     * @param string|null $title
     * @return $this
     */
    public function setTitle(?string $title): self
    {
        $this->title = $title;

        return $this;
    }
}

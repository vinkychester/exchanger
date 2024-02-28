<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\{BooleanFilter, SearchFilter};
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Action\NotFoundAction;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Resolver\AttributeCollectionResolver;
use App\Repository\AttributeRepository;
use App\Resolver\UpdateAttributesMutationResolver;

/**
 * @ApiResource(
 *     attributes={"pagination_enabled"=false},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *         "collection_query"={"normalization_context"={"groups"={"attribute:collection_query"}}},
 *         "update"={"denormalization_context"={"groups"={"attribute:mutation_update"}}},
 *         "collectionQuery"={
 *              "collection_query"=AttributeCollectionResolver::class,
 *              "args"={
 *                  "pairUnit_id"={"type"="Int!"},
 *                  "direction"={"type"="String!"},
 *                  "locale"={"type"="String!"},
 *              },
 *
 *         },
 *         "updateMutation"={
 *              "mutation"=UpdateAttributesMutationResolver::class,
 *              "args"={
 *                  "bank_details"={"type"="Iterable!"},
 *                  "requisition_id"={"type"="String!"},
 *                  "pairPercent"={"type"="Float!"},
 *                  "amount"={"type"="Float!"},
 *              }
 *         },
 *     }
 * )
 * @ORM\Entity(repositoryClass=AttributeRepository::class)
 * @ORM\EntityListeners(value={"App\EntityListener\AttributeEntityListener"})
 * @ApiFilter(BooleanFilter::class, properties={"isHidden"})
 * @ApiFilter(SearchFilter::class, properties={
 *     "bankDetail.client.id": "exact",
 *     "bankDetail.pairUnit.currency.asset": "exact",
 * })
 */
class Attribute
{
    /**
     * @var UuidInterface
     * @ORM\Id()
     * @ORM\Column(type="uuid")
     * @Groups({"attribute:collection_query"})
     */
    private UuidInterface $id;

    /**
     * @var string|null
     * @Groups({"attribute:collection_query"})
     */
    private ?string $direction;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=20)
     * @Groups({"attribute:collection_query"})
     */
    private ?string $name;

    /**
     * @var string|null
     * @Groups({"attribute:collection_query"})
     */
    private ?string $title;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=300)
     * @Groups({"attribute:collection_query"})
     */
    private ?string $regex;

    /**
     * @var string|null
     * @Groups({"attribute:collection_query"})
     */
    private ?string $fieldType;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=100, nullable=true)
     * @Groups({
     *     "attribute:collection_query",
     *     "bank-detail:item_query",
     *     "attribute:mutation_update"
     * })
     */
    private ?string $value;

    /**
     * @var BankDetail|null
     * @ORM\ManyToOne(targetEntity=BankDetail::class, inversedBy="attributes")
     * @ORM\JoinColumn(nullable=false, onDelete="CASCADE")
     */
    private ?BankDetail $bankDetail;

    /**
     * @var bool|null
     * @ORM\Column(type="boolean", nullable=true)
     * @Groups({"attribute:collection_query"})
     */
    private ?bool $isHidden;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=200, nullable=true)
     * @Groups({"attribute:collection_query"})
     */
    private ?string $information;

    /**
     * Attribute constructor.
     */
    public function __construct()
    {
        $this->id = Uuid::uuid4();
        $this->isHidden = false;
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
    public function getFieldType(): ?string
    {
        return $this->fieldType;
    }

    /**
     * @param string $fieldType
     * @return $this
     */
    public function setFieldType(string $fieldType): self
    {
        $this->fieldType = $fieldType;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getRegex(): ?string
    {
        return $this->regex;
    }

    /**
     * @param string $regex
     * @return $this
     */
    public function setRegex(string $regex): self
    {
        $this->regex = $regex;

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

    /**
     * @return string|null
     */
    public function getValue(): ?string
    {
        return $this->value;
    }

    /**
     * @param string|null $value
     * @return $this
     */
    public function setValue(?string $value): self
    {
        $this->value = $value;

        return $this;
    }

    /**
     * @return BankDetail|null
     */
    public function getBankDetail(): ?BankDetail
    {
        return $this->bankDetail;
    }

    /**
     * @param BankDetail|null $bankDetail
     * @return $this
     */
    public function setBankDetail(?BankDetail $bankDetail): self
    {
        $this->bankDetail = $bankDetail;

        return $this;
    }

    /**
     * @return bool|null
     */
    public function getIsHidden(): ?bool
    {
        return $this->isHidden;
    }

    /**
     * @param bool|null $isHidden
     * @return $this
     */
    public function setIsHidden(?bool $isHidden): self
    {
        $this->isHidden = $isHidden;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getInformation(): ?string
    {
        return $this->information;
    }

    /**
     * @param string|null $information
     * @return $this
     */
    public function setInformation(?string $information): self
    {
        $this->information = $information;

        return $this;
    }

//    public function getTargets()
//    {
//        return self::CLASS_CONSTRAINT;
//    }
}

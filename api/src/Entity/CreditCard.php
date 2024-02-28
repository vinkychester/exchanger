<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\{BooleanFilter, RangeFilter, SearchFilter};
use App\Entity\Traits\TimestampableTrait;
use App\Repository\CreditCardRepository;
use App\Resolver\{CreateCreditCardMutationResolver};
use App\Validator as AcmeAssert;
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
 * @ORM\Entity(repositoryClass=CreditCardRepository::class)
 * @ORM\HasLifecycleCallbacks()
 * @ApiResource(
 *     attributes={
 *          "order"={"createdAt": "DESC"},
 *          "pagination_client_enabled"=true,
 *          "pagination_type"="page",
 *     },
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *          "item_query"={
 *              "normalization_context"={"groups"={"credit-card:item_query"}},
 *              "security"="(is_granted('ROLE_CLIENT') and object.getClient().getId() == user.getId()) or is_granted('ROLE_MANAGER') or is_granted('ROLE_ADMIN')",
 *          },
 *          "collection_query"={
 *              "normalization_context"={"groups"={"credit-card:collection_query"}},
 *              "security"="is_granted('ROLE_CLIENT') or is_granted('ROLE_MANAGER') or is_granted('ROLE_ADMIN')",
 *          },
 *          "create"={
 *              "mutation"=CreateCreditCardMutationResolver::class,
 *              "denormalization_context"={"groups"={"credit-card:mutation_create"}},
 *              "validation_groups"={"credit-card:create"},
 *              "security"="is_granted('ROLE_CLIENT')"
 *          },
 *          "update"={
 *              "denormalization_context"={"groups"={"credit-card:mutation_update"}},
 *              "validation_groups"={"credit-card:update"},
 *              "security"="is_granted('ROLE_CLIENT') or is_granted('ROLE_MANAGER') or is_granted('ROLE_ADMIN')"
 *          },
 *          "updateApproveMutation"={
 *              "denormalization_context"={"groups"={"credit-card:mutation_update"}},
 *          },
 *          "delete"={"security"="is_granted('ROLE_CLIENT')"}
 *     }
 * )
 * @ApiFilter(SearchFilter::class, properties={
 *     "client.id": "exact",
 *     "client.firstname": "partial",
 *     "client.lastname": "partial",
 *     "cardNumber": "partial",
 *     "cardMask": "partial",
 *     "status": "exact"
 * })
 * @ApiFilter(RangeFilter::class, properties={
 *     "createdAt"
 * })
 * @ApiFilter(BooleanFilter::class, properties={"isDeleted"})
 * @UniqueEntity(
 *     fields={"cardNumber"},
 *     repositoryMethod="uniqueCreditCard",
 *     message="Данная карта ожидает верификации либо уже подтверждена",
 *     groups={"credit-card:create"}
 * )
 * @ORM\EntityListeners(value={"App\EntityListener\CreditCardEntityListener"})
 */
class CreditCard
{
    public const VERIFIED = "VERIFIED";
    public const NOT_VERIFIED = "NOT_VERIFIED";
    public const CANCELED = "CANCELED";
    public const PAST_DUE_DATE = "PAST_DUE_DATE";

    public const CREDIT_CARD_TOPIC = "http://coin24/credit_card";

    use TimestampableTrait;

    /**
     * @var UuidInterface
     * @ORM\Id()
     * @ORM\Column(type="uuid")
     */
    private UuidInterface $id;

    /**
     * @var ?string
     * @ORM\Column(type="string", length=16)
     * @Assert\NotBlank(
     *     message="Поле с банковской картой должно быть заполнено",
     *     groups={"credit-card:create"}
     * )
     * @AcmeAssert\UniqueCardUser(groups={"credit-card:create"})
     * @AcmeAssert\CardScheme(groups={"credit-card:create"})
     * @Groups({
     *     "credit-card:mutation_create",
     *     "credit-card:collection_query",
     *     "credit-card:item_query"
     * })
     */
    private ?string $cardNumber;

    /**
     * @var ?string
     * @ORM\Column(type="string", length=10)
     * @AcmeAssert\ExpirationDate(groups={"credit-card:create"})
     * @Groups({
     *     "credit-card:mutation_create",
     *     "credit-card:collection_query",
     *     "credit-card:item_query"
     * })
     */
    private ?string $expiryDate;

    /**
     * @var int
     * @ORM\Column(type="integer")
     */
    private int $expireDateTime;

    /**
     * @var ?string
     * @ORM\Column(type="string", length=6000, nullable=true)
     * @Assert\NotBlank(message="Поле с примечанием должно быть заполненным", groups={"credit-card:update"})
     * @Assert\Length(
     *      min = 10,
     *      max = 1200,
     *      minMessage = "Примечание должно быть как минимум {{ limit }} символов",
     *      maxMessage = "Примечание не может быть длинне чем {{ limit }} символом",
     *      allowEmptyString = false,
     *      groups={"credit-card:update"}
     * )
     * @Assert\Regex(
     *     pattern="/^[A-Za-zА-Яа-яёЪІіЇїЄє0-9_\s\.\,\:\-()]*$/muD",
     *     htmlPattern="^[A-Za-zА-Яа-яёЪІіЇїЄє0-9_\s\.\,\:\-()]*$",
     *     match=true,
     *     message="Примечание не должно содержать спецификаторы",
     *     groups={"credit-card:update"}
     * )
     * @Groups({
     *     "credit-card:collection_query",
     *     "credit-card:item_query",
     *     "credit-card:mutation_update"
     * })
     */
    private ?string $comment;

    /**
     * @var ?Client
     * @ORM\ManyToOne(targetEntity=Client::class)
     * @ORM\JoinColumn(nullable=false)
     * @Groups({
     *     "credit-card:mutation_create",
     *     "credit-card:collection_query",
     *     "credit-card:item_query"
     * })
     */
    private ?Client $client;

    /**
     * @var ?string
     * @ORM\Column(type="string", length=20)
     * @Groups({
     *     "credit-card:collection_query",
     *     "credit-card:item_query",
     *     "credit-card:mutation_update"
     * })
     */
    private ?string $status;

    /**
     * @var ?string
     * @ORM\Column(type="string", length=16)
     * @Groups({
     *     "credit-card:mutation_create",
     *     "credit-card:collection_query",
     *     "credit-card:item_query",
     * })
     */
    private ?string $cardMask;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=MediaObject::class, mappedBy="creditCard", orphanRemoval=true, cascade={"persist", "remove"})
     * @Groups({"credit-card:item_query"})
     */
    private $mediaObjects;

    /**
     * @var array
     * @Groups({"credit-card:mutation_create"})
     */
    private array $files = [];

    /**
     * @var ?int
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"credit-card:item_query"})
     */
    private ?int $verificationTime;

    /**
     * @var ?string
     * @ORM\Column(type="string", length=30, nullable=true)
     * @Groups({"credit-card:item_query"})
     */
    private ?string $manager;

    /**
     * Attribute constructor.
     */
    public function __construct()
    {
        $this->id = Uuid::uuid4();
        $this->status = self::NOT_VERIFIED;
        $this->mediaObjects = new ArrayCollection();
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
    public function getCardNumber(): ?string
    {
        return $this->cardNumber;
    }

    /**
     * @param string $cardNumber
     * @return $this
     */
    public function setCardNumber(string $cardNumber): self
    {
        $this->cardNumber = $cardNumber;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getExpiryDate(): ?string
    {
        return $this->expiryDate;
    }

    /**
     * @param string $expiryDate
     * @return $this
     */
    public function setExpiryDate(string $expiryDate): self
    {
        $this->expiryDate = $expiryDate;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getComment(): ?string
    {
        return $this->comment;
    }

    /**
     * @param string|null $comment
     * @return $this
     */
    public function setComment(?string $comment): self
    {
        $this->comment = $comment;

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
     * @return string|null
     */
    public function getStatus(): ?string
    {
        return $this->status;
    }

    /**
     * @param string $status
     * @return $this
     */
    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    /**
     * @return int
     */
    public function getExpireDateTime(): int
    {
        return $this->expireDateTime;
    }

    /**
     * @param int $expireDateTime
     * @return $this
     */
    public function setExpireDateTime(int $expireDateTime): self
    {
        $this->expireDateTime = $expireDateTime;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getCardMask(): ?string
    {
        return $this->cardMask;
    }

    /**
     * @param string $cardMask
     * @return $this
     */
    public function setCardMask(string $cardMask): self
    {
        $this->cardMask = $cardMask;

        return $this;
    }

    /**
     * @return Collection|MediaObject[]
     */
    public function getMediaObjects(): Collection
    {
        return $this->mediaObjects;
    }

    /**
     * @param MediaObject $mediaObject
     * @return $this
     */
    public function addMediaObject(MediaObject $mediaObject): self
    {
        if (!$this->mediaObjects->contains($mediaObject)) {
            $this->mediaObjects[] = $mediaObject;
            $mediaObject->setCreditCard($this);
        }

        return $this;
    }

    /**
     * @param MediaObject $mediaObject
     * @return $this
     */
    public function removeMediaObject(MediaObject $mediaObject): self
    {
        if ($this->mediaObjects->removeElement($mediaObject)) {
            // set the owning side to null (unless already changed)
            if ($mediaObject->getCreditCard() === $this) {
                $mediaObject->setCreditCard(null);
            }
        }

        return $this;
    }

    /**
     * @return array|null
     */
    public function getFiles(): ?array
    {
        return $this->files;
    }

    /**
     * @param array $files
     * @return $this
     */
    public function setFiles(array $files): self
    {
        $this->files = $files;

        return $this;
    }

    /**
     * @return int|null
     */
    public function getVerificationTime(): ?int
    {
        return $this->verificationTime;
    }

    /**
     * @param int|null $verificationTime
     * @return $this
     */
    public function setVerificationTime(?int $verificationTime): self
    {
        $this->verificationTime = $verificationTime;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getManager(): ?string
    {
        return $this->manager;
    }

    /**
     * @param string|null $manager
     * @return $this
     */
    public function setManager(?string $manager): self
    {
        $this->manager = $manager;

        return $this;
    }
}

<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\{SearchFilter, RangeFilter, BooleanFilter, OrderFilter};
use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Traits\TimestampableTrait;
use App\Repository\FeedbackMessageRepository;
use App\Resolver\Feedback\CreateMutationResolver;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\PersistentCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Action\NotFoundAction;

/**
 * @ORM\Entity(repositoryClass=FeedbackMessageRepository::class)
 * @ORM\EntityListeners(value={"App\EntityListener\FeedbackMessageEntityListener"})
 * @ApiResource(
 *     attributes={"pagination_client_enabled"=true, "pagination_type"="page"},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *      "item_query"={
 *          "normalization_context"={"groups"={"feedback:item_query"}},
 *          "security"="is_granted('FEEDBACK_MESSAGE_ITEM', object)",
 *          "security_message" = "Нет доступа!"
 *     },
 *      "collection_query"={
 *          "normalization_context"={"groups"={"feedback:collection_query"}},
 *          "security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_MANAGER')"
 *     },
 *      "create"={
 *          "mutation"=CreateMutationResolver::class,
 *          "args"={
 *              "city"={"type"="String"},
 *              "type"={"type"="String!"},
 *              "email"={"type"="String!"},
 *              "firstname"={"type"="String!"},
 *              "lastname"={"type"="String!"},
 *              "message"={"type"="String!"},
 *              "captchaToken"={"type"="String"}
 *          },
 *          "denormalization_context"={"groups"={"feedback:create-mutation"}},
 *          "security"="is_granted('ROLE_CLIENT') or is_granted('IS_AUTHENTICATED_ANONYMOUSLY')"
 *     },
 *     "update"={
 *          "denormalization_context"={"groups"={"feedback:update-mutation"}},
 *          "security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_MANAGER')"
 *     },
 *     "delete"={"security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_MANAGER')"}
 *     },
 * )
 * @ApiFilter(SearchFilter::class, properties={
 *     "firstname": "partial",
 *     "lastname": "partial",
 *     "email": "partial",
 *     "type": "exact",
 *     "status": "exact",
 *     "citySearch": "exact"
 * })
 * @ApiFilter(RangeFilter::class, properties={"createdAt"})
 * @ApiFilter(BooleanFilter::class, properties={"deleted"})
 * @ApiFilter(OrderFilter::class, properties={"status": "ASC","createdAt": "ASC"})
 */
class FeedbackMessage
{

    public const NOT_VIEWED = 'not_viewed'; // Not viewed
    public const VIEWED     = 'viewed';     //Viewed
    public const WELL_DONE  = 'well_done';       // Well done
    public const DELETED    = 'deleted';       // Done

    public const CASH = 'cash';
    public const BANK = 'bank';

    public const FEEDBACK_TOPIC = "http://coin24/feedbacks";

    use TimestampableTrait;

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue
     * @ORM\Column (type="integer")
     */
    private int $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     * @Assert\Length(
     *      min = 2,
     *      max = 50,
     *      minMessage = "Имя должно быть как минимум {{ limit }} символов",
     *      maxMessage = "Имя не может быть длинне чем {{ limit }} символом",
     *      allowEmptyString = false
     * )
     * @Assert\Regex(
     *     pattern="/^[-A-zA-яёЁїЇІієЄґҐ ]{2,20}$/",
     *     match=true,
     *     message="Поле Имя имеет недопустимые символы"
     * )
     * @Groups({"feedback:collection_query", "feedback:create-mutation", "feedback:item_query"})
     */
    private ?string $firstname;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     * @Assert\Length(
     *      min = 2,
     *      max = 50,
     *      minMessage = "Фамилия должно быть как минимум {{ limit }} символов",
     *      maxMessage = "Фамилия не может быть длинне чем {{ limit }} символом",
     *      allowEmptyString = false
     * )
     * @Assert\Regex(
     *     pattern="/^[-A-zA-яёЁїЇІієЄґҐ ]{2,20}$/",
     *     match=true,
     *     message="Поле Фамилия имеет недопустимые символы"
     * )
     * @Groups({"feedback:collection_query", "feedback:create-mutation","feedback:item_query"})
     */
    private ?string $lastname;

    /**
     * @ORM\Column(type="string", length=150)
     * @Assert\NotBlank(message = "Е-mail не должен быть пустым")
     * @Assert\Email(message = "Е-mail имеет неверный формат")
     * @Groups({"feedback:collection_query", "feedback:create-mutation","feedback:item_query"})
     */
    private ?string $email;

    /**
     * @ORM\Column(type="text", length=3600)
     * @Assert\NotBlank(
     *     message = "Ваше сообщение не должно быть пустым",
     * )
     * @Assert\Length(
     *     min = 3,
     *     max = 3600,
     *     minMessage = "Ваше сообщение должно содержать не менее {{ limit }} символов",
     *     maxMessage = "Ваше сообщение не может быть длиннее {{ limit }} символов",
     * )
     * @Groups({"feedback:collection_query", "feedback:create-mutation","feedback:item_query"})
     */
    private string $message;

    /**
     * @ORM\Column(type="string", length=150)
     * @Groups({"feedback:collection_query","feedback:update-mutation","feedback:item_query"})
     */
    private string $status;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"feedback:collection_query", "feedback:update-mutation"})
     */
    private bool $deleted;

    /**
     * @ORM\Column(type="string", length=10)
     * @Groups({"feedback:create-mutation", "feedback:collection_query"})
     */
    private string $type;


    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity="FeedbackDetail", mappedBy="feedbackMessage", cascade={"persist"},  orphanRemoval=true))
     * @Groups({"feedback:collection_query","feedback:item_query"})
     */
    private PersistentCollection $feedbackDetail;

    /**
     * @ORM\ManyToOne(targetEntity=City::class)
     * @Groups({"feedback:create-mutation", "feedback:collection_query"})
     */
    private $city;

    /**
     * @ORM\Column(type="string", length=10)
     * @Groups({"feedback:create-mutation", "feedback:collection_query"})
     */
    private string $citySearch;

    /**
     * FeedbackMessage constructor.
     */
    public function __construct()
    {
        $this->status = self::NOT_VIEWED;
        $this->deleted = false;
        $this->createdAt = time();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId(int $id): void
    {
        $this->id = $id;
    }


    /**
     * @return string
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * @param string $email
     */
    public function setEmail(string $email): void
    {
        $this->email = $email;
    }

    /**
     * @return string
     */
    public function getMessage(): string
    {
        return $this->message;
    }

    /**
     * @param string $message
     */
    public function setMessage(string $message): void
    {
        $this->message = $message;
    }

    /**
     * @return string
     */
    public function getStatus(): string
    {
        return $this->status;
    }

    /**
     * @param string $status
     */
    public function setStatus(string $status): void
    {
        $this->status = $status;
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
     */
    public function setType(string $type): void
    {
        $this->type = $type;
    }


    /**
     * @return PersistentCollection
     */
    public function getFeedbackDetail(): PersistentCollection
    {
        return $this->feedbackDetail;
    }

    /**
     * @param PersistentCollection $feedbackDetail
     */
    public function setFeedbackDetail(PersistentCollection $feedbackDetail): void
    {
        $this->feedbackDetail = $feedbackDetail;
    }

    /**
     * @return string
     */
    public function getFirstname(): string
    {
        return $this->firstname;
    }

    /**
     * @param string $firstname
     */
    public function setFirstname(string $firstname): void
    {
        $this->firstname = $firstname;
    }

    /**
     * @return string
     */
    public function getLastname(): string
    {
        return $this->lastname;
    }

    /**
     * @param string $lastname
     */
    public function setLastname(string $lastname): void
    {
        $this->lastname = $lastname;
    }

    public function getCity(): ?City
    {
        return $this->city;
    }

    public function setCity(?City $city): self
    {
        $this->city = $city;

        return $this;
    }

    /**
     * @param bool $deleted
     */
    public function setDeleted(bool $deleted): void
    {
        $this->deleted = $deleted;
    }

    /**
     * @return bool
     */
    public function isDeleted(): bool
    {
        return $this->deleted;
    }

    /**
     * @return string
     */
    public function getCitySearch(): string
    {
        return $this->citySearch;
    }

    /**
     * @param string $citySearch
     */
    public function setCitySearch(string $citySearch): void
    {
        $this->citySearch = $citySearch;
    }


}

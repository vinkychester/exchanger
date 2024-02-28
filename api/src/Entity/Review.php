<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Traits\TimestampableTrait;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Action\NotFoundAction;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity()
 * @ApiResource(
 *     attributes={"order"={"createdAt": "DESC"}, "pagination_client_enabled"=true, "pagination_type"="page"},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *      "item_query"={
 *          "normalization_context"={"groups"={"review:item_query"}},
 *          "security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_MANAGER')"
 *      },
 *      "collection_query"={
 *          "normalization_context"={"groups"={"review:collection_query"}},
 *          "security"="is_granted('IS_AUTHENTICATED_FULLY') or is_granted('IS_AUTHENTICATED_ANONYMOUSLY')"
 *      },
 *      "create"={
 *          "denormalization_context"={"groups"={"review:create-mutation"}},
 *          "security"="is_granted('ROLE_CLIENT') or is_granted('IS_AUTHENTICATED_ANONYMOUSLY')"
 *     },
 *     "update"={
 *          "denormalization_context"={"groups"={"review:update-mutation"}},
 *          "security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_MANAGER')"
 *     },
 *     "delete"={"security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_MANAGER')"}
 *     },
 * )
 * @ApiFilter(BooleanFilter::class, properties={"publish"})
 * @ApiFilter(RangeFilter::class, properties={"createdAt"})
 * @ApiFilter(SearchFilter::class, properties={"client.firstname": "partial", "client.lastname": "partial"})
 * @ORM\EntityListeners(value={"App\EntityListener\ReviewEntityListener"})
 */
class Review
{
    public const REVIEW_TOPIC = "http://coin24/review";

    use TimestampableTrait;

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private int $id;

    /**
     * @ORM\Column(type="text", length=1200)
     * @Assert\Length(
     *     min="3",
     *     max="1200",
     *     minMessage = "Поле должно быть длиной не менее  {{ limit }} символов",
     *     maxMessage = "Поле не может быть длиннее {{ limit }} символов"
     *     )
     * @Groups({"review:item_query", "review:collection_query", "review:create-mutation", "review:update-mutation"})
     */
    private string $message;

    /**
     * @var bool
     * @ORM\Column(type="boolean")
     * @Groups({"review:item_query", "review:collection_query", "review:update-mutation"})
     */
    private bool $publish;

    /**
     * @ORM\ManyToOne(targetEntity=Client::class)
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"review:item_query","review:collection_query", "review:create-mutation"})
     */
    private Client $client;

    /**
     * Review constructor.
     */
    public function __construct()
    {
        $this->publish = 0;
        $this->createdAt = time();
    }

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
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
     * @return Review
     */
    public function setMessage(string $message): self
    {
        $this->message = $message;

        return $this;
    }

    /**
     * @return int
     */
    public function getPublish(): int
    {
        return $this->publish;
    }

    /**
     * @param int $publish
     * @return $this
     */
    public function setPublish(int $publish): self
    {
        $this->publish = $publish;

        return $this;
    }

    /**
     * @return Client
     */
    public function getClient(): Client
    {
        return $this->client;
    }

    /**
     * @param Client $client
     * @return Review
     */
    public function setClient(Client $client): self
    {
        $this->client = $client;

        return $this;
    }
}

<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Traits\TimestampableTrait;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Action\NotFoundAction;
use App\Resolver\CreateMailingMutationResolver;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\{SearchFilter, BooleanFilter};

/**
 * @ORM\EntityListeners(value={"App\EntityListener\MailingEntityListener"})
 * @ApiResource(
 *     attributes={"pagination_enabled"=false,"order"={"createdAt": "DESC"}},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *      "item_query"={
 *         "normalization_context"={"groups"={"mailing:item_query"}},
 *      },
 *      "collection_query"={
 *         "normalization_context"={"groups"={"mailing:collection_query"}},
 *      },
 *     "create"={
 *         "mutation"=CreateMailingMutationResolver::class,
 *         "denormalization_context"={"groups"={"mailing:create-mutation"}},
 *         "validation_groups"={"mailing:create"},
 *         "args"={
 *              "title"={"type"="String!"},
 *              "message"={"type"="String!"},
 *              "file"={"type"="Iterable"}
 *          }
 *
 *      },
 *     "update"={
 *          "mutation"=CreateMailingMutationResolver::class,
 *         "denormalization_context"={"groups"={"mailing:update-mutation"}},
 *         "args"={
 *              "id"={"type"="ID"},
 *              "status"={"type"="Boolean"},
 *              "title"={"type"="String"},
 *              "message"={"type"="String"},
 *              "file"={"type"="Iterable"}
 *          }
 *
 *      },
 *     "delete"={}
 *     },
 * )
 * @ApiFilter(SearchFilter::class, properties={"title": "partial", "message": "partial"})
 * @ApiFilter(BooleanFilter::class, properties={"status"})
 * @ORM\Entity()
 */
class Mailing
{

    use TimestampableTrait;

    /**
     * @var UuidInterface
     * @ORM\Id
     * @ORM\Column(type="uuid")
     */
    private UuidInterface $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(
     *     message="Заголовок не должен быть пустым",
     *     groups={"mailing:create"}
     * )
     * @Groups(
     *     "mailing:create-mutation",
     *     "mailing:collection_query",
     *     "mailing:update-mutation",
     *     "mailing:item_query"
     * )
     */
    private string $title;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $file;

    /**
     * @ORM\Column(type="text")
     * @Assert\NotBlank(
     *     message="Сообщение не должен быть пустым",
     *     groups={"mailing:create"}
     * )
     * @Assert\Length(
     *     max = 3500,
     *     maxMessage = "Поле не может быть длиннее {{ limit }} символов"
     * )
     * @Groups(
     *     "mailing:create-mutation",
     *     "mailing:collection_query",
     *     "mailing:update-mutation",
     *     "mailing:item_query"
     * )
     */
    private string $message;

    /**
     * @ORM\Column(type="boolean")
     * @Groups(
     *     "mailing:update-mutation",
     *     "mailing:item_query",
     *     "mailing:collection_query",
     * )
     */
    private bool $status = false;

    /**
     * @Groups(
     *     "mailing:collection_query",
     *     "mailing:item_query"
     * )
     */
    private ?string $base64 = null;

    /**
     * Mailing constructor.
     */
    public function __construct()
    {
        $this->id = Uuid::uuid4();
        $this->createdAt = time();
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
    public function getTitle(): ?string
    {
        return $this->title;
    }

    /**
     * @param string $title
     * @return $this
     */
    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getFile(): ?string
    {
        return $this->file;
    }

    /**
     * @param string|null $file
     * @return $this
     */
    public function setFile(?string $file): self
    {
        $this->file = $file;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getMessage(): ?string
    {
        return $this->message;
    }

    /**
     * @param string $message
     * @return $this
     */
    public function setMessage(string $message): self
    {
        $this->message = $message;

        return $this;
    }

    /**
     * @return bool
     */
    public function isStatus(): bool
    {
        return $this->status;
    }

    /**
     * @param bool $status
     * @return $this
     */
    public function setStatus(bool $status): self
    {
        $this->status = $status;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getBase64(): ?string
    {
        return $this->base64;
    }

    /**
     * @param string|null $base64
     * @return $this
     */
    public function setBase64(?string $base64): self
    {
        $this->base64 = $base64;

        return $this;
    }
}

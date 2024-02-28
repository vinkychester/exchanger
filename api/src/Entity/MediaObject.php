<?php


namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Resolver\ChangeMediaObjectMutationResolver;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity()
 * @ApiResource(
 *     attributes={"pagination_enabled"=false},
 *     iri="http://schema.org/MediaObject",
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *         "item_query"={"normalization_context"={"groups"={"media-object:item_query"}}},
 *         "collection_query"={"normalization_context"={"groups"={"media-object:collection_query"}}},
 *         "changeMutation"={
 *              "mutation"=ChangeMediaObjectMutationResolver::class,
 *              "args"={"mediaFile"={"type"="String!"}},
 *              "security"="is_granted('IS_AUTHENTICATED_FULLY')"
 *          }
 *     }
 * )
 */
class MediaObject
{
    public const AVATAR_TYPE   = "avatar";
    public const POST_TYPE     = "post";
    public const CREDIT_TYPE   = "credit";
    public const PREVIEW_TYPE     = "preview";
    public const DETAIL_TYPE     = "detail";

    /**
     * @var UuidInterface
     * @ORM\Id()
     * @ORM\Column(type="uuid_binary_ordered_time", unique=true)
     * @ORM\GeneratedValue(strategy="CUSTOM")
     * @ORM\CustomIdGenerator(class="Ramsey\Uuid\Doctrine\UuidOrderedTimeGenerator")
     */
    protected UuidInterface $id;

    /**
     * @var string
     * @ORM\Column(type="string", length=150)
     * @Groups({
     *     "media_object_read",
     *     "client:upload-imagemedia",
     *     "media-object:item_query",
     *     "user:collection_query",
     *     "user:item_query",
     *     "media-object:collection_query",
     *     "post:collection_query",
     *     "post:item_query",
     *     "managers:item_query"
     * })
     */
    protected string $contentUrl;

    /**
     * @var File|null
     * @Groups({
     *     "media-object:item_query",
     *     "user:collection_query",
     *     "user:item_query",
     *     "media-object:collection_query"
     * })
     */
    protected ?File $file;

    /**
     * @var User|null
     * @ORM\OneToOne(targetEntity=User::class, mappedBy="mediaObject", cascade={"persist", "remove"})
     */
    private ?User $user;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=10, nullable=true)
     * @Groups({
     *     "media-object:item_query",
     *     "user:collection_query",
     *     "user:item_query",
     *     "media-object:collection_query",
     *     "post:collection_query",
     *     "post:item_query",
     *     "managers:item_query",
     * })
     */
    private ?string $storage;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=20)
     */
    private ?string $type;

    /**
     * @var CreditCard|null
     * @ORM\ManyToOne(targetEntity=CreditCard::class, inversedBy="mediaObjects", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=true, onDelete="CASCADE")
     */
    private ?CreditCard $creditCard;

    /**
     * @var Post|null
     * @ORM\ManyToOne(targetEntity=Post::class, inversedBy="mediaObjects", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=true, onDelete="CASCADE")
     */
    private ?Post $post;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=7, nullable=true)
     */
    private ?string $newsImageType;

    /**
     * @var string|null
     * @Groups({
     *     "media-object:item_query",
     *     "user:collection_query",
     *     "user:item_query",
     *     "media-object:collection_query",
     *     "post:collection_query",
     *     "post:item_query",
     *     "managers:item_query",
     * })
     */
    private ?string $base64 = "";

    /**
     * @return UuidInterface
     */
    public function getId(): UuidInterface
    {
        return $this->id;
    }

    /**
     * @param string $contentUrl
     * @return self
     */
    public function setContentUrl(string $contentUrl): self
    {
        $this->contentUrl = $contentUrl;

        return $this;
    }

    /**
     * @return string
     */
    public function getContentUrl(): string
    {
        return $this->contentUrl;
    }

    /**
     * @param File|null $file
     * @return self
     */
    public function setFile(?File $file): self
    {
        $this->file = $file;

        return $this;
    }

    /**
     * @return File|null
     */
    public function getFile(): ?File
    {
        return $this->file;
    }

    /**
     * @return string|null
     */
    public function getBase64(): ?string
    {
        return $this->base64;
    }

    /**
     * @param string $base64
     * @return $this
     */
    public function setBase64(string $base64): self
    {
        $this->base64 = $base64;

        return $this;
    }

    /**
     * @return User|null
     */
    public function getUser(): ?User
    {
        return $this->user;
    }

    /**
     * @param User|null $user
     * @return $this
     */
    public function setUser(?User $user): self
    {
        // unset the owning side of the relation if necessary
        if ($user === null && $this->user !== null) {
            $this->user->setMediaObject(null);
        }

        // set the owning side of the relation if necessary
        if ($user !== null && $user->getMediaObject() !== $this) {
            $user->setMediaObject($this);
        }

        $this->user = $user;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getStorage(): ?string
    {
        return $this->storage;
    }

    /**
     * @param string|null $storage
     * @return $this
     */
    public function setStorage(?string $storage): self
    {
        $this->storage = $storage;

        return $this;
    }

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
     * @return CreditCard|null
     */
    public function getCreditCard(): ?CreditCard
    {
        return $this->creditCard;
    }

    /**
     * @param CreditCard|null $creditCard
     * @return $this
     */
    public function setCreditCard(?CreditCard $creditCard): self
    {
        $this->creditCard = $creditCard;

        return $this;
    }

    public function getPost(): ?Post
    {
        return $this->post;
    }

    public function setPost(?Post $post): self
    {
        $this->post = $post;

        return $this;
    }

    public function getNewsImageType(): ?string
    {
        return $this->newsImageType;
    }

    public function setNewsImageType(string $newsImageType): self
    {
        $this->newsImageType = $newsImageType;

        return $this;
    }
}
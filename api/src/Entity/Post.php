<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\{ApiFilter, ApiResource};
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\{BooleanFilter, SearchFilter, RangeFilter};
use App\Entity\Traits\TimestampableTrait;
use App\Repository\PostRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\PersistentCollection;
use Exception;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use App\Filter\NewsFilter;
use App\Resolver\{CreatePostMutationResolver, UpdatePostMutationResolver, PostCollectionResolver};

/**
 * @ORM\Entity(repositoryClass=PostRepository::class)
 * @ORM\HasLifecycleCallbacks
 * @ApiResource(
 *     attributes={"order"={"createdAt": "DESC"}, "pagination_client_enabled"=true, "pagination_type"="page"},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *         "item_query"={"normalization_context"={"groups"={"post:item_query"}}},
 *         "collection_query"={"normalization_context"={"groups"={"post:collection_query"}}},
 *         "collectionQuery"={
 *              "collection_query"=PostCollectionResolver::class,
 *         },
 *         "create"={
 *             "mutation"=CreatePostMutationResolver::class,
 *             "normalization_context"={"groups"={"post:collection_query"}},
 *             "denormalization_context"={"groups"={"post:mutation_create"}},
 *             "security"="is_granted('ROLE_SUPERADMIN') or is_granted('ROLE_ADMIN') or is_granted('ROLE_MANAGER') or is_granted('ROLE_SEO')"
 *         },
 *         "update"={
 *             "mutation"=UpdatePostMutationResolver::class,
 *             "normalization_context"={"groups"={"post:collection_query", "post:item_query"}},
 *             "denormalization_context"={"groups"={"post:mutation_update"}},
 *             "security"="is_granted('ROLE_SUPERADMIN') or is_granted('ROLE_ADMIN') or is_granted('ROLE_MANAGER') or is_granted('ROLE_SEO')"
 *         },
 *         "delete"={
 *             "security"="is_granted('ROLE_SUPERADMIN') or is_granted('ROLE_ADMIN') or is_granted('ROLE_MANAGER') or is_granted('ROLE_SEO')"
 *         }
 *     }
 * )
 * @ApiFilter(SearchFilter::class, properties={"lang": "exact", "metaUrl": "exact", "title": "partial", "description": "partial"})
 * @ApiFilter(RangeFilter::class, properties={"createdAt"})
 * @ApiFilter(BooleanFilter::class, properties={"publish"})
 * @ApiFilter(NewsFilter::class, properties={"newsText"})
 * @ORM\EntityListeners(value={"App\EntityListener\PostEntityListener"})
 * @UniqueEntity(
 *     fields={"metaUrl"},
 *     message="Новость с такой ссылкой уже существует."
 * )
 * @UniqueEntity(
 *     fields={"title"},
 *     message="Новость с таким названием уже существует."
 * )
 */
class Post
{

    use TimestampableTrait;

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private ?int $id;
    /**
     * @ORM\Column(type="string", length=100, unique=true)
     * @Assert\NotBlank(
     *     message = "Поле не должно быть пустым",
     * )
     * @Assert\Length(
     *     min = 3,
     *     max = 100,
     *     minMessage = "Поле должно быть длиной не менее  {{ limit }} символов",
     *     maxMessage = "Поле не может быть длиннее {{ limit }} символов"
     * )
     * @Groups({"post:collection_query","post:item_query","post:mutation_create", "post:mutation_update"})
     */
    private $title;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"post:collection_query","post:item_query","post:mutation_create", "post:mutation_update"})
     */
    private $content;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Length(
     *     max = 255,
     *     maxMessage = "Поле не может быть длиннее {{ limit }} символов"
     * )
     * @Groups({"post:collection_query","post:item_query","post:mutation_create", "post:mutation_update"})
     */
    private $author;

    /**
     * @ORM\Column(type="string", length=3600, nullable=true)
     * @Assert\Length(
     *     max = 3600,
     *     maxMessage = "Поле не может быть длиннее {{ limit }} символов"
     * )
     * @Groups({"post:collection_query","post:item_query","post:mutation_create", "post:mutation_update"})
     */
    private $description;

    /**
     * @ORM\Column(type="boolean",options={"default" : 0})
     * @Groups({"post:collection_query","post:item_query", "post:mutation_update"})
     *
     */
    private bool $publish;

    /**
     * @ORM\Column(type="string", length=500, nullable=true)
     * @Assert\Length(
     *     max = 255,
     *     maxMessage = "Поле не может быть длиннее {{ limit }} символов",
     *     groups = {"news"}
     * )
     * @Groups({"post:collection_query","post:item_query","post:mutation_create", "post:mutation_update"})
     */
    private $metaDescription;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     * @Assert\Length(
     *     max = 100,
     *     maxMessage = "Поле не может быть длиннее {{ limit }} символов"
     * )
     * @Groups({"post:collection_query","post:item_query","post:mutation_create", "post:mutation_update"})
     */
    private $metaTitle;

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     * @Assert\NotBlank(
     *     message = "Поле не должно быть пустым"
     * )
     * @Assert\Length(
     *     min = 3,
     *     max = 255,
     *     minMessage = "Поле должно быть длиной не менее  {{ limit }} символов",
     *     maxMessage = "Поле не может быть длиннее {{ limit }} символов"
     * )
     * @Groups({"post:collection_query","post:item_query","post:mutation_create", "post:mutation_update"})
     */
    private $metaUrl;

    /**
     * @ORM\Column(type="string", length=5, nullable=true)
     * @Groups({"post:collection_query","post:item_query","post:mutation_create", "post:mutation_update"})
     */
    private $lang;

    /**
     * @ORM\ManyToOne(targetEntity=ParentNews::class, inversedBy="news")
     * @Groups({"post:collection_query","post:item_query","post:mutation_create", "post:mutation_update"})
     */
    private ?ParentNews $linkPost;


    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({
     *     "post:collection_query",
     *     "post:item_query",
     *     "post:mutation_create",
     *     "post:mutation_update"
     * })
     * @Assert\Length(
     *     max = 255,
     *     maxMessage = "Поле не может быть длиннее {{ limit }} символов"
     * )
     */
    protected $imageDescription;

    /**
     * @Groups({
     *     "post:collection_query",
     *     "post:item_query",
     *     "post:mutation_create",
     *     "post:mutation_update"
     * })
     */
    protected ?string $imageUrl;

    /**
     * @Groups({
     *     "post:collection_query",
     *     "post:item_query",
     *     "post:mutation_create",
     *     "post:mutation_update"
     * })
     */
    protected string $newsText;

    /**
     * @Groups({
     *     "post:collection_query",
     *     "post:item_query",
     *     "post:mutation_create",
     *     "post:mutation_update"
     * })
     *
     */
    protected ?string $fileCropped = "";

    /**
     * @Groups({
     *     "post:collection_query",
     *     "post:item_query",
     *     "post:mutation_create",
     *     "post:mutation_update"
     * })
     *
     */
    protected ?string $fileOriginal = "";

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=MediaObject::class, mappedBy="post", orphanRemoval=true, cascade={"persist", "remove"})
     * @Groups({
     *     "post:collection_query",
     *     "post:item_query",
     *     "post:mutation_create",
     *     "post:mutation_update"
     * })
     */
    private $mediaObjects;

    /**
     * @Groups({
     *     "post:collection_query",
     *     "post:item_query",
     * })
     */
    private ?string $prevElement = null;

    /**
     * @Groups({
     *     "post:collection_query",
     *     "post:item_query",
     * })
     */
    private ?string $nextElement = null;

    /**
     * @var PersistentCollection
     * @ORM\ManyToMany(targetEntity=PairUnit::class)
     * @Groups({"post:collection_query","post:item_query","post:mutation_create", "post:mutation_update"})
     */
    private $pairUnits;

    /**
     * News constructor.
     * @throws Exception
     */
    public function __construct()
    {
        $this->publish = false;
        $this->mediaObjects = new ArrayCollection();
        $this->pairUnits = new ArrayCollection();
    }

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * @param mixed $content
     */
    public function setContent($content): void
    {
        $this->content = $content;
    }

    /**
     * @return mixed
     */
    public function getAuthor()
    {
        return $this->author;
    }

    /**
     * @param mixed $author
     */
    public function setAuthor($author): void
    {
        $this->author = $author;
    }

    /**
     * @return mixed
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param mixed $description
     */
    public function setDescription($description): void
    {
        $this->description = $description;
    }

    /**
     * @return mixed
     */
    public function getPublish()
    {
        return $this->publish;
    }

    /**
     * @param mixed $publish
     */
    public function setPublish($publish): void
    {
        $this->publish = $publish;
    }

    /**
     * @return mixed
     */
    public function getMetaDescription()
    {
        return $this->metaDescription;
    }

    /**
     * @param mixed $metaDescription
     */
    public function setMetaDescription($metaDescription): void
    {
        $this->metaDescription = $metaDescription;
    }

    /**
     * @return mixed
     */
    public function getMetaTitle()
    {
        return $this->metaTitle;
    }

    /**
     * @param mixed $metaTitle
     */
    public function setMetaTitle($metaTitle): void
    {
        $this->metaTitle = $metaTitle;
    }

    /**
     * @return mixed
     */
    public function getMetaUrl()
    {
        return $this->metaUrl;
    }

    /**
     * @param mixed $metaUrl
     */
    public function setMetaUrl($metaUrl): void
    {
        $this->metaUrl = $metaUrl;
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->getTitle();
    }

    /**
     * @return mixed
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param mixed $title
     */
    public function setTitle($title): void
    {
        $this->title = $title;
    }

    /**
     * @return mixed
     */
    public function getLang()
    {
        return $this->lang;
    }

    /**
     * @param mixed $lang
     */
    public function setLang($lang): void
    {
        $this->lang = $lang;
    }

    /**
     * @return ParentNews|null
     */
    public function getLinkPost(): ?ParentNews
    {
        return $this->linkPost;
    }

    /**
     * @param ParentNews|null $linkPost
     * @return $this
     */
    public function setLinkPost(?ParentNews $linkPost): self
    {
        $this->linkPost = $linkPost;

        return $this;
    }


    /**
     * @return mixed
     */
    public function getImageDescription()
    {
        return $this->imageDescription;
    }

    /**
     * @param mixed $imageDescription
     */
    public function setImageDescription($imageDescription): void
    {
        $this->imageDescription = $imageDescription;
    }


    /**
     * @return string|null
     */
    public function getNewsText(): ?string
    {
        return $this->newsText;
    }

    /**
     * @param string|null $newsText
     */
    public function setNewsText(?string $newsText): void
    {
        $this->newsText = $newsText;
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
            $mediaObject->setPost($this);
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
            if ($mediaObject->getPost() === $this) {
                $mediaObject->setPost(null);
            }
        }

        return $this;
    }

    /**
     * @param PersistentCollection $mediaObjects
     */
    public function setMediaObjects(PersistentCollection $mediaObjects): void
    {
        $this->mediaObjects = $mediaObjects;
    }

    /**
     * @return string|null
     */
    public function getFileOriginal(): ?string
    {
        return $this->fileOriginal;
    }

    /**
     * @param string|null $fileOriginal
     */
    public function setFileOriginal(?string $fileOriginal): void
    {
        $this->fileOriginal = $fileOriginal;
    }

    /**
     * @return string|null
     */
    public function getFileCropped(): ?string
    {
        return $this->fileCropped;
    }

    /**
     * @param string|null $fileCropped
     */
    public function setFileCropped(?string $fileCropped): void
    {
        $this->fileCropped = $fileCropped;
    }

    /**
     * @return string|null
     */
    public function getPrevElement(): ?string
    {
        return $this->prevElement;
    }

    /**
     * @param string|null $prevElement
     * @return $this
     */
    public function setPrevElement(?string $prevElement): self
    {
        $this->prevElement = $prevElement;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getNextElement(): ?string
    {
        return $this->nextElement;
    }

    /**
     * @param string|null $nextElement
     * @return $this
     */
    public function setNextElement(?string $nextElement): self
    {
        $this->nextElement = $nextElement;

        return $this;
    }

    /**
     * @return Collection|PairUnit[]
     */
    public function getPairUnits(): Collection
    {
        return $this->pairUnits;
    }

    public function addPairUnit(PairUnit $pairUnit): self
    {
        if (!$this->pairUnits->contains($pairUnit)) {
            $this->pairUnits[] = $pairUnit;
        }

        return $this;
    }

    public function removePairUnit(PairUnit $pairUnit): self
    {
        $this->pairUnits->removeElement($pairUnit);

        return $this;
    }

}

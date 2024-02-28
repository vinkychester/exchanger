<?php

namespace App\Entity;


use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Entity\Traits\TimestampableTrait;
use App\Filter\DiscriminatorFilter;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\DiscriminatorMap;
use Exception;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 * @ORM\InheritanceType("SINGLE_TABLE")
 * @ORM\DiscriminatorColumn(name="discr", type="string", length=20)
 * @DiscriminatorMap({"client"="Client", "admin"="Admin", "seo"="Seo", "manager"="Manager"})
 * @ORM\HasLifecycleCallbacks
 * @UniqueEntity("email", message="Пользователь уже существует в системе"),
 * @ApiResource(
 *     attributes={"order"={"createdAt": "DESC"}, "pagination_client_enabled"=true, "pagination_type"="page"},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *         "item_query"={
 *              "normalization_context"={"groups"={"user:item_query"}},
 *              "security"="is_granted('IS_AUTHENTICATED_FULLY')"
 *          },
 *         "collection_query"={"normalization_context"={"groups"={"user:collection_query"}}},
 *         "create"={
 *             "normalization_context"={"groups"={"user:collection_query"}},
 *             "denormalization_context"={"groups"={"user:mutation"}}
 *          },
 *         "update"={
 *              "groups"={"user:update_mutation"},
 *              "security"="is_granted('IS_AUTHENTICATED_FULLY')",
 *          },
 *     }
 * )
 * @ApiFilter(DiscriminatorFilter::class, properties={"discr": "exact"})
 * @ApiFilter(RangeFilter::class, properties={"createdAt"})
 * @ApiFilter(BooleanFilter::class, properties={"isBanned"})
 * @ApiFilter(SearchFilter::class, properties={
 *     "id": "exact",
 *     "firstname": "partial",
 *     "lastname": "partial",
 *     "email": "partial"
 * })
 * @UniqueEntity(fields={"email"}, message="Указанная почта уже используется в системе!"))
 */
abstract class User implements UserInterface
{

    public const USER    = 'ROLE_USER';
    public const ADMIN   = 'ROLE_ADMIN';
    public const MANAGER = 'ROLE_MANAGER';
    public const SEO     = 'ROLE_SEO';
    public const CLIENT  = 'ROLE_CLIENT';

    public const ROLE_DEFAULT = self::CLIENT;

    use TimestampableTrait;

    /**
     * @var UuidInterface
     * @ORM\Id()
     * @ORM\Column(type="uuid", unique=true)
     */
    private UuidInterface $id;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=50)
     * @Assert\NotBlank()
     * @Assert\Length(
     *      min = 2,
     *      max = 50,
     *      minMessage = "Имя должно быть как минимум {{ limit }} символов",
     *      maxMessage = "Имя не может быть длинне чем {{ limit }} символом",
     *      allowEmptyString = false
     * )
     * @Assert\Regex(
     *     pattern="/^[A-zA-яёЁїЇІі ]{0,50}$/",
     *     match=true,
     *     message="Имя должно содержать только буквы латиницы и кириллицы"
     * )
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     *     "user:mutation",
     *     "requisition:item_query",
     *     "requisition:collection_query",
     *     "user:update_mutation",
     *     "review:item_query",
     *     "review:collection_query",
     *     "managers:item_query",
     *     "payout-requisition:collection_query",
     *     "credit-card:item_query",
     *     "credit-card:collection_query",
     *     "managers:collection_query",
     *     "referral-user-relation:item_query",
     *     "user:update_mutation",
     *     "manager:update_mutation",
     *     "seo:update_mutation",
     *     "admins:update_user",
     *     "referral-user-relation:collection_query",
     *     "referral-user-relation:item_query",
     * })
     */
    protected ?string $firstname;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=50)
     * @Assert\Length(
     *      min = 2,
     *      max = 50,
     *      minMessage = "Фамилия должно быть как минимум {{ limit }} символов",
     *      maxMessage = "Фамилия не может быть длинне чем {{ limit }} символом",
     *      allowEmptyString = false
     * )
     * @Assert\Regex(
     *     pattern="/^[A-zA-яёЁїЇІі ]{0,50}$/",
     *     match=true,
     *     message="Фамилия должно содержать только буквы латиницы и кириллицы"
     * )
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     *     "user:mutation",
     *     "requisition:item_query",
     *     "requisition:collection_query",
     *     "review:item_query",
     *     "review:collection_query",
     *     "managers:item_query",
     *     "managers:collection_query",
     *     "payout-requisition:collection_query",
     *     "credit-card:item_query",
     *     "credit-card:collection_query",
     *     "referral-user-relation:item_query",
     *     "user:update_mutation",
     *     "manager:update_mutation",
     *     "seo:update_mutation",
     *     "admins:update_user",
     *     "referral-user-relation:collection_query",
     *     "referral-user-relation:item_query",
     * })
     */
    protected ?string $lastname;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=100)
     * @Assert\Email()
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     *     "user:mutation",
     *     "requisition:item_query",
     *     "requisition:collection_query",
     *     "anonim:forgot-password",
     *     "referral-user-relation:collection_query",
     *     "referral-user-relation:item_query",
     *     "managers:item_query",
     *     "managers:collection_query",
     *     "payout-requisition:collection_query",
     *     "credit-card:item_query",
     *     "credit-card:collection_query",
     *      "referral-user-relation:collection_query",
     *      "referral-user-relation:item_query",
     * })
     */
    protected ?string $email;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=120, nullable=true)
     */
    protected ?string $password;

    /**
     * @var array|null
     */
    protected ?array $roles;

    /**
     * @var string|null
     */
    protected ?string $generatedPassword = "";

    /**
     * @var string|null
     * @ORM\Column(type="string", length=50)
     * @Groups({"change-password"})
     */
    private ?string $token;

    /**
     * @var bool|null
     * @ORM\Column(type="boolean", options={"default" : false})
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     *     "managers:item_query",
     *     "managers:collection_query",
     *     "referral-user-relation:item_query"
     * })
     */
    private ?bool $isEnabled;

    /**
     * @var bool|null
     * @ORM\Column(type="boolean", options={"default" : false})
     * @Groups({
     *     "user:collection_query",
     *     "admins:update_user",
     *     "managers:item_query",
     *     "manager:update_mutation"
     * })
     */
    private ?bool $isBanned;

    /**
     * @var string|null $googleAuthenticatorSecret
     * @ORM\Column(name="googleAuthenticatorSecret", type="string", nullable=true)
     * @Groups({"user:collection_query", "user:item_query","admins:update_user"})
     */
    private ?string $googleAuthenticatorSecret = '';

    /**
     * @var string|null $googleAuthQrCode
     * @ORM\Column(name="googleAuthQrCode", type="string", nullable=true)
     * @Groups({"user:collection_query", "user:item_query", "admins:update_user"})
     */
    private ?string $googleAuthQrCode = '';

    /**
     * @var bool|null
     * @ORM\Column(type="boolean", options={"default": false})
     * @Groups({"manager:update_mutation"})
     */
    private ?bool $isOnline;


    /**
     * @ORM\Column(type="integer")
     * @Groups({"cashier:collection", "cashier:item"})
     */
    private int $lastActivity;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=60, nullable=true)
     */
    protected ?string $registrationIp = '';

    /**
     * @var MediaObject|null
     * @ORM\OneToOne(targetEntity=MediaObject::class, inversedBy="user", cascade={"persist", "remove"})
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     *     "managers:item_query",
     * })
     */
    private ?MediaObject $mediaObject;

    /**
     * @ORM\OneToMany(targetEntity=Balance::class, mappedBy="user")
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private $balances;

    /**
     * User constructor.
     * @throws Exception
     */
    public function __construct()
    {
        $this->isEnabled = false;
        $this->id = Uuid::uuid4();
        $this->isBanned = false;
        $this->isOnline = false;
        $this->token = bin2hex(random_bytes(20));
        $this->isOnline = false;
        $this->lastActivity = time();
        $this->balances = new ArrayCollection();
    }

    /**
     * @return UuidInterface
     */
    public function getId(): UuidInterface
    {
        return $this->id;
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
     * @return User
     */
    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
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
     * @return User
     */
    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
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
     * @return User
     */
    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * @return string
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    /**
     * @param string $password
     * @return User
     */
    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @return string
     */
    public function getGeneratedPassword(): string
    {
        return $this->generatedPassword;
    }

    /**
     * @param string $generatedPassword
     */
    public function setGeneratedPassword(string $generatedPassword): void
    {
        $this->generatedPassword = $generatedPassword;
    }

    /**
     * @return string
     */
    public function getToken(): string
    {
        return $this->token;
    }

    /**
     * @param string $token
     * @return $this
     */
    public function setToken(string $token): self
    {
        $this->token = $token;

        return $this;
    }

    /**
     * @return array|string[]
     */
    public function getRoles()
    {
        $this->roles[] = self::CLIENT;

        return array_unique($this->roles);
    }

    /**
     * @return string|null
     */
    public function getSalt(): ?string
    {
        return null;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @return string
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return $this->email;
    }

    public function eraseCredentials()
    {
        // TODO: Implement eraseCredentials() method.
    }

    /**
     * @return bool|null
     */
    public function getIsEnabled(): ?bool
    {
        return $this->isEnabled;
    }

    /**
     * @param bool $isEnabled
     * @return $this
     */
    public function setIsEnabled(bool $isEnabled): self
    {
        $this->isEnabled = $isEnabled;

        return $this;
    }

    /**
     * @return bool|null
     */
    public function getIsBanned(): ?bool
    {
        return $this->isBanned;
    }

    /**
     * @param bool $isBanned
     * @return $this
     */
    public function setIsBanned(bool $isBanned): self
    {
        $this->isBanned = $isBanned;

        return $this;
    }

    /**
     * @return bool
     */
    public function isGoogleAuthenticatorEnabled(): bool
    {
        return (bool)$this->googleAuthenticatorSecret;
    }

    /**
     * @return string|null
     */
    public function getGoogleAuthenticatorSecret(): ?string
    {
        return $this->googleAuthenticatorSecret;
    }

    /**
     * @param string|null $googleAuthenticatorSecret
     */
    public function setGoogleAuthenticatorSecret(?string $googleAuthenticatorSecret): void
    {
        $this->googleAuthenticatorSecret = $googleAuthenticatorSecret;
    }

    /**
     * @return string|null
     */
    public function getGoogleAuthQrCode(): ?string
    {
        return $this->googleAuthQrCode;
    }

    /**
     * @param string|null $googleAuthQrCode
     */
    public function setGoogleAuthQrCode(?string $googleAuthQrCode): void
    {
        $this->googleAuthQrCode = $googleAuthQrCode;
    }

    /**
     * @return bool|null
     */
    public function getIsOnline(): ?bool
    {
        return $this->isOnline;
    }

    /**
     * @param bool|null $isOnline
     */
    public function setIsOnline(?bool $isOnline): void
    {
        $this->isOnline = $isOnline;
    }

    /**
     * @param string $registrationIp
     * @return User
     */
    public function setRegistrationIp(string $registrationIp): User
    {
        $this->registrationIp = $registrationIp;

        return $this;
    }

    /**
     * @return string
     */
    public function getRegistrationIp(): string
    {
        return $this->registrationIp;
    }

    /**
     * @param int $lastActivity
     * @return self
     */
    public function setLastActivity(int $lastActivity): self
    {
        $this->lastActivity = $lastActivity;

        return $this;
    }

    /**
     * @return int
     */
    public function getLastActivity(): int
    {
        return $this->lastActivity;
    }

    /**
     * @return MediaObject|null
     */
    public function getMediaObject(): ?MediaObject
    {
        return $this->mediaObject;
    }

    /**
     * @param MediaObject|null $mediaObject
     * @return $this
     */
    public function setMediaObject(?MediaObject $mediaObject): self
    {
        $this->mediaObject = $mediaObject;

        return $this;
    }

    /**
     * @return Collection|Balance[]
     */
    public function getBalances(): Collection
    {
        return $this->balances;
    }

    public function addBalance(Balance $balance): self
    {
        if (!$this->balances->contains($balance)) {
            $this->balances[] = $balance;
            $balance->setUser($this);
        }

        return $this;
    }

    public function removeBalance(Balance $balance): self
    {
        if ($this->balances->removeElement($balance)) {
            // set the owning side to null (unless already changed)
            if ($balance->getUser() === $this) {
                $balance->setUser(null);
            }
        }

        return $this;
    }
}


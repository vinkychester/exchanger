<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\{ApiFilter, ApiResource};
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\NumericFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\ExistsFilter;
use App\Repository\ClientRepository;
use App\Resolver\AccountChangePasswordMutationResolver;
use App\Resolver\AuthenticatorSecretResolver;
use App\Resolver\ChangePasswordMutationResolver;
use App\Resolver\Client\ClientWithAllGenerationsItemResolver;
use App\Resolver\Client\GetClientLoyaltyStatisticResolver;
use App\Resolver\Client\ProgramLoyaltyClientResolver;
use App\Resolver\ClientStatisticCollectionResolver;
use App\Resolver\ConfirmationMutationResolver;
use App\Resolver\ForgotPasswordMutationResolver;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\OneToOne;
use Doctrine\ORM\PersistentCollection;
use Exception;
use Symfony\Component\Security\Core\Validator\Constraints as SecurityAssert;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use App\Filter\RequisitionExistFilter;


/**
 * @ORM\Entity(repositoryClass=ClientRepository::class)
 * @ApiResource(
 *     attributes={"order"={"createdAt": "DESC"}, "pagination_client_enabled"=true, "pagination_type"="page"},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *         "item_query"={
 *              "normalization_context"={"groups"={"user:item_query"}},
 *              "security"="(is_granted('ROLE_CLIENT') and object === user) or is_granted('ROLE_MANAGER') or is_granted('ROLE_ADMIN')",
 *         },
 *         "collection_query"={
 *              "normalization_context"={"groups"={"user:collection_query"}},
 *              "security"="is_granted('ROLE_MANAGER') or is_granted('ROLE_ADMIN') or is_granted('ROLE_SEO')"
 *         },
 *         "create"={
 *             "normalization_context"={"groups"={"user:collection_query"}},
 *             "denormalization_context"={"groups"={"user:mutation"}},
 *             "security"="is_granted('IS_AUTHENTICATED_ANONYMOUSLY')",
 *         },
 *         "update"={
 *              "denormalization_context"={"groups"={"admins:update_user"}},
 *              "security"="is_granted('ROLE_ADMIN') or (is_granted('ROLE_CLIENT') and object === user)",
 *         },
 *         "forgotPasswordMutation"={
 *              "mutation"=ForgotPasswordMutationResolver::class,
 *              "args"={"email"={"type"="String!"}},
 *              "validation_groups"={"anonim:forgot-password"},
 *              "security"="is_granted('IS_AUTHENTICATED_ANONYMOUSLY')",
 *         },
 *         "changePasswordMutation"={
 *              "mutation"=ChangePasswordMutationResolver::class,
 *              "args"={
 *                  "token"={"type"="String!"},
 *                  "newPassword"={"type"="String!"},
 *                  "newRetypedPassword"={"type"="String!"}
 *              },
 *              "normalization_context"={"groups"={"user:change-password"}},
 *              "denormalization_context"={"groups"={"change-password"}},
 *              "validation_groups"={"anonim:change-password"},
 *              "validate"=false,
 *              "security"="is_granted('IS_AUTHENTICATED_ANONYMOUSLY')",
 *         },
 *         "accountChangePasswordMutation"={
 *              "mutation"=AccountChangePasswordMutationResolver::class,
 *              "args"={
 *                  "id"={"type"="ID!"},
 *                  "oldPassword"={"type"="String!"},
 *                  "newPassword"={"type"="String!"},
 *                  "newRetypedPassword"={"type"="String!"}
 *              },
 *              "security"="is_granted('ROLE_CLIENT') and object === user",
 *              "normalization_context"={"groups"={"user:change-password"}},
 *              "denormalization_context"={"groups"={"client:change-password"}},
 *              "validation_groups"={"client:change-password"},
 *              "validate"=false
 *         },
 *         "confirmationMutation"={
 *              "mutation"=ConfirmationMutationResolver::class,
 *              "args"={"token"={"type"="String!"}},
 *              "security"="is_granted('IS_AUTHENTICATED_ANONYMOUSLY')",
 *         },
 *         "getAuthenticatorSecret"={
 *              "item_query"=AuthenticatorSecretResolver::class,
 *              "security_post_denormalize"="is_granted('ROLE_CLIENT') and object === user",
 *         },
 *         "userWithAllGenerations"={
 *              "item_query"=ClientWithAllGenerationsItemResolver::class,
 *              "args"={
 *                  "userID"={"type"="String!"},
 *              },
 *              "security"="is_granted('ROLE_CLIENT')",
 *         },
 *         "programLoyalty"={
 *              "item_query"=ProgramLoyaltyClientResolver::class,
 *              "args"={
 *                  "userID"={"type"="String!"},
 *              },
 *         },
 *         "getStatistic"={
 *              "collection_query"=ClientStatisticCollectionResolver::class,
 *              "security"="is_granted('ROLE_ADMIN')",
 *         },
 *         "getLoyaltyStatistic"={
 *              "item_query"=GetClientLoyaltyStatisticResolver::class,
 *              "normalization_context"={"groups"={"user:item_query"}},
 *              "security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_CLIENT')"
 *         }
 *     }
 * )
 * @ApiFilter(SearchFilter::class, properties={
 *     "token": "exact",
 *     "firstname": "partial",
 *     "lastname": "partial",
 *     "status": "partial",
 *     "email": "partial",
 *     "trafficToken":"exact",
 *     "referralUserRelations.level": "exact",
 *     "referralClientLevels.referralLevel.name": "exact"
 * })
 * @ApiFilter(ExistsFilter::class, properties={"requisitions"})
 * @ApiFilter(BooleanFilter::class, properties={"isEnabled", "isBanned", "isVerified", "isDeleted"})
 * @ApiFilter(RangeFilter::class, properties={"createdAt", "requisitions.createdAt"})
 * @ApiFilter(NumericFilter::class, properties={"trafficLink.id"})
 * @ApiFilter(RequisitionExistFilter::class, properties={"requisitionExist"})
 * @ORM\EntityListeners(value={"App\EntityListener\ClientEntityListener"})
 */
class Client extends User
{

    public const ROLE_DEFAULT          = self::CLIENT;
    public const REGISTRATION_DEFAULT  = 'default';
    public const REGISTRATION_TRAFFIC  = 'traffic';
    public const REGISTRATION_REFERRAL = 'referral';

    public const STATUS_STABLE         = "stable";
    public const STATUS_TRUSTED        = "trusted";
    public const STATUS_SUSPICIOUS     = "suspicious";

    /**
     * @var string
     * @ORM\Column(type="string", length=20)
     * @Groups({"user:read", "user:collection_query", "verificationSchema:collection_query", "user:item_query", "referral-user-relation:item_query"})
     */
    private string $status;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=Requisition::class, mappedBy="client", fetch="EAGER")
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     *     "referral-user-relation:collection_query",
     *     "referral-user-relation:item_query"
     * })
     */
    private $requisitions;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=ReferralClientLevel::class, mappedBy="client", orphanRemoval=true)
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private $referralClientLevels;

    /**
     * @var PersistentCollection|null
     * @ORM\OneToMany(targetEntity=CashbackClientLevel::class, mappedBy="client", orphanRemoval=true)
     */
    private $cashbackClientLevels;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=ReferralUserRelation::class, mappedBy="client")
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private $referralUserRelations;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=PayoutRequisition::class, mappedBy="client")
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private PersistentCollection $payoutRequisitions;

    /**
     * @var bool|null
     * @ORM\Column(type="boolean", options={"default" : false})
     * @Groups({"user:item_query", "user:collection_query", "referral-user-relation:item_query"})
     */
    private ?bool $isVerified = false;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=ClientVerificationSchema::class, mappedBy="client")
     * @Groups({"admins:update_user"})
     */
    private PersistentCollection $clientVerificationSchema;

    /**
     * @var array
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private array $verificationInfo = [];

    /**
     * @var string|null
     * @Groups({"change-password", "anonim:change-password", "client:change-password"})
     * @Assert\NotBlank(groups={"change-password", "client:change-password"})
     * @Assert\Regex(
     *     pattern="/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}/",
     *     message="Пароль не должен быть меньше восьми символов и содержать как минимум одну цифру, одну заглавную букву и одну строчную букву",
     *     groups={"change-password", "anonim:change-password", "client:change-password"}
     * )
     */
    private ?string $newPassword = "";

    /**
     * @var string|null
     * @Groups({"change-password", "anonim:change-password", "client:change-password"})
     * @Assert\NotBlank(groups={"change-password", "client:change-password"})
     * @Assert\Expression(
     *     "this.getNewPassword() === this.getNewRetypedPassword()",
     *     message="Пароли не совпадают",
     *     groups={"change-password", "anonim:change-password", "client:change-password"}
     * )
     * @Assert\Expression(
     *     "this.getOldPassword() != this.getNewRetypedPassword()",
     *     message="Новый пароль не должен совпадать со старым паролем.",
     *     groups={"change-password", "client:change-password"}
     * )
     */
    private ?string $newRetypedPassword = "";

    /**
     * @var string|null
     * @Groups({"client:change-password"})
     * @Assert\NotBlank(groups={"client:change-password"})
     * @SecurityAssert\UserPassword(
     *     message="Это значение должно быть текущим паролем пользователя",
     *     groups={"client:change-password"}
     * )
     */
    private ?string $oldPassword = "";

    /**
     * @ORM\Column(type="string", length=100, unique=true)
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private $referralToken;

    /**
     * @ORM\Column(type="string",length=150, nullable=true)
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private $trafficToken;

    /**
     * Calculated field
     * Used in userWithAllGenerations query
     * @Groups({
     *     "referral-user-relation:collection_query",
     *     "referral-user-relation-relation:item_query",
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private array $invitedUsersStorage;

    /**
     * @OneToOne(targetEntity="ClientBalance", cascade={"persist", "remove"})
     * @Groups({
     *     "referral-user-relation:collection_query",
     *     "referral-user-relation-relation:item_query",
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private $clientBalance;

    /**
     * @Groups({
     *     "referral-user-relation:collection_query",
     *     "referral-user-relation-relation:item_query",
     *     "user:item_query",
     *     "user:collection_query",
     * })
     * @ORM\Column(type="string", length=25, options={"default": "default"})
     */
    private string $registrationType;

    /**
     * @var float
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query"
     * })
     */
    private $referralSystemProfit = 0;

    /**
     * @var float
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query"
     * })
     */
    private $availableReward = 0;

    /**
     * @var float
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query"
     * })
     */
    private $cashbackProfit = 0;

    /**
     * @var float|null
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query"
     * })
     */
    private $availableRewardReferrals = 0;

    /**
     * Calculated field
     * Used in programLoyalty query
     * @Groups({
     *     "cashback-level:collection_query",
     *     "cashback-level:item_query",
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private ?CashbackLevel $nextCashbackLevel;

    /**
     * @ORM\ManyToOne(targetEntity="TrafficLink",inversedBy="client")
     * @Groups({
     *     "read",
     *     "cashback-level:collection_query",
     *     "cashback-level:item_query",
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private ?TrafficLink $trafficLink = null;

    /**
     * @var float|null
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private ?float $balance = 0;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=ReferralUserRelation::class, mappedBy="invitedUser", orphanRemoval=true)
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private $ancestors;

    /**
     * @var float|null
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private ?float $cashbackBalance = 0;

    /**
     * @var float|null
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private ?float $referralBalance = 0;

    /**
     * @var float|null
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private ?float $totalBalance = 0;

    /**
     * @var string
     * @Groups({
     *     "user:item_query",
     * })
     */
    private string $tempSecret;

    /**
     * @var string
     * @Groups({
     *     "user:item_query",
     * })
     */
    private string $tempQRCode;

    /**
     * @ORM\Column(type="boolean", options={"default" : false}, nullable=true)
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     *     "admins:update_user",
     * })
     */
    private ?bool $isDeleted = false;


    /**
     * Client constructor.
     * @throws Exception
     */
    public function __construct()
    {
        parent::__construct();
        $this->isDeleted = false;
        $this->status = self::STATUS_STABLE;
        $this->referralToken = substr(bin2hex(random_bytes(20)), 0, 20);
        $this->requisitions = new ArrayCollection();
        $this->referralUserRelations = new ArrayCollection();
        $this->referralClientLevels = new ArrayCollection();
        $this->registrationType = self::REGISTRATION_DEFAULT;
        $this->cashbackClientLevels = new ArrayCollection();
        $this->ancestors = new ArrayCollection();
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
     * @return $this
     */
    public function setStatus(string $status): self
    {
        $this->status = $status;

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
            $requisition->setClient($this);
        }

        return $this;
    }

    /**
     * @param Requisition $requisition
     * @return $this
     */
    public function removeRequisition(Requisition $requisition): self
    {
        if ($this->requisitions->contains($requisition)) {
            $this->requisitions->removeElement($requisition);
            // set the owning side to null (unless already changed)
            if ($requisition->getClient() === $this) {
                $requisition->setClient(null);
            }
        }

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
    public function getNewPassword(): ?string
    {
        return $this->newPassword;
    }

    /**
     * @param string $newPassword
     * @return $this
     */
    public function setNewPassword(string $newPassword): self
    {
        $this->newPassword = $newPassword;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getNewRetypedPassword(): ?string
    {
        return $this->newRetypedPassword;
    }

    /**
     * @param string $newRetypedPassword
     * @return $this
     */
    public function setNewRetypedPassword(string $newRetypedPassword): self
    {
        $this->newRetypedPassword = $newRetypedPassword;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getOldPassword(): ?string
    {
        return $this->oldPassword;
    }

    /**
     * @param string $oldPassword
     * @return $this
     */
    public function setOldPassword(string $oldPassword): self
    {
        $this->oldPassword = $oldPassword;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getReferralToken(): ?string
    {
        return $this->referralToken;
    }

    /**
     * @param string $referralToken
     * @return $this
     */
    public function setReferralToken(string $referralToken): self
    {
        $this->referralToken = $referralToken;

        return $this;
    }

    /**
     * @return PersistentCollection
     */
    public function getReferralClientLevels(): PersistentCollection
    {
        return $this->referralClientLevels;
    }

    /**
     * @return PersistentCollection
     */
    public function getReferralUserRelations(): PersistentCollection
    {
        return $this->referralUserRelations;
    }

    /**
     * @return PersistentCollection
     */
    public function getPayoutRequisitions(): PersistentCollection
    {
        return $this->payoutRequisitions;
    }

    /**
     * @param PersistentCollection $payoutRequisitions
     */
    public function setReferralUserRelations(PersistentCollection $payoutRequisitions): void
    {
        $this->payoutRequisitions = $payoutRequisitions;
    }

    /**
     * @return array
     */
    public function getInvitedUsersStorage(): array
    {
        return $this->invitedUsersStorage;
    }

    /**
     * @param array $invitedUsersStorage
     */
    public function setInvitedUsersStorage(array $invitedUsersStorage): void
    {
        $this->invitedUsersStorage = $invitedUsersStorage;
    }

    /**
     * @return string|null
     */
    public function getRegistrationType(): ?string
    {
        return $this->registrationType;
    }

    /**
     * @param string $registrationType
     * @return $this
     */
    public function setRegistrationType(string $registrationType): self
    {
        $this->registrationType = $registrationType;

        return $this;
    }

    /**
     * @param bool|null $isVerified
     * @return Client
     */
    public function setIsVerified(?bool $isVerified): Client
    {
        $this->isVerified = $isVerified;

        return $this;
    }

    /**
     * @return bool|null
     */
    public function getIsVerified(): ?bool
    {
        return $this->isVerified;
    }

    /**
     * @param array $verificationInfo
     * @return Client
     */
    public function setVerificationInfo(array $verificationInfo): Client
    {
        $this->verificationInfo = $verificationInfo;

        return $this;
    }

    /**
     * @return array
     */
    public function getVerificationInfo(): array
    {
        return $this->verificationInfo;
    }

    /**
     * @param PersistentCollection $referralClientLevels
     */
    public function setReferralClientLevels(PersistentCollection $referralClientLevels): void
    {
        $this->referralClientLevels = $referralClientLevels;
    }

    /**
     * @return ArrayCollection|PersistentCollection|null
     */
    public function getCashbackClientLevels()
    {
        return $this->cashbackClientLevels;
    }

    /**
     * @param PersistentCollection $cashbackClientLevels
     */
    public function setCashbackClientLevels(PersistentCollection $cashbackClientLevels): void
    {
        $this->cashbackClientLevels = $cashbackClientLevels;
    }

    /**
     * @return mixed
     */
    public function getClientBalance()
    {
        return $this->clientBalance;
    }

    /**
     * @param mixed $clientBalance
     */
    public function setClientBalance($clientBalance): void
    {
        $this->clientBalance = $clientBalance;
    }

    /**
     * @return float
     */
    public function getReferralSystemProfit(): float
    {
        return $this->referralSystemProfit;
    }

    /**
     * @param float $referralSystemProfit
     * @return Client
     */
    public function setReferralSystemProfit(float $referralSystemProfit): Client
    {
        $this->referralSystemProfit = $referralSystemProfit;

        return $this;
    }

    /**
     * @return CashbackLevel|null
     */
    public function getNextCashbackLevel(): ?CashbackLevel
    {
        return $this->nextCashbackLevel;
    }

    /**
     * @param CashbackLevel|null $nextCashbackLevel
     */
    public function setNextCashbackLevel(?CashbackLevel $nextCashbackLevel): void
    {
        $this->nextCashbackLevel = $nextCashbackLevel;
    }

    /**
     * @return float
     */
    public function getAvailableReward(): float
    {
        return $this->availableReward;
    }

    /**
     * @param float $availableReward
     * @return Client
     */
    public function setAvailableReward(float $availableReward): Client
    {
        $this->availableReward = $availableReward;

        return $this;
    }

    /**
     * @return float
     */
    public function getCashbackProfit()
    {
        return $this->cashbackProfit;
    }

    /**
     * @param float $cashbackProfit
     * @return Client
     */
    public function setCashbackProfit(float $cashbackProfit): Client
    {
        $this->cashbackProfit = $cashbackProfit;

        return $this;
    }

    /**
     * @param mixed $trafficToken
     * @return Client
     */
    public function setTrafficToken($trafficToken)
    {
        $this->trafficToken = $trafficToken;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getTrafficToken()
    {
        return $this->trafficToken;
    }

    /**
     * @return float|null
     */
    public function getAvailableRewardReferrals(): ?float
    {
        return $this->availableRewardReferrals;
    }

    /**
     * @param float|null $availableRewardReferrals
     */
    public function setAvailableRewardReferrals(?float $availableRewardReferrals): void
    {
        $this->availableRewardReferrals = $availableRewardReferrals;
    }

    /**
     * @return PersistentCollection
     */
    public function getClientVerificationSchema(): PersistentCollection
    {
        return $this->clientVerificationSchema;
    }

    /**
     * @param PersistentCollection $clientVerificationSchema
     */
    public function setClientVerificationSchema(PersistentCollection $clientVerificationSchema): void
    {
        $this->clientVerificationSchema = $clientVerificationSchema;
    }

    /**
     * @return TrafficLink|null
     */
    public function getTrafficLink(): ?TrafficLink
    {
        return $this->trafficLink;
    }

    /**
     * @param TrafficLink|null $trafficLink
     */
    public function setTrafficLink(?TrafficLink $trafficLink): void
    {
        $this->trafficLink = $trafficLink;
    }

    /**
     * @return float|null
     */
    public function getBalance(): ?float
    {
        return $this->balance;
    }

    /**
     * @param float|null $balance
     * @return self
     */
    public function setBalance(?float $balance): self
    {
        $this->balance = $balance;

        return $this;
    }

    /**
     * @return Collection|ReferralUserRelation[]
     */
    public function getAncestors(): Collection
    {
        return $this->ancestors;
    }

    /**
     * @param ReferralUserRelation $ancestor
     * @return $this
     */
    public function addAncestor(ReferralUserRelation $ancestor): self
    {
        if (!$this->ancestors->contains($ancestor)) {
            $this->ancestors[] = $ancestor;
            $ancestor->setInvitedUser($this);
        }

        return $this;
    }

    /**
     * @param ReferralUserRelation $ancestor
     * @return $this
     */
    public function removeAncestor(ReferralUserRelation $ancestor): self
    {
        if ($this->ancestors->removeElement($ancestor)) {
            // set the owning side to null (unless already changed)
            if ($ancestor->getInvitedUser() === $this) {
                $ancestor->setInvitedUser(null);
            }
        }

        return $this;
    }

    /**
     * @return float|null
     */
    public function getCashbackBalance(): ?float
    {
        return $this->cashbackBalance;
    }

    /**
     * @param float $cashbackBalance
     * @return $this
     */
    public function setCashbackBalance(float $cashbackBalance): self
    {
        $this->cashbackBalance = $cashbackBalance;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getReferralBalance(): ?float
    {
        return $this->referralBalance;
    }

    /**
     * @param float $referralBalance
     * @return $this
     */
    public function setReferralBalance(float $referralBalance): self
    {
        $this->referralBalance = $referralBalance;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getTotalBalance(): ?float
    {
        return $this->totalBalance;
    }

    /**
     * @param float $totalBalance
     * @return $this
     */
    public function setTotalBalance(float $totalBalance): self
    {
        $this->totalBalance = $totalBalance;

        return $this;
    }

    /**
     * @return string
     */
    public function getTempSecret(): string
    {
        return $this->tempSecret;
    }

    /**
     * @param string $tempSecret
     */
    public function setTempSecret(string $tempSecret): void
    {
        $this->tempSecret = $tempSecret;
    }

    /**
     * @return string
     */
    public function getTempQRCode(): string
    {
        return $this->tempQRCode;
    }

    /**
     * @param string $tempQRCode
     */
    public function setTempQRCode(string $tempQRCode): void
    {
        $this->tempQRCode = $tempQRCode;
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
}

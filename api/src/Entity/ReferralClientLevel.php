<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Traits\TimestampableTrait;
use App\Repository\ReferralClientLevelRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Action\NotFoundAction;
use App\Resolver\ReferralClientLevel\UpdateUserReferralClientLevelMutationResolver;
use App\Resolver\ReferralClientLevel\CreateVipLevelResolver;
use App\Resolver\ReferralClientLevel\UpdateWithLogReferralClientLevelResolver;
use App\Resolver\ReferralClientLevel\CreateLevelResolver;
use App\Resolver\ReferralClientLevel\UpdateUserParentsLevelMutationResolver;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\{BooleanFilter, NumericFilter, SearchFilter};
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ReferralClientLevelRepository::class)
 * @ApiResource(
 *     attributes={
 *          "pagination_type"="page",
 *          "pagination_client_enabled"=true
 *     },
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *          "delete",
 *          "update"={"groups"={"referral-client-level:update_mutation"}},
 *          "collection_query"={"normalization_context"={"groups"={"referral-client-level:collection_query"}}},
 *          "item_query"={"normalization_context"={"groups"={"referral-client-level:item_query"}}},
 *          "updateUser"={
 *              "mutation"=UpdateUserReferralClientLevelMutationResolver::class,
 *              "args"={
 *                  "clientRefToken"={"type"="String!"},
 *              },
 *              "security"="is_granted('IS_AUTHENTICATED_ANONYMOUSLY')",
 *          },
 *          "updateUserParents"={
 *              "mutation"=UpdateUserParentsLevelMutationResolver::class,
 *              "args"={
 *                  "userID"={"type"="String!"},
 *              },
 *              "security"="is_granted('IS_AUTHENTICATED_ANONYMOUSLY')",
 *          },
 *          "createVip"={
 *               "mutation"=CreateVipLevelResolver::class,
 *               "args"={
 *                  "referralClientLevelID"={"type"="Int!"},
 *                  "referralLevelID"={"type"="Int!"}
 *               }
 *          },
 *          "createIfNotExist"={
 *               "mutation"=CreateLevelResolver::class,
 *               "args"={
 *                  "clientID"={"type"="String!"},
 *                  "referralLevelID"={"type"="Int!"}
 *               }
 *          },
 *          "updateWithLog"={
 *              "mutation"=UpdateWithLogReferralClientLevelResolver::class,
 *              "args"={
 *                  "referralClientLevelID"={"type"="Int!"},
 *                  "referralLevelID"={"type"="Int!"}
 *               }
 *          },
 *     }
 * )
 * @ApiFilter(NumericFilter::class, properties={"referralLevel.id"})
 * @ApiFilter(SearchFilter::class, properties={"client.id": "exact"})
 * @ApiFilter(BooleanFilter::class, properties={"status", "isCurrent"})
 */
class ReferralClientLevel
{
    use TimestampableTrait;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id;

    /**
     * @ORM\ManyToOne(targetEntity=Client::class, inversedBy="referralClientLevels")
     * @Groups({
     *     "referral-client-level:collection_query",
     *     "referral-client-level:item_query",
     *     "referral-client-level:create_mutation",
     * })
     */
    private $client;

    /**
     * @ORM\ManyToOne(targetEntity=ReferralLevel::class, inversedBy="referralClientLevels")
     * @Groups({
     *     "referral-client-level:collection_query",
     *     "referral-client-level:item_query",
     *     "referral-client-level:create_mutation",
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private $referralLevel;

    /**
     * @ORM\Column(type="float")
     * @Groups({
     *     "referral-client-level:collection_query",
     *     "referral-client-level:item_query",
     *     "referral-client-level:create_mutation",
     *     "referral-client-level:update_mutation",
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private ?float $profit;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({
     *     "referral-client-level:collection_query",
     *     "referral-client-level:item_query",
     *     "referral-client-level:create_mutation",
     *     "referral-client-level:update_mutation",
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private ?bool $status;

    /**
     * @ORM\Column(type="integer")
     * @Groups({
     *     "referral-client-level:collection_query",
     *     "referral-client-level:item_query",
     *     "referral-client-level:create_mutation",
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private ?int $updatedAt;

    /**
     * @Groups({
     *     "referral-client-level:collection_query",
     *     "referral-client-level:item_query",
     *     "referral-client-level:create_mutation",
     * })
     */
    private ?int $referralLevelUsersAmount;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({
     *     "referral-client-level:collection_query",
     *     "referral-client-level:item_query",
     *     "referral-client-level:create_mutation",
     * })
     */
    private $isCurrent;

    /**
     * ReferralClientLevel constructor.
     */
    public function __construct()
    {
        $this->updatedAt = time();
        $this->createdAt = time();
        $this->status = true;
        $this->profit = 0;
        $this->referralLevelUsersAmount = 0;
        $this->isCurrent = true;
    }

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return bool|null
     */
    public function getStatus(): ?bool
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
     * @return int|null
     */
    public function getUpdatedAt(): ?int
    {
        return $this->updatedAt;
    }

    /**
     * @return $this
     */
    public function setUpdatedAt(): self
    {
        $this->updatedAt = time();

        return $this;
    }

    /**
     * @return mixed
     */
    public function getClient()
    {
        return $this->client;
    }

    /**
     * @param mixed $client
     */
    public function setClient($client): void
    {
        $this->client = $client;
    }

    /**
     * @return ReferralLevel|null
     */
    public function getReferralLevel(): ?ReferralLevel
    {
        return $this->referralLevel;
    }

    /**
     * @param ReferralLevel|null $referralLevel
     * @return $this
     */
    public function setReferralLevel(?ReferralLevel $referralLevel): self
    {
        $this->referralLevel = $referralLevel;

        return $this;
    }

    /**
     * @return bool|null
     */
    public function getIsCurrent(): ?bool
    {
        return $this->isCurrent;
    }

    /**
     * @param bool $isCurrent
     * @return $this
     */
    public function setIsCurrent(bool $isCurrent): self
    {
        $this->isCurrent = $isCurrent;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getProfit(): ?float
    {
        return $this->profit;
    }

    /**
     * @param float|null $profit
     */
    public function setProfit(?float $profit): void
    {
        $this->profit = $profit;
    }
}

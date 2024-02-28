<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\NumericFilter;
use App\Repository\ReferralUserRelationRepository;
use App\Resolver\ReferralUserRelation\CreateReferralRelationMutationResolver;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=ReferralUserRelationRepository::class)
 * @ApiResource(
 *     attributes={
 *          "pagination_type"="page",
 *          "pagination_client_enabled"=true
 *     },
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *          "delete",
 *          "update"={"groups"={"referral-user-relation:update_mutation"}},
 *          "collection_query"={"normalization_context"={"groups"={"referral-user-relation:collection_query"}}},
 *          "item_query"={"normalization_context"={"groups"={"referral-user-relation:item_query"}}},
 *          "create"={"denormalization_context"={"groups"={"referral-user-relation:create"}}},
 *          "onCreate"={
 *              "mutation"=CreateReferralRelationMutationResolver::class,
 *              "args"={
 *                  "inviterEmail"={"type"="String!"},
 *                  "invitedUserID"={"type"="String!"},
 *              },
 *              "security"="is_granted('IS_AUTHENTICATED_ANONYMOUSLY')",
 *          },
 *     }
 * )
 * @ApiFilter(SearchFilter::class, properties={
 *     "invitedUser.id": "exact",
 *     "client.id": "exact",
 *     "invitedUser.firstname": "partial",
 *     "invitedUser.lastname": "partial",
 *     "invitedUser.email": "partial",
 *     "invitedUser.status": "partial"
 *     })
 * @ApiFilter(BooleanFilter::class, properties={"invitedUser.isVerified","invitedUser.isEnabled"})
 * @ApiFilter(NumericFilter::class, properties={"level": "exact"})
 * @ORM\EntityListeners(value={"App\EntityListener\ReferralUserRelationEntityListener"})
 */
class ReferralUserRelation
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id;

    /**
     * @var ?Client
     * @ORM\ManyToOne(targetEntity=Client::class, inversedBy="referralUserRelations")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({
     *     "referral-user-relation:collection_query",
     *     "referral-user-relation:item_query",
     *     "referral-user-relation:create",
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private Client $client;

    /**
     * @var int
     * @ORM\Column(type="integer")
     * @Groups({
     *     "referral-user-relation:collection_query",
     *     "referral-user-relation:item_query",
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private int $date;

    /**
     * @var int
     * @Groups({
     *     "referral-user-relation:collection_query",
     *     "referral-user-relation:item_query",
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private int $generation;

    /**
     * @var int|null
     * @ORM\Column(type="integer")
     * @Groups({
     *     "referral-user-relation:collection_query",
     *     "referral-user-relation:item_query",
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private ?int $level;

    /**
     * @var Client
     * @ORM\ManyToOne(targetEntity=Client::class, inversedBy="ancestors")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({
     *     "referral-user-relation:collection_query",
     *     "referral-user-relation:item_query",
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private Client $invitedUser;

    public function __construct()
    {
        $this->date = time();
        $this->level = 1;
    }

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Client
     */
    public function getClient(): Client
    {
        return $this->client;
    }

    /**
     * @param Client
     */
    public function setClient(Client $client): void
    {
        $this->client = $client;
    }

    /**
     * @return ?Client
     */
    public function getInvitedUser(): ?Client
    {
        return $this->invitedUser;
    }

    /**
     * @param Client $invitedUser
     * @return $this
     */
    public function setInvitedUser(Client $invitedUser): self
    {
        $this->invitedUser = $invitedUser;

        return $this;
    }

    /**
     * @return int|null
     */
    public function getDate(): ?int
    {
        return $this->date;
    }

    /**
     * @param Int $date
     * @return $this
     */
    public function setDate(Int $date): self
    {
        $this->date = $date;

        return $this;
    }

    /**
     * @return int
     */
    public function getGeneration(): int
    {
        return $this->generation;
    }

    /**
     * @param int $generation
     */
    public function setGeneration(int $generation): void
    {
        $this->generation = $generation;
    }

    /**
     * @return int|null
     */
    public function getLevel(): ?int
    {
        return $this->level;
    }

    /**
     * @param int $level
     * @return $this
     */
    public function setLevel(int $level): self
    {
        $this->level = $level;

        return $this;
    }
}

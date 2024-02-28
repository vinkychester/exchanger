<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\{SearchFilter, RangeFilter};
use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Traits\TimestampableTrait;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Action\NotFoundAction;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Resolver\PayoutRequisition\checkAndUpdatePayoutRequisitionResolver;


/**
 * @ORM\Entity()
 * @ApiResource(
 *     attributes={
 *          "order"={"createdAt": "DESC"},
 *          "pagination_client_enabled"=true,
 *          "pagination_type"="page",
 *
 *     },
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *          "collection_query"={
 *              "normalization_context"={"groups"={"payout-requisition:collection_query"}},
 *          },
 *          "item_query"={
 *              "normalization_context"={"groups"={"payout-requisition:item_query"}},
 *          },
 *          "create"={
 *              "denormalization_context"={"groups"={"payout-requisition:create"}},
 *          },
 *          "checkAndUpdate"={
 *              "mutation"=checkAndUpdatePayoutRequisitionResolver::class,
 *              "args"={
 *                  "id"={"type"="ID!"},
 *                  "status"={"type"="String!"},
 *                  "commentary"={"type"="String"}
 *              },
 *              "groups"={"payout-requisition:update_mutation"},
 *              "security"="(is_granted('ROLE_ADMIN')) or (is_granted('ROLE_MANAGER'))"
 *          },
 *     }
 * )
 * @ApiFilter(SearchFilter::class, properties={
 *     "client.id": "exact", "status": "exact", "client.firstname": "partial", "client.lastname": "partial"
 * })
 * @ApiFilter(RangeFilter::class, properties={"createdAt", "amount"})
 * @ORM\HasLifecycleCallbacks
 * @ORM\EntityListeners(value={"App\EntityListener\PayoutRequisitionEntityListener"})
 */
class PayoutRequisition
{

    public const STATUS_NEW       = "NEW";
    public const STATUS_PROCESSED = "PROCESSED";
    public const STATUS_FINISHED  = "FINISHED";
    public const STATUS_CANCELED  = "CANCELED";

    public const PAYOUT_REQUISITION_TOPIC = "http://coin24/payout_requisitios";

    use TimestampableTrait;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id;

    /**
     * @var float
     * @ORM\Column(type="float")
     * @Groups({
     *     "payout-requisition:create",
     *     "payout-requisition:collection_query",
     *     "payout-requisition:item_query"
     * })
     */
    private float $amount;

    /**
     * @var Client|null
     * @ORM\ManyToOne(targetEntity=Client::class)
     * @ORM\JoinColumn(nullable=false)
     * @Groups({
     *     "payout-requisition:create",
     *     "payout-requisition:collection_query"
     * })
     */
    private ?Client $client;

    /**
     * @var string
     * @ORM\Column(type="string", length=25)
     * @Groups({
     *     "payout-requisition:collection_query",
     * })
     */
    private string $status;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({
     *     "payout-requisition:create",
     *     "payout-requisition:collection_query",
     * })
     */
    private ?string $wallet;

    /**
     * @var ?string
     * @ORM\Column(type="string", length=6000, nullable=true)
     * @Groups({
     *     "payout-requisition:collection_query",
     *     "payout-requisition:item_query"
     * })
     */
    private ?string $commentary = "";

    /**
     * @ORM\Column(type="string", length=20)
     * @Groups({
     *     "payout-requisition:create",
     *     "payout-requisition:collection_query",
     *     "payout-requisition:item_query"
     * })
     */
    private ?string $usdtType = "";

    /**
     * PayoutRequisition constructor.
     */
    public function __construct() {
        $this->status = self::STATUS_NEW;
    }

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return float|null
     */
    public function getAmount(): ?float
    {
        return $this->amount;
    }

    /**
     * @param float $amount
     * @return $this
     */
    public function setAmount(float $amount): self
    {
        $this->amount = $amount;

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
     * @return Client|null
     */
    public function getClient(): ?Client
    {
        return $this->client;
    }

    /**
     * @param Client|null $client
     */
    public function setClient(?Client $client): void
    {
        $this->client = $client;
    }

    public function getWallet(): ?string
    {
        return $this->wallet;
    }

    /**
     * @param string $wallet
     * @return $this
     */
    public function setWallet(string $wallet): self
    {
        $this->wallet = $wallet;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getCommentary(): ?string
    {
        return $this->commentary;
    }

    /**
     * @param string|null $commentary
     * @return $this
     */
    public function setCommentary(?string $commentary): self
    {
        $this->commentary = $commentary;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getUsdtType(): ?string
    {
        return $this->usdtType;
    }

    /**
     * @param string $usdtType
     * @return $this
     */
    public function setUsdtType(string $usdtType): self
    {
        $this->usdtType = $usdtType;

        return $this;
    }
}

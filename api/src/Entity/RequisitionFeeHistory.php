<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Action\NotFoundAction;
use App\Repository\RequisitionFeeHistoryRepository;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Resolver\UpdatePercentRequisitionFeeHistoryResolver;

/**
 * @ApiResource(
 *     attributes={"pagination_enabled"=false},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *         "item_query"={
 *              "normalization_context"={"groups"={"fee-history:item_query"}},
 *              "security"="is_granted('ROLE_CLIENT') or is_granted('ROLE_MANAGER') or is_granted('ROLE_ADMIN')",
 *          },
 *         "collection_query"={
 *              "normalization_context"={"groups"={"fee-history:collection_query"}},
 *              "security"="is_granted('ROLE_CLIENT') or is_granted('ROLE_MANAGER') or is_granted('ROLE_ADMIN')",
 *          },
 *          "updatePercent"={
 *              "mutation"=UpdatePercentRequisitionFeeHistoryResolver::class,
 *              "denormalization_context"={"groups"={"fee-history:mutation_update"}},
 *          }
 *     }
 * )
 * @ORM\Entity(repositoryClass=RequisitionFeeHistoryRepository::class)
 */
class RequisitionFeeHistory
{
    /**
     * @var UuidInterface
     * @ORM\Id()
     * @ORM\Column(type="uuid")
     */
    private UuidInterface $id;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     * @Groups({
     *     "fee-history:item_query",
     *     "fee-history:collection_query",
     *     "requisition:item_query"
     * })
     */
    private ?float $percent;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     * @Groups({
     *     "fee-history:item_query",
     *     "fee-history:collection_query",
     *     "requisition:item_query"
     * })
     */
    private ?float $constant;

    /**
     * @ORM\Column(type="uuid")
     */
    private $requisitionExternalId;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=10)
     * @Groups({
     *     "fee-history:item_query",
     *     "fee-history:collection_query",
     *     "requisition:item_query"
     * })
     */
    private ?string $type;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     * @Groups({
     *     "fee-history:item_query",
     *     "fee-history:collection_query",
     *     "requisition:item_query"
     * })
     */
    private ?float $rate;

    /**
     * @var Requisition
     * @ORM\ManyToOne(targetEntity=Requisition::class, inversedBy="requisitionFeeHistories", cascade={"persist"})
     * @ORM\JoinColumn(nullable=false)
     */
    private Requisition $requisition;

    /**
     * @ORM\Column(type="float")
     * @Groups({
     *     "fee-history:item_query",
     *     "fee-history:collection_query",
     *     "requisition:item_query",
     *     "fee-history:mutation_update"
     * })
     */
    private ?float $pairPercent = 0;

    /**
     * @ORM\Column(type="float")
     * @Groups({
     *     "fee-history:item_query",
     *     "fee-history:collection_query",
     *     "requisition:item_query"
     * })
     */
    private ?float $paymentSystemPrice = 0;

    /**
     * RequisitionFeeHistory constructor.
     */
    public function __construct()
    {
        $this->id = Uuid::uuid4();
    }

    /**
     * @return UuidInterface
     */
    public function getId(): UuidInterface
    {
        return $this->id;
    }

    /**
     * @return float|null
     */
    public function getPercent(): ?float
    {
        return $this->percent;
    }

    /**
     * @param float $percent
     * @return $this
     */
    public function setPercent(float $percent): self
    {
        $this->percent = $percent;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getConstant(): ?float
    {
        return $this->constant;
    }

    /**
     * @param float $constant
     * @return $this
     */
    public function setConstant(float $constant): self
    {
        $this->constant = $constant;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getRequisitionExternalId()
    {
        return $this->requisitionExternalId;
    }

    /**
     * @param $requisitionExternalId
     * @return $this
     */
    public function setRequisitionExternalId($requisitionExternalId): self
    {
        $this->requisitionExternalId = $requisitionExternalId;

        return $this;
    }

    /**
     * @return string|null
     */
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
     * @return float|null
     */
    public function getRate(): ?float
    {
        return $this->rate;
    }

    /**
     * @param float $rate
     * @return $this
     */
    public function setRate(float $rate): self
    {
        $this->rate = $rate;

        return $this;
    }

    /**
     * @return Requisition
     */
    public function getRequisition(): Requisition
    {
        return $this->requisition;
    }

    /**
     * @param Requisition $requisition
     */
    public function setRequisition(Requisition $requisition): void
    {
        $this->requisition = $requisition;
    }

    /**
     * @return float|null
     */
    public function getPairPercent(): ?float
    {
        return $this->pairPercent;
    }

    /**
     * @param float $pairPercent
     * @return $this
     */
    public function setPairPercent(float $pairPercent): self
    {
        $this->pairPercent = $pairPercent;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getPaymentSystemPrice(): ?float
    {
        return $this->paymentSystemPrice;
    }

    /**
     * @param float $paymentSystemPrice
     * @return $this
     */
    public function setPaymentSystemPrice(float $paymentSystemPrice): self
    {
        $this->paymentSystemPrice = $paymentSystemPrice;

        return $this;
    }
}

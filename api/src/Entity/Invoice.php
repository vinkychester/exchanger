<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Traits\TimestampableTrait;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use App\Resolver\InvoiceMutationResolver;
use Doctrine\ORM\PersistentCollection;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *     attributes={"pagination_enabled"=false, "order"={"createdAt": "DESC"}},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *         "item_query",
 *         "collection_query",
 *         "create"={
 *              "mutation"=InvoiceMutationResolver::class,
 *              "denormalization_context"={"groups"={"mutation"}}
 *        }
 *     }
 * )
 * @ORM\Entity()
 * @ORM\HasLifecycleCallbacks
 * @ApiFilter(SearchFilter::class, properties={"requisition", "direction": "exact"})
 */
class Invoice
{

    public const STATUS_NEW                   = 'NEW';
    public const STATUS_PENDING               = 'PENDING';
    public const STATUS_PROCESSED             = 'PROCESSED';
    public const STATUS_STABLING              = 'STABLING';
    public const STATUS_CANCEL                = 'CANCEL';
    public const STATUS_DIRTY                 = 'DIRTY';
    public const STATUS_FAIL                  = 'FAIL';
    public const STATUS_CARD_VERIFICATION     = 'CARD_VERIFICATION';
    public const CALLBACK_TOPIC               = "http://coin24/callback/";
    public const INVOICE_TOPIC                = "http://coin24/invoice/";

    use TimestampableTrait;

    /**
     * @var UuidInterface
     * @ORM\Id()
     * @ORM\Column(type="uuid")
     */
    private UuidInterface $id;

    /**
     * @var float
     * @ORM\Column(type="float")
     * @Groups({
     *     "invoice_item_query",
     *     "requisition:details",
     * })
     */
    private float $paidAmount;

    /**
     * @var Requisition
     * @ORM\ManyToOne(targetEntity=Requisition::class, inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({
     *     "mutation",
     *     "invoice_item_query"
     * })
     */
    private Requisition $requisition;

    /**
     * @var string
     * @ORM\Column(type="string", length=10)
     * @Groups({
     *     "invoice_item_query",
     *     "requisition:details",
     * })
     */
    private string $direction;

    /**
     * @var int
     * @ORM\Column(type="integer")
     */
    private int $createdAt;

    /**
     * @var UuidInterface
     * @ORM\Column(type="uuid")
     */
    private UuidInterface $referenceId;

    /**
     * @var string
     * @ORM\Column(type="string", length=30, nullable=true)
     */
    private string $status;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=FlowData::class, mappedBy="invoice", cascade={"persist"})
     * @Groups({
     *     "invoice_item_query",
     *     "requisition:details",
     *     "requisition:item_query"
     * })
     */
    private $flowData;

    /**
     * @var UuidInterface
     * @ORM\Column(type="uuid", nullable=true)
     */
    private UuidInterface $externalId;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     * @Groups({
     *     "invoice_item_query",
     *     "requisition:details",
     *     "requisition:item_query"
     * })
     */
    private ?float $amount;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({
     *     "invoice_item_query",
     *     "requisition:details",
     *     "requisition:item_query"
     * })
     */
    private ?bool $isPaid;

    /**
     * Invoice constructor.
     */
    public function __construct()
    {
        $this->id = Uuid::uuid4();
        $this->isPaid = false;
        $this->referenceId = Uuid::uuid4();
        $this->paidAmount = 0;
        $this->amount = 0;
        $this->status = self::STATUS_NEW;
        $this->flowData = new ArrayCollection();
    }

    /**
     * @return UuidInterface
     */
    public function getId(): UuidInterface
    {
        return $this->id;
    }

    /**
     * @return float
     */
    public function getPaidAmount(): float
    {
        return $this->paidAmount;
    }

    /**
     * @param float $paidAmount
     * @return $this
     */
    public function setPaidAmount(float $paidAmount): self
    {
        $this->paidAmount = $paidAmount;

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
     * @return $this
     */
    public function setRequisition(Requisition $requisition): self
    {
        $this->requisition = $requisition;

        return $this;
    }

    /**
     * @return string
     */
    public function getDirection(): string
    {
        return $this->direction;
    }

    /**
     * @param string $direction
     * @return $this
     */
    public function setDirection(string $direction): self
    {
        $this->direction = $direction;

        return $this;
    }

    /**
     * @return UuidInterface
     */
    public function getReferenceId(): UuidInterface
    {
        return $this->referenceId;
    }

    /**
     * @param $referenceId
     * @return $this
     */
    public function setReferenceId($referenceId): self
    {
        $this->referenceId = $referenceId;

        return $this;
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
     * @return Collection|FlowData[]
     */
    public function getFlowData(): Collection
    {
        return $this->flowData;
    }

    /**
     * @param FlowData $flowData
     * @return $this
     */
    public function addFlowData(FlowData $flowData): self
    {
        if (!$this->flowData->contains($flowData)) {
            $this->flowData[] = $flowData;
            $flowData->setInvoice($this);
        }

        return $this;
    }

    /**
     * @param FlowData $flowData
     * @return $this
     */
    public function removeFlowData(FlowData $flowData): self
    {
        if ($this->flowData->removeElement($flowData)) {
            // set the owning side to null (unless already changed)
            if ($flowData->getInvoice() === $this) {
                $flowData->setInvoice(null);
            }
        }

        return $this;
    }

    /**
     * @return UuidInterface
     */
    public function getExternalId(): UuidInterface
    {
        return $this->externalId;
    }

    /**
     * @param $externalId
     * @return $this
     */
    public function setExternalId($externalId): self
    {
        $this->externalId = $externalId;

        return $this;
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

    public function getIsPaid(): ?bool
    {
        return $this->isPaid;
    }

    public function setIsPaid(bool $isPaid): self
    {
        $this->isPaid = $isPaid;

        return $this;
    }
}

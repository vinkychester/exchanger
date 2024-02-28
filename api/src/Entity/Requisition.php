<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\{ApiFilter, ApiResource};
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\{ExistsFilter, NumericFilter, RangeFilter, SearchFilter, BooleanFilter};
use App\Controller\StatisticsExcelAction;
use App\Entity\Traits\TimestampableTrait;
use App\Repository\RequisitionRepository;
use App\Resolver\{CreateRequisitionMutationResolver, RequisitionDetailsResolver};
use Doctrine\Common\Collections\{ArrayCollection, Collection};
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\PersistentCollection;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use App\Resolver\CalculateAmountRequisitionMutationResolver;
use App\Filter\CurrencyFilter;
use App\Filter\ExchangeTypeFilter;
use App\Filter\RequisitionRefundFilter;

/**
 * @ApiResource(
 *     attributes={
 *          "order"={"createdAt": "DESC"},
 *          "pagination_client_enabled"=true,
 *          "pagination_type"="page",
 *     },
 *     collectionOperations={
 *          "api_excel_statistics" = {
 *                "method"="GET",
 *                "path"="panel/requisitions/excel",
 *                "controller"=StatisticsExcelAction::class
 *          }
 *     },
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *          "collection_query"={
 *              "normalization_context"={"groups"={"requisition:collection_query"}},
 *              "security"="is_granted('ROLE_CLIENT') or is_granted('ROLE_MANAGER') or is_granted('ROLE_ADMIN')",
 *          },
 *          "item_query"={
 *              "normalization_context"={"groups"={"requisition:item_query"}},
 *              "security"="is_granted('ROLE_CLIENT') or is_granted('ROLE_MANAGER') or is_granted('ROLE_ADMIN')",
 *          },
 *          "create"={
 *              "mutation"=CreateRequisitionMutationResolver::class,
 *              "denormalization_context"={"groups"={"requisition:mutation_create"}},
 *              "security"="is_granted('ROLE_CLIENT') or is_granted('ROLE_MANAGER')",
 *              "args"={
 *                  "pair"={"type"="String!"},
 *                  "paymentAmount"={"type"="Float!"},
 *                  "payoutAmount"={"type"="Float!"},
 *                  "client_id"={"type"="String!"},
 *                  "paymentAttributes"={"type"="Iterable!"},
 *                  "payoutAttributes"={"type"="Iterable!"},
 *                  "savePaymentBankDetails"={"type"="Boolean!"},
 *                  "savePayoutBankDetails"={"type"="Boolean!"},
 *                  "exchangePoint"={"type"="String!"},
 *              }
 *          },
 *          "detailsQuery"={
 *              "item_query"=RequisitionDetailsResolver::class,
 *              "security"="(is_granted('ROLE_CLIENT') and object.getClient().getId() == user.getId()) or is_granted('ROLE_MANAGER') or is_granted('ROLE_ADMIN')",
 *          },
 *          "update"={
 *              "denormalization_context"={"groups"={"update"}},
 *          },
 *          "calculateAmount"={
 *              "mutation"=CalculateAmountRequisitionMutationResolver::class,
 *              "security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_MANAGER')",
 *              "args"={
 *                  "id"={"type"="ID!"},
 *                  "tmpPercent"={"type"="Float!"},
 *              }
 *          }
 *     },
 *     mercure=true
 * )
 * @ORM\HasLifecycleCallbacks()
 * @ORM\Entity(repositoryClass=RequisitionRepository::class)
 * @ApiFilter(NumericFilter::class, properties={"pair.id", "pair.payment.paymentSystem.id", "client.trafficLink.id"})
 * @ApiFilter(BooleanFilter::class, properties={"isSeen"})
 * @ApiFilter(SearchFilter::class, properties={
 *     "client.id": "exact",
 *     "manager.id": "exact",
 *     "bankDetails.attributes.name": "exact",
 *     "bankDetails.attributes.value": "partial",
 *     "client.firstname": "partial",
 *     "client.email": "partial",
 *     "id": "partial",
 *     "client.lastname": "partial",
 *     "status": "exact",
 *     "pair.payment.paymentSystem.name": "exact",
 *     "pair.payment.paymentSystem.subName": "exact",
 *     "pair.payout.paymentSystem.subName": "exact",
 *     "exchangePoint": "exact"
 * })
 * @ApiFilter(RangeFilter::class, properties={
 *     "createdAt",
 *     "endDate",
 *     "paymentAmount",
 *     "payoutAmount",
 *     "manager.requisitions.createdAt",
 * })
 * @ApiFilter(ExistsFilter::class, properties={"manager"})
 * @ApiFilter(CurrencyFilter::class, properties={"currency", "currency"})
 * @ApiFilter(RequisitionRefundFilter::class, properties={"isPaid"})
 * @ApiFilter(ExchangeTypeFilter::class, properties={"exchangeType": "exact"})
 * @ORM\EntityListeners(value={"App\EntityListener\RequisitionEntityListener"})
 */
class Requisition
{

    public const STATUS_NEW                   = 'NEW';
    public const STATUS_PAYMENT               = 'PAYMENT';
    public const STATUS_INVOICE               = 'INVOICE';
    public const STATUS_PENDING               = 'PENDING';
    public const STATUS_PROCESSED             = 'PROCESSED';
    public const STATUS_FINISHED              = 'FINISHED';
    public const STATUS_CANCELED              = 'CANCELED';
    public const STATUS_DISABLED              = 'DISABLED';
    public const STATUS_ERROR                 = 'ERROR';
    public const STATUS_CARD_VERIFICATION     = 'CARD_VERIFICATION';

    public const REQUISITION_TOPIC                = "http://coin24/requisitios";

    public const EXCHANGE_TYPE = "bank";

    use TimestampableTrait;

    /**
     * @var ?UuidInterface
     * @ORM\Id()
     * @ORM\Column(type="uuid")
     */
    private ?UuidInterface $id;

    /**
     * @var float
     * @ORM\Column(type="float")
     * @Assert\Regex(
     *     pattern="/\d/",
     *     match=true,
     *     message="Значение не должно содержать символы"
     * )
     * @Assert\PositiveOrZero(message="Значение не должно быть отрицательным")
     * @Groups({
     *     "requisition:mutation_create",
     *     "requisition:collection_query",
     *     "requisition:item_query"
     * })
     */
    private float $paymentAmount;

    //@Assert\PositiveOrZero(message="Значение не должно быть отрицательным")
    /**
     * @var float
     * @ORM\Column(type="float")
     * @Assert\Regex(
     *     pattern="/\d/",
     *     match=true,
     *     message="Значение не должно содержать символы"
     * )
     *
     * @Groups({
     *     "requisition:mutation_create",
     *     "requisition:collection_query",
     *     "requisition:item_query"
     * })
     */
    private float $payoutAmount;

    /**
     * @ORM\Column(type="string", length=50)
     * @Groups({
     *     "requisition:collection_query",
     *     "requisition:item_query",
     *     "update",
     *     "bank-detail:item_query"
     * })
     */
    private string $status;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     * @Groups({
     *     "requisition:collection_query",
     *     "requisition:item_query"
     * })
     */
    private ?string $blockchainUrl = "";

    /**
     * @var ?Client
     * @ORM\ManyToOne(targetEntity=Client::class, inversedBy="requisitions")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({
     *     "requisition:mutation_create",
     *     "requisition:collection_query",
     *     "requisition:item_query",
     *     "user:collection_query"
     * })
     */
    private ?Client $client;

    /**
     * @var ?Manager
     * @ORM\ManyToOne(targetEntity=Manager::class, inversedBy="requisitions")
     * @ORM\JoinColumn(nullable=true)
     * @Groups({
     *     "requisition:mutation_create",
     *     "requisition:collection_query",
     *     "requisition:item_query",
     *     "update"
     * })
     */
    private ?Manager $manager = null;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=Invoice::class, mappedBy="requisition", cascade={"persist"})
     * @Groups({
     *     "requisition:collection_query",
     *     "requisition:item_query"
     * })
     */
    private $invoices;

    /**
     * @var ?Pair
     * @ORM\ManyToOne(targetEntity=Pair::class, inversedBy="requisitions")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({
     *     "requisition:mutation_create",
     *     "requisition:collection_query",
     *     "requisition:item_query"
     * })
     */
    private ?Pair $pair;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=RequisitionProfitHistory::class, mappedBy="requisition", cascade={"persist"})
     * @Groups({
     *     "requisition:collection_query",
     *     "requisition:item_query"
     * })
     */
    private $requisitionProfitHistories;

    /**
     * @var PersistentCollection
     * @ORM\ManyToMany(targetEntity=BankDetail::class, mappedBy="requisitions", cascade={"persist"})
     * @Groups({
     *     "requisition:item_query",
     *     "requisition:collection_query"
     * })
     */
    private $bankDetails;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     * @Groups({
     *     "requisition:item_query",
     *     "requisition:collection_query"
     * })
     */
    private float $systemProfit = 0;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     * @Groups({
     *     "requisition:item_query",
     *     "requisition:collection_query"
     * })
     */
    private float $course;

    /**
     * @ORM\Column(type="float")
     * @Groups({
     *     "requisition:item_query",
     *     "requisition:collection_query"
     * })
     */
    private float $cleanSystemProfit;

    /**
     * Need for requisition recalculation.
     * It`s value need for displaying correct processed amount in payout controller.
     * @ORM\Column(type="float", options={"default" : 0}, nullable=true)
     * @Groups({
     *     "requisition:item_query",
     *     "requisition:collection_query"
     * })
     */
    private ?float $startPaymentAmount;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=RequisitionFeeHistory::class, mappedBy="requisition", cascade={"persist"})
     * @Groups({
     *     "requisition:collection_query",
     *     "requisition:item_query"
     * })
     */
    private $requisitionFeeHistories;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=5, nullable=true)
     * @Groups({
     *     "requisition:item_query",
     *     "requisition:collection_query",
     *     "requisition:mutation_create"
     * })
     */
    private ?string $exchangePoint;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=3600, nullable=true)
     * @Assert\Regex(
     *     pattern="/^[A-Za-zА-Яа-яёЪІіЇїЄє0-9_\s\.\,\:-]*$/muD",
     *     htmlPattern="^[A-Za-zА-Яа-яёЪІіЇїЄє0-9_\s\.\,\:-]*$",
     *     match=true,
     *     message="Значение не должно содержать спецификаторы"
     * )
     * @Groups({
     *     "requisition:item_query",
     *     "update"
     * })
     */
    private ?string $comment = "";

    /**
     * @var float|null
     * @ORM\Column(type="float", nullable=true)
     */
    private ?float $amountWithFee = 0;

    /**
     * @var float|null
     * @ORM\Column(type="float",options={"default" : 0}, nullable=true)
     * @Groups({
     *     "requisition:item_query",
     *     "requisition:collection_query"
     * })
     */
    private ?float $managerProfit = 0;

    /**
     * @var float|null
     * @ORM\Column(type="float", options={"default" : 0}, nullable=true)
     * @Groups({
     *     "requisition:item_query",
     *     "requisition:collection_query"
     * })
     */
    private ?float $profit = 0;

    /**
     * @var float|null
     * @ORM\Column(type="float",options={"default" : 0}, nullable=true)
     * @Groups({
     *     "requisition:item_query",
     *     "requisition:collection_query"
     * })
     */
    private ?float $recalculatedAmount = 0;

    /**
     * @var float|null
     * @Groups({
     *     "requisition:item_query",
     *     "requisition:collection_query"
     * })
     */
    private ?float $amount = 0;

    /**
     * @var float|null
     * @ORM\Column(type="float",options={"default" : 0}, nullable=true)
     * @Groups({
     *     "requisition:collection_query",
     *     "requisition:item_query"
     * })
     */
    private ?float $pairPercent = 0;

    /**
     * @var float|null
     * @ORM\Column(type="float", options={"default" : 0}, nullable=true)
     * @Groups({
     *     "requisition:item_query",
     *     "requisition:collection_query"
     * })
     */
    private ?float $commission = 0;

    /**
     * @var float|null
     * @Groups({
     *     "requisition:item_query",
     *     "requisition:collection_query"
     * })
     */
    private ?float $tmpCommission = 0;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({
     *     "requisition:item_query",
     *     "requisition:collection_query"
     * })
     */
    private ?int $endDate = 0;

    /**
     * @var bool|null
     * @ORM\Column(type="boolean", options={"default" : 0}, nullable=true)
     * @Groups({
     *     "requisition:item_query",
     *     "requisition:collection_query",
     *     "update"
     * })
     */
    private ?bool $isSeen = false;

    /**
     * Requisition constructor.
     */
    public function __construct()
    {
        $this->id = Uuid::uuid4();
        $this->startPaymentAmount = 0;
        $this->profit = 0;
        $this->systemProfit = 0;
        $this->managerProfit = 0;
        $this->cleanSystemProfit = 0;
        $this->course = 0;
        $this->recalculatedAmount = 0;
        $this->isSeen = false;
        $this->invoices = new ArrayCollection();
        $this->status = self::STATUS_NEW;
        $this->requisitionProfitHistories = new ArrayCollection();
        $this->requisitionFeeHistories = new ArrayCollection();
        $this->bankDetails = new ArrayCollection();
    }

    /**
     * @return ?UuidInterface
     */
    public function getId(): ?UuidInterface
    {
        return $this->id;
    }

    /**
     * @return float
     */
    public function getPaymentAmount(): float
    {
        return $this->paymentAmount;
    }

    /**
     * @param float $paymentAmount
     * @return $this
     */
    public function setPaymentAmount(float $paymentAmount): self
    {
        $this->paymentAmount = $paymentAmount;

        return $this;
    }

    /**
     * @return float
     */
    public function getPayoutAmount(): float
    {
        return $this->payoutAmount;
    }

    /**
     * @param float $payoutAmount
     * @return $this
     */
    public function setPayoutAmount(float $payoutAmount): self
    {
        $this->payoutAmount = $payoutAmount;

        return $this;
    }

    /**
     * @return string|null
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
     * @return string|null
     */
    public function getBlockchainUrl(): ?string
    {
        return $this->blockchainUrl;
    }

    /**
     * @param string|null $blockchainUrl
     * @return $this
     */
    public function setBlockchainUrl(?string $blockchainUrl): self
    {
        $this->blockchainUrl = $blockchainUrl;

        return $this;
    }

    /**
     * @return ?Client
     */
    public function getClient(): ?Client
    {
        return $this->client;
    }

    /**
     * @param ?Client $client
     * @return $this
     */
    public function setClient(?Client $client): self
    {
        $this->client = $client;

        return $this;
    }

    /**
     * @return ?Manager
     */
    public function getManager(): ?Manager
    {
        return $this->manager;
    }

    /**
     * @param ?Manager $manager
     * @return $this
     */
    public function setManager(?Manager $manager): self
    {
        $this->manager = $manager;

        return $this;
    }

    /**
     * @return Collection|Invoice[]
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    /**
     * @param Invoice $invoice
     * @return $this
     */
    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices[] = $invoice;
            $invoice->setRequisition($this);
        }

        return $this;
    }

    /**
     * @param Invoice $invoice
     * @return $this
     */
    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->contains($invoice)) {
            $this->invoices->removeElement($invoice);
            // set the owning side to null (unless already changed)
            if ($invoice->getRequisition() === $this) {
                $invoice->setRequisition(null);
            }
        }

        return $this;
    }

    /**
     * @return Pair|null
     */
    public function getPair(): ?Pair
    {
        return $this->pair;
    }

    /**
     * @param Pair|null $pair
     * @return $this
     */
    public function setPair(?Pair $pair): self
    {
        $this->pair = $pair;

        return $this;
    }

    /**
     * @return Collection|RequisitionProfitHistory[]
     */
    public function getRequisitionProfitHistories(): Collection
    {
        return $this->requisitionProfitHistories;
    }

    /**
     * @param RequisitionProfitHistory $requisitionProfitHistory
     * @return $this
     */
    public function addRequisitionProfitHistory(RequisitionProfitHistory $requisitionProfitHistory): self
    {
        if (!$this->requisitionProfitHistories->contains($requisitionProfitHistory)) {
            $this->requisitionProfitHistories[] = $requisitionProfitHistory;
            $requisitionProfitHistory->setRequisition($this);
        }

        return $this;
    }

    /**
     * @param RequisitionProfitHistory $requisitionProfitHistory
     * @return $this
     */
    public function removeRequisitionProfitHistory(RequisitionProfitHistory $requisitionProfitHistory): self
    {
        if ($this->requisitionProfitHistories->removeElement($requisitionProfitHistory)) {
            // set the owning side to null (unless already changed)
            if ($requisitionProfitHistory->getRequisition() === $this) {
                $requisitionProfitHistory->setRequisition(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|BankDetail[]
     */
    public function getBankDetails(): Collection
    {
        return $this->bankDetails;
    }

    /**
     * @param BankDetail $bankDetail
     * @return $this
     */
    public function addBankDetail(BankDetail $bankDetail): self
    {
        if (!$this->bankDetails->contains($bankDetail)) {
            $this->bankDetails[] = $bankDetail;
        }

        return $this;
    }

    /**
     * @param BankDetail $bankDetail
     * @return $this
     */
    public function removeBankDetail(BankDetail $bankDetail): self
    {
        $this->bankDetails->removeElement($bankDetail);

        return $this;
    }

    /**
     * @return float|null
     */
    public function getSystemProfit(): ?float
    {
        return $this->systemProfit;
    }

    /**
     * @param float $systemProfit
     * @return $this
     */
    public function setSystemProfit(float $systemProfit): self
    {
        $this->systemProfit = $systemProfit;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getCourse(): ?float
    {
        return $this->course;
    }

    /**
     * @param float $course
     * @return $this
     */
    public function setCourse(float $course): self
    {
        $this->course = $course;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getCleanSystemProfit(): ?float
    {
        return $this->cleanSystemProfit;
    }

    /**
     * @param float $cleanSystemProfit
     * @return $this
     */
    public function setCleanSystemProfit(float $cleanSystemProfit): self
    {
        $this->cleanSystemProfit = $cleanSystemProfit;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getStartPaymentAmount(): ?float
    {
        return $this->startPaymentAmount;
    }

    /**
     * @param float $startPaymentAmount
     * @return $this
     */
    public function setStartPaymentAmount(float $startPaymentAmount): self
    {
        $this->startPaymentAmount = $startPaymentAmount;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getExchangePoint(): ?string
    {
        return $this->exchangePoint;
    }

    /**
     * @param string $exchangePoint
     * @return $this
     */
    public function setExchangePoint(string $exchangePoint): self
    {
        $this->exchangePoint = $exchangePoint;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getComment(): ?string
    {
        return $this->comment;
    }

    /**
     * @param string|null $comment
     * @return $this
     */
    public function setComment(?string $comment): self
    {
        $this->comment = $comment;

        return $this;
    }

    /**
     * @return Collection|RequisitionFeeHistory[]
     */
    public function getRequisitionFeeHistories(): Collection
    {
        return $this->requisitionFeeHistories;
    }

    /**
     * @param RequisitionFeeHistory $requisitionFeeHistory
     * @return $this
     */
    public function addRequisitionFeeHistory(RequisitionFeeHistory $requisitionFeeHistory): self
    {
        if (!$this->requisitionFeeHistories->contains($requisitionFeeHistory)) {
            $this->requisitionFeeHistories[] = $requisitionFeeHistory;
            $requisitionFeeHistory->setRequisition($this);
        }

        return $this;
    }

    /**
     * @param RequisitionFeeHistory $requisitionFeeHistory
     * @return $this
     */
    public function removeRequisitionFeeHistory(RequisitionFeeHistory $requisitionFeeHistory): self
    {
        if ($this->requisitionFeeHistories->contains($requisitionFeeHistory)) {
            $this->requisitionFeeHistories->removeElement($requisitionFeeHistory);
            // set the owning side to null (unless already changed)
            if ($requisitionFeeHistory->getRequisition() === $this) {
                $requisitionFeeHistory->setRequisition(null);
            }
        }

        return $this;
    }

    /**
     * @return float|null
     */
    public function getAmountWithFee(): ?float
    {
        return $this->amountWithFee;
    }

    /**
     * @param float|null $amountWithFee
     * @return $this
     */
    public function setAmountWithFee(?float $amountWithFee): self
    {
        $this->amountWithFee = $amountWithFee;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getManagerProfit(): ?float
    {
        return $this->managerProfit;
    }

    /**
     * @param float $managerProfit
     * @return $this
     */
    public function setManagerProfit(float $managerProfit): self
    {
        $this->managerProfit = $managerProfit;

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
     * @param float $profit
     * @return $this
     */
    public function setProfit(float $profit): self
    {
        $this->profit = $profit;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getRecalculatedAmount(): ?float
    {
        return $this->recalculatedAmount;
    }

    /**
     * @param float $recalculatedAmount
     * @return $this
     */
    public function setRecalculatedAmount(float $recalculatedAmount): self
    {
        $this->recalculatedAmount = $recalculatedAmount;

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
    public function getCommission()
    {
        return $this->commission;
    }

    /**
     * @param float|null $commission
     */
    public function setCommission(?float $commission): void
    {
        $this->commission = $commission;
    }

    /**
     * @return float|null
     */
    public function getTmpCommission()
    {
        return $this->tmpCommission;
    }

    /**
     * @param float|null $tmpCommission
     */
    public function setTmpCommission(?float $tmpCommission): void
    {
        $this->tmpCommission = $tmpCommission;
    }

    /**
     * @return int|null
     */
    public function getEndDate(): ?int
    {
        return $this->endDate;
    }

    /**
     * @param int $endDate
     * @return $this
     */
    public function setEndDate(int $endDate): self
    {
        $this->endDate = $endDate;

        return $this;
    }

    /**
     * @return bool|null
     */
    public function getIsSeen(): ?bool
    {
        return $this->isSeen;
    }

    /**
     * @param bool|null $isSeen
     */
    public function setIsSeen(?bool $isSeen): void
    {
        $this->isSeen = $isSeen;
    }
}

<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Traits\TimestampableTrait;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\{BooleanFilter, RangeFilter, SearchFilter, OrderFilter};
use App\Filter\PairsByPairUnitFilter;
use App\Repository\PairRepository;
use Calculation\Service\Exchange;
use App\Resolver\Pair\{OnChangeAmountMutationResolver, PairCollectionResolver, PairDetailsMutationResolver};
use Calculation\Utils\Exchange\{PairInterface, PairUnitInterface};
use Doctrine\Common\Collections\{ArrayCollection, Collection};
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\PersistentCollection;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=PairRepository::class)
 * @ApiResource(
 *     attributes={
 *          "order"={"createdAt": "DESC"},
 *          "pagination_type"="page",
 *          "pagination_client_enabled"=true
 *     },
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *          "delete",
 *          "update"={
 *              "denormalization_context"={
 *                  "groups"={"pair:update_mutation"},
 *                  "disable_type_enforcement"=true
 *              },
 *              "validation_groups"={"pair:update"},
 *              "security"="is_granted('ROLE_ADMIN')"
 *          },
 *          "collection_query"={
 *              "normalization_context"={"groups"={"pair:collection_query"}},
 *          },
 *          "item_query"={
 *              "normalization_context"={"groups"={"pair:item_query"}},
 *              "security"="is_granted('ROLE_ADMIN')"
 *          },
 *          "create"={
 *              "denormalization_context"={
 *                  "groups"={"pair:create_mutation"},
 *                  "disable_type_enforcement"=true
 *              },
 *              "validation_groups"={"pair:create"},
 *              "security"="is_granted('ROLE_ADMIN')"
 *          },
 *          "calculatorDetailsMutation"={
 *              "mutation"=PairDetailsMutationResolver::class,
 *              "args"={
 *                  "pairID"={"type"="Int!"},
 *                  "direction"={"type"="String"},
 *                  "amount"={"type"="String"}
 *              },
 *             "security"="is_granted('IS_AUTHENTICATED_ANONYMOUSLY')",
 *          },
 *          "onChangeAmount"={
 *              "mutation"=OnChangeAmountMutationResolver::class,
 *              "args"={
 *                  "paymentID"={"type"="Int!"},
 *                  "payoutID"={"type"="Int!"},
 *                  "calculationDirection"={"type"="String!"},
 *                  "amount"={"type"="Float!"}
 *              },
 *              "security"="is_granted('IS_AUTHENTICATED_ANONYMOUSLY')",
 *          },
 *          "collection"={
 *              "collection_query"=PairCollectionResolver::class,
 *              "normalization_context"={"groups"={"pair:collection_rates"}}
 *          }
 *     }
 * )
 * @ApiFilter(SearchFilter::class, properties={
 *     "payment.currency.asset": "partial",
 *     "payout.currency.asset": "partial",
 *     "payment.paymentSystem.name": "exact",
 *     "payout.paymentSystem.name": "exact",
 *     "payment.service.tag": "exact",
 *     "payout.service.tag": "exact"
 * })
 * @ApiFilter(BooleanFilter::class, properties={"isActive", "payout.isActive"})
 * @ApiFilter(OrderFilter::class, properties={"top"})
 * @ApiFilter(RangeFilter::class, properties={"percent"})
 * @ApiFilter(PairsByPairUnitFilter::class, properties={"pairUnitId": "exact"})
 * @UniqueEntity(
 *      fields={"payment", "payout"},
 *      repositoryMethod="getSimilarPairUnits",
 *      message="Платежная пара уже существует",
 *      groups={"pair:create"}
 * )
 * @ORM\EntityListeners(value={"App\EntityListener\PairEntityListener"})
 * @ORM\HasLifecycleCallbacks
 */
class Pair implements PairInterface
{
    public const PAYMENT = "payment";
    public const PAYOUT  = "payout";

    use TimestampableTrait;

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private int $id;

    /**
     * @var float
     * @ORM\Column(type="float")
     * @Groups({
     *     "pair:collection_query",
     *     "pair:item_query",
     *     "pair:create_mutation",
     *     "pair:update_mutation",
     *     "pair:collection_rates",
     * })
     */
    private float $percent;

    /**
     * @var float
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair:collection_query",
     *     "pair:item_query",
     *     "pair:collection_rates",
     * })
     */
    private float $paymentRate = 0;

    /**
     * @var float
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair:collection_query",
     *     "pair:item_query",
     *     "requisition:item_query",
     *     "pair:collection_rates",
     * })
     */
    private float $payoutRate = 0;

    /**
     * @var float
     * @Groups({
     *     "pair:collection_rates",
     * })
     */
    private float $payoutRatePost = 0;

    /**
     * @var float
     * @Groups({
     *     "pair:collection_rates",
     * })
     */
    private float $paymentRatePost = 0;

    /**
     * @var PairUnitInterface|null
     * @ORM\ManyToOne(targetEntity=PairUnit::class, inversedBy="paymentPairs")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({
     *     "pair:collection_query",
     *     "pair:item_query",
     *     "pair:create_mutation",
     *     "requisition:collection_query",
     *     "requisition:item_query",
     *     "pair:collection_rates",
     * })
     */
    private ?PairUnitInterface $payment;

    /**
     * @var PairUnitInterface|null
     * @ORM\ManyToOne(targetEntity=PairUnit::class, inversedBy="payoutPairs")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({
     *     "pair:collection_query",
     *     "pair:item_query",
     *     "pair:create_mutation",
     *     "requisition:collection_query",
     *     "requisition:item_query",
     *     "pair:collection_rates",
     * })
     */
    private ?PairUnitInterface $payout;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({
     *     "pair:collection_query",
     *     "pair:update_mutation",
     *     "pair:collection_rates",
     * })
     */
    private ?bool $isActive;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=Requisition::class, mappedBy="pair", cascade={"persist"})
     * @Groups({
     *     "pair:collection_query",
     *     "pair:item_query",
     * })
     */
    private $requisitions;

    /**
     * @ORM\Column(type="integer", options={"default" : 0})
     * @Groups({
     *     "pair:collection_query",
     *     "pair:item_query",
     *     "pair:update_mutation",
     *     "pair:collection_query",
     *     "pair:collection_rates"
     * })
     */
    private ?int $top;

    /**
     * Pair constructor.
     */
    public function __construct()
    {
        $this->isActive = false;
        $this->percent = 0;
        $this->requisitions = new ArrayCollection();
        $this->top = 0;
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @return float
     */
    public function getPercent(): float
    {
        return $this->percent;
    }

    /**
     * @param float percent
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
    public function getPaymentRate(): ?float
    {
        return Exchange::calculation("payment")->calculateRates($this);
    }

    /**
     * @param float $paymentRate
     * @return $this
     */
    public function setPaymentRate(float $paymentRate): self
    {
        $this->paymentRate = $paymentRate;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getPayoutRate(): ?float
    {
        return Exchange::calculation("payout")->calculateRates($this);
    }

    /**
     * @param float $payoutRate
     * @return $this
     */
    public function setPayoutRate(float $payoutRate): self
    {
        $this->payoutRate = $payoutRate;

        return $this;
    }


    /**
     * @return PairUnitInterface
     */
    public function getPayment(): PairUnitInterface
    {
        return $this->payment;
    }

    /**
     * @param PairUnit|null $payment
     * @return $this
     */
    public function setPayment(?PairUnit $payment): self
    {
        $this->payment = $payment;

        return $this;
    }

    /**
     * @return PairUnitInterface
     */
    public function getPayout(): PairUnitInterface
    {
        return $this->payout;
    }

    /**
     * @param PairUnit|null $payout
     * @return $this
     */
    public function setPayout(?PairUnit $payout): self
    {
        $this->payout = $payout;

        return $this;
    }

    /**
     * @return bool|null
     */
    public function getIsActive(): ?bool
    {
        return $this->isActive;
    }

    /**
     * @param bool $isActive
     * @return $this
     */
    public function setIsActive(bool $isActive): self
    {
        $this->isActive = $isActive;

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
            $requisition->setPair($this);
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
            if ($requisition->getPair() === $this) {
                $requisition->setPair(null);
            }
        }

        return $this;
    }

    /**
     * @return int|null
     */
    public function getTop(): ?int
    {
        return $this->top;
    }

    /**
     * @param int $top
     * @return $this
     */
    public function setTop(int $top): self
    {
        $this->top = $top;

        return $this;
    }

    /**
     * @return float
     */
    public function getPayoutRatePost()
    {
        return $this->payoutRatePost;
    }

    /**
     * @param float $payoutRatePost
     */
    public function setPayoutRatePost(float $payoutRatePost): void
    {
        $this->payoutRatePost = $payoutRatePost;
    }

    /**
     * @return float
     */
    public function getPaymentRatePost()
    {
        return $this->paymentRatePost;
    }

    /**
     * @param float $paymentRatePost
     */
    public function setPaymentRatePost(float $paymentRatePost): void
    {
        $this->paymentRatePost = $paymentRatePost;
    }
}

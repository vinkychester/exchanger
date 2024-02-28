<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\{ApiFilter, ApiResource};
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\{SearchFilter, BooleanFilter, RangeFilter, ExistsFilter, NumericFilter};
use ApiPlatform\Core\Action\NotFoundAction;
use App\Repository\PairUnitRepository;
use Calculation\Utils\Exchange\{CurrencyInterface, FeeInterface, PairUnitInterface, PaymentSystemInterface};
use Doctrine\Common\Collections\{ArrayCollection, Collection};
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\PersistentCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Resolver\PairUnit\{PairUnitWithReverseDirectionResolver, PairUnitsWithDayChangeResolver};
use App\Resolver\CalculatorCollectionQueryResolver;
use Symfony\Component\Validator\Constraints as Assert;
use App\Resolver\{CryptoCollectionPairUnitResolver, CurrencyCollectionPairUnitResolver};

/**
 * @ORM\Entity(repositoryClass=PairUnitRepository::class)
 * @ApiResource(
 *     attributes={
 *          "order"={"priority": "ASC"},
 *          "pagination_client_enabled"=true,
 *          "pagination_type"="page",
 *     },
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     denormalizationContext={"disable_type_enforcement"=true},
 *     graphql={
 *         "collection_query"={"normalization_context"={"groups"={"pair-unit:collection_query"}}},
 *         "item_query"={"normalization_context"={"groups"={"pair-unit:item_query"}}},
 *         "update"={"denormalization_context"={"groups"={"pair-unit:update_mutation"}}},
 *         "getPairUnitWithReverseDirection"={
 *              "item_query"=PairUnitWithReverseDirectionResolver::class,
 *              "args"={"pairUnitId"={"type"="Int!"}},
 *              "security"="is_granted('IS_AUTHENTICATED_ANONYMOUSLY')",
 *          },
 *          "calculatorCollectionQuery"={
 *              "collection_query"=CalculatorCollectionQueryResolver::class,
 *              "security"="is_granted('IS_AUTHENTICATED_ANONYMOUSLY') or is_granted('IS_AUTHENTICATED_FULLY')",
 *          },
 *          "rates"={
 *              "collection_query"=PairUnitsWithDayChangeResolver::class,
 *          },
 *          "cryptoCollection"={
 *              "collection_query"=CryptoCollectionPairUnitResolver::class,
 *              "args"={
 *                  "exists"={"type"="Iterable"},
 *                  "currency_tag"={"type"="String"},
 *                  "direction"={"type"="String"},
 *                  "service_name"={"type"="String"},
 *                  "isActive"={"type"="Boolean"},
 *                  "paymentSystemName"={"type"="String"},
 *                  "currencyName"={"type"="String"},
 *              },
 *          },
 *          "currencyCollection"={
 *              "collection_query"=CurrencyCollectionPairUnitResolver::class,
 *              "args"={
 *                  "currency_tag"={"type"="String"},
 *                  "direction"={"type"="String"},
 *                  "isActive"={"type"="Boolean"},
 *                  "exists"={"type"="Iterable"},
 *              },
 *          },
 *          "currency"={
 *              "collection_query"=CurrencyCollectionPairUnitResolver::class
 *          }
 *     }
 * )
 * @ApiFilter(SearchFilter::class, properties={
 *     "direction": "exact",
 *     "pairUnitTabs.name": "exact",
 *     "currency.tag": "exact",
 *     "currency.asset": "partial",
 *     "service.tag": "exact",
 *     "service.name": "exact",
 *     "paymentSystem.name": "exact"
 * })
 * @ApiFilter(BooleanFilter::class, properties={"isActive"})
 * @ApiFilter(NumericFilter::class, properties={"pairUnitTabs.id"})
 * @ApiFilter(RangeFilter::class, properties={"fee.percent", "fee.constant", "fee.min", "fee.max", "priority"})
 * @ApiFilter(ExistsFilter::class, properties={"pairUnitTabs", "paymentPairs", "payoutPairs"})
 * @ORM\EntityListeners(value={"App\EntityListener\PairUnitEntityListener"})
 */

class PairUnit implements PairUnitInterface
{

    public const BALANCE_MIN = 500;
    public const PAIR_UNIT_TOPIC = "http://coin24/pair_unit";

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private int $id;

    /**
     * @var Currency|null
     * @ORM\ManyToOne(targetEntity=Currency::class)
     * @ORM\JoinColumn(nullable=false)
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "collection_query",
     *     "pair:collection_query",
     *     "requisition:collection_query",
     *     "requisition:item_query",
     *     "bank-detail:collection_query",
     *     "bank-detail:item_query",
     *     "verificationSchema:collection_query",
     *     "pair:collection_rates",
     * })
     */
    private ?Currency $currency;

    /**
     * @var PaymentSystem|null
     * @ORM\ManyToOne(targetEntity=PaymentSystem::class)
     * @ORM\JoinColumn(nullable=false)
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "collection_query",
     *     "pair:collection_query",
     *     "requisition:collection_query",
     *     "requisition:item_query",
     *     "bank-detail:collection_query",
     *     "bank-detail:item_query",
     *     "verificationSchema:collection_query",
     *     "pair:collection_rates",
     * })
     */
    private ?PaymentSystem $paymentSystem;

    /**
     * @var Service|null
     * @ORM\ManyToOne(targetEntity=Service::class)
     * @ORM\JoinColumn(nullable=false)
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "collection_query",
     *     "pair:collection_query",
     *     "pair:collection_rates",
     * })
     */
    private ?Service $service;

    /**
     * @var float
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "collection_query",
     *     "pair:collection_query"
     * })
     */
    private float $amount = 0;

    /**
     * @var float
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "collection_query",
     *     "pair:collection_query"
     * })
     */
    private float $min = 0;

    /**
     * @var float
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "collection_query",
     *     "pair:collection_query"
     * })
     */
    private float $max = 0;

    /**
     * @var string
     * @ORM\Column(type="string", length=10)
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair:collection_query",
     *     "bank-detail:collection_query"
     * })
     */
    private string $direction;

    /**
     * @var PairUnitTab|null
     * @ORM\ManyToOne(targetEntity=PairUnitTab::class, inversedBy="pairUnit")
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair-unit:update_mutation",
     * })
     */
    private ?PairUnitTab $pairUnitTabs;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=Pair::class, mappedBy="payment")
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair-unit:update_mutation",
     *     "pair:collection_query"
     * })
     */
    private $paymentPairs;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=Pair::class, mappedBy="payout")
     * @Groups({
     *    "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair-unit:update_mutation",
     *     "pair:collection_query"
     * })
     */
    private $payoutPairs;

    /**
     * @var bool|null
     * @ORM\Column(type="boolean")
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair-unit:update_mutation",
     *     "pair:collection_query"
     * })
     */
    private ?bool $isActive;

    /**
     * @var FeeInterface|null
     * @ORM\OneToOne(targetEntity=Fee::class, cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair:collection_query",
     *     "requisition:item_query",
     *     "pair:collection_rates",
     * })
     */
    private ?FeeInterface $fee;

    /**
     * @ORM\ManyToOne(targetEntity=VerificationSchema::class, inversedBy="verificationschema")
     * @ORM\JoinColumn(nullable=true)
     */
    private ?VerificationSchema $verificationSchema;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({"pair-unit:collection_query"})
     */
    private ?float $balance;

    /**
     * @ORM\Column(type="float", options={"default" : 0}, nullable=true)
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair:collection_query",
     *     "pair:item_query",
     * })
     */
    private ?float $dayChange = 0;

    /**
     * @var bool|null
     * @ORM\Column(type="boolean")
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair-unit:update_mutation",
     * })
     */
    private ?bool $isCardVerification;


    /**
     * @var int
     * @ORM\Column(type="integer", options={"default" : 0})
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair-unit:update_mutation"
     * })
     */
    private int $priority = 0;

    /**
     * @var float|int
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair:collection_query",
     *     "requisition:item_query",
     *     "pair:collection_rates",
     * })
     */
    private float $lastFee = 0;

    /**
     * @ORM\Column(type="float", options={"default" : 0})
     * @Assert\NotBlank(message="Значение не должен быть пустым")
     * @Assert\Type(type="numeric", message="Значение не должен быть пустым")
     * @Assert\Regex("/^[+-]?([0-9]*[.])?[0-9]+/", message="Значение не должно содержать символы")
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair-unit:update_mutation",
     *     "pair:collection_query",
     *     "pair:collection_rates",
     * })
     */
    private float $price = 0;

    /**
     * @var bool
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair:collection_query",
     *     "bank-detail:collection_query"
     * })
     */
    private bool $isPaymentExchange = false;

    /**
     * @var bool
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair:collection_query",
     *     "bank-detail:collection_query"
     * })
     */
    private bool $isPayoutExchange = false;

    /**
     * @var float
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair:collection_query",
     *     "bank-detail:collection_query"
     * })
     */
    private float $paymentRate = 0;

    /**
     * @var float
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair:collection_query",
     *     "bank-detail:collection_query"
     * })
     */
    private float $payoutRate = 0;

    /**
     * @var float
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair:collection_query",
     *     "bank-detail:collection_query"
     * })
     */
    private float $paymentConstant = 0;

    /**
     * @var float
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair:collection_query",
     *     "bank-detail:collection_query"
     * })
     */
    private float $payoutConstant = 0;

    /**
     * @var float
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair:collection_query",
     *     "bank-detail:collection_query"
     * })
     */
    private float $paymentPrice = 0;

    /**
     * @var float
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair:collection_query",
     *     "bank-detail:collection_query"
     * })
     */
    private float $payoutPrice = 0;

    /**
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     * })
     */
    private ?float $minPayment = 0;

    /**
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     * })
     */
    private ?float $maxPayment = 0;

    /**
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     * })
     */
    private ?float $minPayout = 0;

    /**
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     * })
     */
    private ?float $maxPayout = 0;

    /**
     * @var float|null
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     * })
     */
    private ?float $paymentSurcharge = 0;

    /**
     * @var float|null
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     * })
     */
    private ?float $payoutSurcharge = 0;

    /**
     * PairUnit constructor.
     */
    public function __construct()
    {
        $this->isActive = false;
        $this->dayChange = 0;
        $this->isCardVerification = false;
        $this->paymentPairs = new ArrayCollection();
        $this->payoutPairs = new ArrayCollection();
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @return Currency
     */
    public function getCurrency(): CurrencyInterface
    {
        return $this->currency;
    }

    /**
     * @param Currency|null $currency
     * @return $this
     */
    public function setCurrency(?Currency $currency): self
    {
        $this->currency = $currency;

        return $this;
    }

    /**
     * @return PaymentSystemInterface
     */
    public function getPaymentSystem(): PaymentSystemInterface
    {
        return $this->paymentSystem;
    }

    /**
     * @param PaymentSystem|null $paymentSystem
     * @return $this
     */
    public function setPaymentSystem(?PaymentSystem $paymentSystem): self
    {
        $this->paymentSystem = $paymentSystem;

        return $this;
    }

    /**
     * @return Service
     */
    public function getService(): Service
    {
        return $this->service;
    }

    /**
     * @param Service|null $service
     * @return $this
     */
    public function setService(?Service $service): self
    {
        $this->service = $service;

        return $this;
    }

    /**
     * @return float
     */
    public function getAmount(): float
    {
        return $this->amount;
    }

    /**
     * @param float $amount
     * @return PairUnit
     */
    public function setAmount(float $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    /**
     * @return float
     */
    public function getMin(): float
    {
        return $this->min;
    }

    /**
     * @param float $min
     * @return PairUnit
     */
    public function setMin(float $min): self
    {
        $this->min = $min;

        return $this;
    }

    /**
     * @return float
     */
    public function getMax(): float
    {
        return $this->max;
    }

    /**
     * @param float $max
     * @return PairUnit
     */
    public function setMax(float $max): self
    {
        $this->max = $max;

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
     * @return PairUnitTab|null
     */
    public function getPairUnitTabs(): ?PairUnitTab
    {
        return $this->pairUnitTabs;
    }

    /**
     * @param PairUnitTab|null $pairUnitTabs
     * @return $this
     */
    public function setPairUnitTabs(?PairUnitTab $pairUnitTabs): self
    {
        $this->pairUnitTabs = $pairUnitTabs;

        return $this;
    }

    /**
     * @return Collection|Pair[]
     */
    public function getPaymentPairs(): Collection
    {
        return $this->paymentPairs;
    }

    /**
     * @param Pair $paymentPair
     * @return $this
     */
    public function addPaymentPair(Pair $paymentPair): self
    {
        if (!$this->paymentPairs->contains($paymentPair)) {
            $this->paymentPairs[] = $paymentPair;
            $paymentPair->setPayment($this);
        }

        return $this;
    }

    /**
     * @param Pair $paymentPair
     * @return $this
     */
    public function removePaymentPair(Pair $paymentPair): self
    {
        if ($this->paymentPairs->contains($paymentPair)) {
            $this->paymentPairs->removeElement($paymentPair);
            // set the owning side to null (unless already changed)
            if ($paymentPair->getPayment() === $this) {
                $paymentPair->setPayment(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Pair[]
     */
    public function getPayoutPairs(): Collection
    {
        return $this->payoutPairs;
    }

    /**
     * @param Pair $payoutPair
     * @return $this
     */
    public function addPayoutPair(Pair $payoutPair): self
    {
        if (!$this->payoutPairs->contains($payoutPair)) {
            $this->payoutPairs[] = $payoutPair;
            $payoutPair->setPayout($this);
        }

        return $this;
    }

    /**
     * @param Pair $payoutPair
     * @return $this
     */
    public function removePayoutPair(Pair $payoutPair): self
    {
        if ($this->payoutPairs->contains($payoutPair)) {
            $this->payoutPairs->removeElement($payoutPair);
            // set the owning side to null (unless already changed)
            if ($payoutPair->getPayout() === $this) {
                $payoutPair->setPayout(null);
            }
        }

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
     * @return FeeInterface
     */
    public function getFee(): FeeInterface
    {
        return $this->fee;
    }

    /**
     * @param FeeInterface $fee
     * @return $this
     */
    public function setFee(FeeInterface $fee): self
    {
        $this->fee = $fee;

        return $this;
    }

    /**
     * @return ?VerificationSchema
     */
    public function getVerificationSchema(): ?VerificationSchema
    {
        return $this->verificationSchema;
    }

    /**
     * @param ?VerificationSchema $verificationSchema
     * @return $this
     */
    public function setVerificationSchema(?VerificationSchema $verificationSchema): self
    {
        $this->verificationSchema = $verificationSchema;
        return $this;
    }

    public function getBalance(): ?float
    {
        return $this->balance;
    }

    public function setBalance(?float $balance): self
    {
        $this->balance = $balance;

        return $this;
    }

    /**
     * @return float|int|null
     */
    public function getDayChange()
    {
        return $this->dayChange;
    }

    /**
     * @param float|int|null $dayChange
     */
    public function setDayChange($dayChange): void
    {
        $this->dayChange = $dayChange;
    }

    /**
     * @return bool|null
     */
    public function getIsCardVerification(): ?bool
    {
        return $this->isCardVerification;
    }

    /**
     * @param bool $isCardVerification
     * @return $this
     */
    public function setIsCardVerification(bool $isCardVerification): self
    {
        $this->isCardVerification = $isCardVerification;

        return $this;
    }

    /**
     * @return int
     */
    public function getPriority(): int
    {
        return $this->priority;
    }

    /**
     * @param int $priority
     * @return $this
     */
    public function setPriority(int $priority): self
    {
        $this->priority = $priority;

        return $this;
    }

    /**
     * @return float|int
     */
    public function getLastFee()
    {
        return $this->lastFee;
    }

    /**
     * @param float|int $lastFee
     */
    public function setLastFee($lastFee): void
    {
        $this->lastFee = $lastFee;
    }

    /**
     * @return float|null
     */
    public function getPrice(): float
    {
        return $this->price;
    }

    /**
     * @param float $price
     * @return $this
     */
    public function setPrice(float $price): self
    {
        $this->price = $price;

        return $this;
    }

    /**
     * @return bool
     */
    public function isPaymentExchange(): bool
    {
        return $this->isPaymentExchange;
    }

    /**
     * @param bool $isPaymentExchange
     */
    public function setIsPaymentExchange(bool $isPaymentExchange): void
    {
        $this->isPaymentExchange = $isPaymentExchange;
    }

    /**
     * @return bool
     */
    public function isPayoutExchange(): bool
    {
        return $this->isPayoutExchange;
    }

    /**
     * @param bool $isPayoutExchange
     */
    public function setIsPayoutExchange(bool $isPayoutExchange): void
    {
        $this->isPayoutExchange = $isPayoutExchange;
    }

    /**
     * @return float
     */
    public function getPaymentRate(): float
    {
        return $this->paymentRate;
    }

    /**
     * @param float $paymentRate
     */
    public function setPaymentRate(float $paymentRate): void
    {
        $this->paymentRate = $paymentRate;
    }

    /**
     * @return float
     */
    public function getPayoutRate(): float
    {
        return $this->payoutRate;
    }

    /**
     * @param float $payoutRate
     */
    public function setPayoutRate(float $payoutRate): void
    {
        $this->payoutRate = $payoutRate;
    }

    /**
     * @return float
     */
    public function getPaymentConstant()
    {
        return $this->paymentConstant;
    }

    /**
     * @param float $paymentConstant
     */
    public function setPaymentConstant(float $paymentConstant): void
    {
        $this->paymentConstant = $paymentConstant;
    }

    /**
     * @return float
     */
    public function getPayoutConstant()
    {
        return $this->payoutConstant;
    }

    /**
     * @param float $payoutConstant
     */
    public function setPayoutConstant(float $payoutConstant): void
    {
        $this->payoutConstant = $payoutConstant;
    }

    /**
     * @return float
     */
    public function getPaymentPrice()
    {
        return $this->paymentPrice;
    }

    /**
     * @param float $paymentPrice
     */
    public function setPaymentPrice(float $paymentPrice): void
    {
        $this->paymentPrice = $paymentPrice;
    }

    /**
     * @return float
     */
    public function getPayoutPrice()
    {
        return $this->payoutPrice;
    }

    /**
     * @param float $payoutPrice
     */
    public function setPayoutPrice(float $payoutPrice): void
    {
        $this->payoutPrice = $payoutPrice;
    }

    /**
     * @return float|null
     */
    public function getMinPayment(): ?float
    {
        return $this->minPayment;
    }

    /**
     * @param float|null $minPayment
     * @return $this
     */
    public function setMinPayment(?float $minPayment): self
    {
        $this->minPayment = $minPayment;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getMaxPayment(): ?float
    {
        return $this->maxPayment;
    }

    /**
     * @param float|null $maxPayment
     * @return $this
     */
    public function setMaxPayment(?float $maxPayment): self
    {
        $this->maxPayment = $maxPayment;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getMinPayout(): ?float
    {
        return $this->minPayout;
    }

    /**
     * @param float|null $minPayout
     * @return $this
     */
    public function setMinPayout(?float $minPayout): self
    {
        $this->minPayout = $minPayout;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getMaxPayout(): ?float
    {
        return $this->maxPayout;
    }

    /**
     * @param float|null $maxPayout
     * @return $this
     */
    public function setMaxPayout(?float $maxPayout): self
    {
        $this->maxPayout = $maxPayout;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getPaymentSurcharge(): ?float
    {
        return $this->paymentSurcharge;
    }

    /**
     * @param float $paymentSurcharge
     * @return $this
     */
    public function setPaymentSurcharge(float $paymentSurcharge): self
    {
        $this->paymentSurcharge = $paymentSurcharge;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getPayoutSurcharge(): ?float
    {
        return $this->payoutSurcharge;
    }

    /**
     * @param float $payoutSurcharge
     * @return $this
     */
    public function setPayoutSurcharge(float $payoutSurcharge): self
    {
        $this->payoutSurcharge = $payoutSurcharge;

        return $this;
    }
}

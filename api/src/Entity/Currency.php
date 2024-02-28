<?php

namespace App\Entity;


use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\CurrencyRepository;
use Calculation\Utils\Exchange\CurrencyInterface;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Resolver\CurrencyCollectionResolver;

/**
 * @ORM\Entity(repositoryClass=CurrencyRepository::class)
 * @ApiResource(
 *     attributes={
 *          "order"={"asset": "DESC"},
 *          "pagination_client_enabled"=true,
 *          "pagination_type"="page",
 *
 *     },
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *          "collection_query"={
 *              "normalization_context"={"groups"={"currency:collection_query"}},
 *              "security"="is_granted('IS_AUTHENTICATED_FULLY')"
 *          },
 *          "collectionQuery"={
 *              "collection_query"=CurrencyCollectionResolver::class,
 *
 *          }
 *     }
 * )
 * @ApiFilter(SearchFilter::class, properties={"tag": "exact"})
 */
class Currency implements CurrencyInterface
{
    /** @var string */
    public const TYPE_CURRENCY = 'CURRENCY';

    /** @var string */
    public const TYPE_CRYPTO = 'CRYPTO';

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private ?int $id;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=20)
     * @Groups({
     *     "currency:collection_query",
     *     "pair-unit:collection_query",
     *     "pair:collection_query",
     *     "requisition:collection_query",
     *     "requisition:item_query",
     *     "bank-detail:collection_query",
     *     "bank-detail:item_query",
     *     "verificationSchema:collection_query",
     *     "pair:collection_rates",
     * })
     */
    private ?string $asset;

    /**
     * @var string
     * @ORM\Column(type="string", length=5, nullable=true)
     */
    private string $name;

    /**
     * @var float
     * @ORM\Column(type="float", options={"default" : 1})
     * @Groups({"currency:collection_query"})
     */
    private float $rate = 1;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=8)
     * @Groups({
     *     "currency:collection_query",
     *     "pair-unit:collection_query",
     *     "pair:collection_query",
     *     "requisition:collection_query",
     *     "requisition:item_query",
     *     "pair:collection_rates",
     * })
     */
    private ?string $tag;

    /**
     * @var float|null
     * @ORM\Column(type="float", options={"default" : 1})
     * @Groups({"currency:collection_query"})
     */
    private float $paymentRate = 1;

    /**
     * @var float|null
     * @ORM\Column(type="float", options={"default" : 1})
     * @Groups({"currency:collection_query"})
     */
    private float $payoutRate = 1;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=50)
     */
    private ?string $serviceName;

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return string|null
     */
    public function getAsset(): ?string
    {
        return $this->asset;
    }

    /**
     * @param string $asset
     * @return $this
     */
    public function setAsset(string $asset): self
    {
        $this->asset = $asset;

        return $this;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     * @return $this
     */
    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return float
     */
    public function getRate(): float
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
     * @return string
     */
    public function getTag(): string
    {
        return $this->tag;
    }

    /**
     * @param string $tag
     * @return $this
     */
    public function setTag(string $tag): self
    {
        $this->tag = $tag;

        return $this;
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
     * @return $this
     */
    public function setPaymentRate(float $paymentRate): self
    {
        $this->paymentRate = $paymentRate;

        return $this;
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
     * @return $this
     */
    public function setPayoutRate(float $payoutRate): self
    {
        $this->payoutRate = $payoutRate;

        return $this;
    }

    /**
     * @return float
     */
    public function getPaymentRateForCalc(): float
    {
        if ($this->getTag() === self::TYPE_CURRENCY) {
            return 1 / $this->getPaymentRate();
        }

        return $this->getPaymentRate();
    }

    /**
     * @return float
     */
    public function getPayoutRateForCalc(): float
    {
        if ($this->getTag() === self::TYPE_CURRENCY) {
            return 1 / $this->getPayoutRate();
        }

        return $this->getPayoutRate();
    }

    /**
     * @param string|null $serviceName
     * @return Currency
     */
    public function setServiceName(?string $serviceName): Currency
    {
        $this->serviceName = $serviceName;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getServiceName(): ?string
    {
        return $this->serviceName;
    }
}

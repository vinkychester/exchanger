<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\{SearchFilter, RangeFilter};
use ApiPlatform\Core\Action\NotFoundAction;
use Calculation\Utils\Exchange\PaymentSystemInterface;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use App\Filter\PaymentSystemFilter;

/**
 * @ORM\Entity()
 * @ORM\EntityListeners(value={"App\EntityListener\PaymentSystemEntityListener"})
 * @ApiResource(
 *     attributes={"pagination_client_enabled"=true, "pagination_type"="page"},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *          "collection_query"={"normalization_context"={"groups"={"payment-system:collection_query"}}},
 *          "update"={"denormalization_context"={"groups"={"payment-system:update"}}},
 *     }
 * )
 * @ApiFilter(SearchFilter::class, properties={"tag": "exact", "name": "partial"})
 * @ApiFilter(PaymentSystemFilter::class, properties={"tag"})
 * @ApiFilter(RangeFilter::class, properties={"price"})
 * @UniqueEntity(fields="name")
 */
class PaymentSystem implements PaymentSystemInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private int $id;

    /**
     * @var string
     * @ORM\Column(type="string", length=20)
     * @Groups({
     *     "payment-system:collection_query",
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
    private string $name;

    /**
     * @var float
     * @ORM\Column(type="float")
     * @Assert\Regex(
     *     pattern="/^[+-]?([0-9]*[.])?[0-9]+$/",
     *     match=true,
     *     message="Значение не должно содержать символы"
     * )
     * @Groups({
     *     "payment-system:collection_query",
     *     "payment-system:update"
     * })
     */
    private float $price;

    /**
     * @var string
     * @ORM\Column(type="string", length=20)
     * @Groups({
     *     "payment-system:collection_query",
     *     "pair-unit:collection_query",
     *     "pair:collection_query",
     *     "requisition:item_query",
     *     "requisition:collection_query",
     *     "pair:collection_rates",
     * })
     */
    private string $subName;

    /**
     * @var string
     * @ORM\Column(type="string", length=20)
     * @Groups({
     *     "payment-system:collection_query",
     *     "pair-unit:collection_query",
     *     "pair:collection_query",
     *     "requisition:collection_query",
     *     "requisition:item_query",
     *     "bank-detail:collection_query",
     *     "bank-detail:item_query",
     *     "pair:collection_rates",
     * })
     */
    private string $tag;

    /**
     * PaymentSystem constructor.
     */
    public function __construct()
    {
        $this->price = 0;
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
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
     * @return string
     */
    public function getSubName(): string
    {
        return $this->subName;
    }

    /**
     * @param string $subName
     * @return $this
     */
    public function setSubName(string $subName): self
    {
        $this->subName = $subName;

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
}

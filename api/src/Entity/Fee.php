<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Action\NotFoundAction;
use Calculation\Utils\Exchange\FeeInterface;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity()
 * @ORM\HasLifecycleCallbacks
 * @ApiResource(
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={"collection_query"={"normalization_context"={"groups"={"fee:collection_query"}}}}
 * )
 */
class Fee implements FeeInterface
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    protected ?int $id;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     * @Groups({
     *     "fee:collection_query",
     *     "pair-unit:collection_query",
     *     "pair:collection_query"
     * })
     */
    protected ?float $percent;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     * @Groups({
     *     "fee:collection_query",
     *     "pair-unit:collection_query",
     *     "pair:collection_query",
     *     "requisition:item_query",
     *     "pair:collection_rates",
     * })
     */
    protected ?float $constant;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     * @Groups({
     *     "fee:collection_query",
     *     "pair-unit:collection_query",
     *     "pair:collection_query"
     * })
     */
    protected ?float $max;

    /**
     * @var float|null
     * @ORM\Column(type="float")
     * @Groups({
     *     "fee:collection_query",
     *     "pair-unit:collection_query",
     *     "pair:collection_query"
     * })
     */
    protected ?float $min;

    /**
     * @return int
     */
    public function getId(): ?int
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
     * @param float $percent
     * @return $this
     */
    public function setPercent(float $percent): self
    {
        $this->percent = $percent;

        return $this;
    }

    /**
     * @return float
     */
    public function getConstant(): float
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
     * @return float
     */
    public function getMax(): float
    {
        return $this->max;
    }

    /**
     * @param float $max
     * @return $this
     */
    public function setMax(float $max): self
    {
        $this->max = $max;

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
     * @return $this
     */
    public function setMin(float $min): self
    {
        $this->min = $min;

        return $this;
    }
}

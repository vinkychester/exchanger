<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\CashbackLevelRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Action\NotFoundAction;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\{NumericFilter, BooleanFilter};
use App\Resolver\CashbackLevel\UpdateForAllVipClientsMutationResolver;
use App\Resolver\CashbackLevel\UpdateForAllExceptVipClientsMutationResolver;
use App\Resolver\CashbackLevel\UpdateForNewClientsMutationResolver;
use App\Resolver\CashbackLevel\UpdateForAllClientsMutationResolver;
use App\Resolver\CashbackLevel\CollectionWithActiveCheckingResolver;
use App\Validator as AcmeAssert;


/**
 * @ORM\Entity(repositoryClass=CashbackLevelRepository::class)
 * @ApiResource(
 *     attributes={
 *          "pagination_type"="page",
 *          "pagination_client_enabled"=true
 *     },
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *          "update"={"groups"={"cashback-level:update_mutation"}},
 *          "create"={
 *              "denormalization_context"={"groups"={"cashback-level:create_mutation"}},
 *          },
 *          "delete"={
 *              "denormalization_context"={"groups"={"cashback-level:delete_mutation"}},
 *          },
 *          "collection_query"={
 *              "normalization_context"={"groups"={"cashback-level:collection_query"}},
 *              "collection_query"=CollectionWithActiveCheckingResolver::class,
 *          },
 *          "item_query"={"normalization_context"={"groups"={"cashback-level:item_query"}}},
 *          "updateForNewClients"={
 *               "mutation"=UpdateForNewClientsMutationResolver::class,
 *               "args"={"cashbackLevelID"={"type"="Int!"}}
 *          },
 *          "updateForAllClients"={
 *               "mutation"=UpdateForAllClientsMutationResolver::class,
 *               "args"={"cashbackLevelID"={"type"="Int!"}}
 *          },
 *          "updateForAllVipClients"={
 *               "mutation"=UpdateForAllVipClientsMutationResolver::class,
 *               "args"={"cashbackLevelID"={"type"="Int!"}}
 *          },
 *          "updateForAllExceptVipClients"={
 *               "mutation"=UpdateForAllExceptVipClientsMutationResolver::class,
 *               "args"={"cashbackLevelID"={"type"="Int!"}}
 *          },
 *     }
 * )
 * @ApiFilter(BooleanFilter::class, properties={"isDefault", "isCurrent"})
 * @ApiFilter(NumericFilter::class, properties={"level"})
 * @ORM\EntityListeners(value={"App\EntityListener\CashbackLevelEntityListener"})
 * @AcmeAssert\CostsPercent()
 * @AcmeAssert\LevelLoyaltyLevel()
 */
class CashbackLevel
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     * @Groups({
     *     "cashback-level:collection_query",
     *     "cashback-level:item_query",
     *     "cashback-level:create_mutation",
     *     "cashback-level:update_mutation",
     *     "cashback-level:delete_mutation",
     *     "cashback-client-level:collection_query",
     * })
     */
    private $level;

    /**
     * @ORM\Column(type="float")
     * @Groups({
     *     "cashback-level:collection_query",
     *     "cashback-level:item_query",
     *     "cashback-level:update_mutation",
     *     "cashback-level:delete_mutation",
     *     "cashback-client-level:collection_query",
     * })
     */
    private $minPayoutSum;

    /**
     * @ORM\Column(type="float")
     * @Groups({
     *     "cashback-level:collection_query",
     *     "cashback-level:item_query",
     *     "cashback-level:create_mutation",
     *     "cashback-level:update_mutation",
     *     "cashback-level:delete_mutation",
     *     "cashback-client-level:collection_query",
     * })
     */
    private $profitRangeFrom;

    /**
     * @ORM\Column(type="float")
     * @Groups({
     *     "cashback-level:collection_query",
     *     "cashback-level:item_query",
     *     "cashback-level:create_mutation",
     *     "cashback-level:update_mutation",
     *     "cashback-level:delete_mutation",
     *     "cashback-client-level:collection_query",
     * })
     */
    private $profitRangeTo;

    /**
     * @ORM\Column(type="float")
     * @Groups({
     *     "cashback-level:collection_query",
     *     "cashback-level:item_query",
     *     "cashback-level:create_mutation",
     *     "cashback-level:update_mutation",
     *     "cashback-level:delete_mutation",
     *     "cashback-client-level:collection_query",
     * })
     */
    private $percent;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({
     *     "cashback-level:collection_query",
     *     "cashback-level:item_query",
     *     "cashback-level:create_mutation",
     *     "cashback-level:update_mutation",
     *     "cashback-level:delete_mutation",
     *     "cashback-client-level:collection_query",
     * })
     */
    private $isDefault;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({
     *     "cashback-level:collection_query",
     *     "cashback-level:item_query",
     *     "cashback-level:update_mutation",
     *     "cashback-level:delete_mutation",
     *     "cashback-client-level:collection_query",
     * })
     */
    private $isActive;

    /**
     * @ORM\Column(type="integer")
     * @Groups({
     *     "cashback-level:collection_query",
     *     "cashback-level:item_query",
     *     "cashback-level:update_mutation",
     *     "cashback-level:delete_mutation",
     *     "cashback-client-level:collection_query",
     * })
     */
    private $updatedAt;

    /**
     * @ORM\Column(type="integer")
     * @Groups({
     *     "cashback-level:collection_query",
     *     "cashback-level:item_query",
     *     "cashback-level:update_mutation",
     *     "cashback-level:delete_mutation",
     *     "cashback-client-level:collection_query",
     * })
     */
    private $createdAt;

    /**
     * @ORM\OneToMany(targetEntity=CashbackClientLevel::class, mappedBy="cashbackLevel")
     * @Groups({
     *     "cashback-level:collection_query",
     *     "cashback-level:item_query",
     *     "cashback-level:update_mutation",
     *     "cashback-level:delete_mutation",
     *     "cashback-client-level:collection_query",
     * })
     */
    private $cashbackClientLevels;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({
     *     "cashback-level:collection_query",
     *     "cashback-level:item_query",
     *     "cashback-level:create_mutation",
     *     "cashback-level:update_mutation",
     *     "cashback-level:delete_mutation",
     *     "cashback-client-level:collection_query",
     * })
     */
    private $name;

    /**
     * CashbackLevel constructor.
     */
    public function __construct()
    {
        $this->cashbackClientLevels = new ArrayCollection();
        $this->isActive = false;
        $this->isDefault = false;
        $this->createdAt = time();
        $this->updatedAt = time();
        $this->minPayoutSum = 5;
    }

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
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

    /**
     * @return float|null
     */
    public function getMinPayoutSum(): ?float
    {
        return $this->minPayoutSum;
    }

    /**
     * @param float $minPayoutSum
     * @return $this
     */
    public function setMinPayoutSum(float $minPayoutSum): self
    {
        $this->minPayoutSum = $minPayoutSum;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getProfitRangeFrom(): ?float
    {
        return $this->profitRangeFrom;
    }

    /**
     * @param float $profitRangeFrom
     * @return $this
     */
    public function setProfitRangeFrom(float $profitRangeFrom): self
    {
        $this->profitRangeFrom = $profitRangeFrom;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getProfitRangeTo(): ?float
    {
        return $this->profitRangeTo;
    }

    /**
     * @param float $profitRangeTo
     * @return $this
     */
    public function setProfitRangeTo(float $profitRangeTo): self
    {
        $this->profitRangeTo = $profitRangeTo;

        return $this;
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
     * @return bool|null
     */
    public function getIsDefault(): ?bool
    {
        return $this->isDefault;
    }

    /**
     * @param bool $isDefault
     * @return $this
     */
    public function setIsDefault(bool $isDefault): self
    {
        $this->isDefault = $isDefault;

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
     * @return int|null
     */
    public function getUpdatedAt(): ?int
    {
        return $this->updatedAt;
    }

    /**
     * @param int $updatedAt
     * @return $this
     */
    public function setUpdatedAt(int $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * @return int|null
     */
    public function getCreatedAt(): ?int
    {
        return $this->createdAt;
    }

    /**
     * @param int $createdAt
     * @return $this
     */
    public function setCreatedAt(int $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * @return Collection|CashbackClientLevel[]
     */
    public function getCashbackClientLevels(): Collection
    {
        return $this->cashbackClientLevels;
    }

    /**
     * @param CashbackClientLevel $cashbackClientLevel
     * @return $this
     */
    public function addCashbackClientLevel(CashbackClientLevel $cashbackClientLevel): self
    {
        if (!$this->cashbackClientLevels->contains($cashbackClientLevel)) {
            $this->cashbackClientLevels[] = $cashbackClientLevel;
            $cashbackClientLevel->setCashbackLevel($this);
        }

        return $this;
    }

    /**
     * @param CashbackClientLevel $cashbackClientLevel
     * @return $this
     */
    public function removeCashbackClientLevel(CashbackClientLevel $cashbackClientLevel): self
    {
        if ($this->cashbackClientLevels->removeElement($cashbackClientLevel)) {
            // set the owning side to null (unless already changed)
            if ($cashbackClientLevel->getCashbackLevel() === $this) {
                $cashbackClientLevel->setCashbackLevel(null);
            }
        }

        return $this;
    }

    /**
     * @return string|null
     */
    public function getName(): ?string
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
}

<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\{BooleanFilter, RangeFilter, SearchFilter, NumericFilter};
use App\Repository\ManagerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\PersistentCollection;
use Symfony\Component\Serializer\Annotation\Groups;


/**
 * @ORM\Entity(repositoryClass=ManagerRepository::class)
 * @ApiResource(
 *     attributes={
 *          "order"={"createdAt": "DESC"},
 *          "pagination_client_enabled"=true,
 *          "pagination_type"="page",
 *          "security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_MANAGER')"
 *     },
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *         "create"={
 *             "normalization_context"={"groups"={"user:collection_query"}},
 *             "denormalization_context"={"groups"={"user:mutation"}}
 *         },
 *         "collection_query"={
 *              "normalization_context"={"groups"={"user:collection_query"}}
 *         },
 *        "item_query"={
 *              "normalization_context"={"groups"={"managers:item_query"}},
 *              "security"="(is_granted('ROLE_ADMIN')) or (is_granted('ROLE_MANAGER') and object == user )"
 *         },
 *        "collection_query"={
 *              "normalization_context"={"groups"={"managers:collection_query"}},
 *              "security"="is_granted('ROLE_ADMIN')"
 *         },
 *         "update"={
 *              "denormalization_context"={"groups"={"manager:update_mutation"}},
 *              "security"="(is_granted('ROLE_ADMIN')) or (is_granted('ROLE_MANAGER') and object == user )"
 *          },

 *     }
 * )
 * @ApiFilter(RangeFilter::class, properties={"requisitions.createdAt", "managerPercentProfitHistories.percent"})
 * @ApiFilter(BooleanFilter::class, properties={"isBank"})
 * @ApiFilter(SearchFilter::class, properties={"cities.id"})
 * @ApiFilter(NumericFilter::class, properties={"cities.externalId"})
 * @ORM\EntityListeners(value={"App\EntityListener\ManagerEntityListener"})
 */
class Manager extends User
{
    public const ROLE_DEFAULT = self::MANAGER;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=Requisition::class, mappedBy="manager")
     * @Groups({
     *     "managers:collection_query",
     * })
     */
    private $requisitions;

    /**
     * @var Collection
     * @ORM\ManyToMany(targetEntity=City::class, inversedBy="managers", cascade={"persist"})
     * @Groups({
     *     "user:collection_query",
     *     "admins:update_user",
     *     "managers:item_query",
     *     "managers:collection_query",
     *     "manager:update_mutation",
     * })
     */
    private Collection $cities;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({
     *     "managers:item_query",
     *     "manager:update_mutation",
     *     "managers:collection_query"
     * })
     */
    private bool $isBank;

    /**
     * @var int
     * @Groups({
     *     "managers:collection_query",
     * })
     */
    private int $countRequisitions;

    /**
     * @var float
     * @Groups({
     *     "managers:collection_query",
     * })
     */
    private float $profitByCashRequisitions;

    /**
     * @var float
     * @Groups({
     *     "managers:collection_query",
     * })
     */
    private float $profitByBankRequisitions;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=ManagerPercentProfitHistory::class, mappedBy="manager", orphanRemoval=true)
     * * @Groups({
     *     "managers:collection_query",
     *     "managers:item_query"
     * })
     */
    private $managerPercentProfitHistories;

    public function __construct()
    {
        parent::__construct();
        $this->requisitions = new ArrayCollection();
        $this->isBank = false;
        $this->managerPercentProfitHistories = new ArrayCollection();
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
            $requisition->setManager($this);
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
            if ($requisition->getManager() === $this) {
                $requisition->setManager(null);
            }
        }

        return $this;
    }

    /**
     * @return array|string[]
     */
    public function getRoles()
    {
        $this->roles[] = self::MANAGER;

        return array_unique($this->roles);
    }

    /**
     * @param City $city
     * @return $this
     */
    public function addCity(City $city): Manager
    {
        if (!$this->cities->contains($city)) {
            $this->cities[] = $city;
        }

        return $this;
    }

    /**
     * @param City $city
     * @return $this
     */
    public function removeCity(City $city): self
    {
        $this->cities->removeElement($city);

        return $this;
    }

    /**
     * @return Collection
     */
    public function getCities(): Collection
    {
        return $this->cities;
    }

    /**
     * @return bool
     */
    public function getIsBank(): bool
    {
        return $this->isBank;
    }

    /**
     * @param bool $isBank
     */
    public function setIsBank(bool $isBank): void
    {
        $this->isBank = $isBank;
    }

    /**
     * @return float|null
     * @Groups({
     *     "user:collection_query",
     *     "user:item_query",
     *     "managers:item_query",
     *     "managers:collection_query",
     *     "requisition:collection_query",
     * })
     */
    public function getPercentBank(): ?float
    {
        $percent = 0;
        if($currentBankPercentHistory = $this->getManagerPercentProfitHistories()->filter(function($profitHistory) {
            return $profitHistory->getPercentName() === ManagerPercentProfitHistory::NAME_BANK;
        })->last()) {
            return $percent = $currentBankPercentHistory->getPercent();
        }
        return $percent;
    }

    /**
     * @return float|null
     * @Groups({
     *     "user:collection_query",
     *     "user:item_query",
     *     "managers:item_query",
     *     "managers:collection_query",
     *     "requisition:collection_query",
     * })
     */
    public function getPercentCash(): ?float
    {
        $percent = 0;
        if($currentBankPercentHistory = $this->getManagerPercentProfitHistories()->filter(function($profitHistory) {
            return $profitHistory->getPercentName() === ManagerPercentProfitHistory::NAME_CASH;
        })->last()) {
            return $percent = $currentBankPercentHistory->getPercent();
        }
        return $percent;
    }

    /**
     * @return int
     */
    public function getCountRequisitions(): int
    {
        return $this->getRequisitions()->filter(function($requisition) {
            return $requisition->getStatus() === Requisition::STATUS_FINISHED;
        })->count();
    }

    /**
     * @return float
     */
    public function getProfitByCashRequisitions(): float
    {
        static $cashRequisitionsManagerProfit = 0;
        foreach($this->requisitions as $requisition) {
            if($requisition->getPair()->getPayment()->getPaymentSystem()->getSubName() === 'CASH'
                || $requisition->getPair()->getPayout()->getPaymentSystem()->getSubName() === 'CASH') {
                $cashRequisitionsManagerProfit += $requisition->getProfit() * ($this->getPercentCash() / 100);
            }
        }

        return $cashRequisitionsManagerProfit;
    }

    /**
     * @return float
     */
    public function getProfitByBankRequisitions(): float
    {
        static $bankRequisitionsManagerProfit = 0;
        foreach($this->requisitions as $requisition) {
            if($requisition->getPair()->getPayment()->getPaymentSystem()->getSubName() !== 'CASH'
                && $requisition->getPair()->getPayout()->getPaymentSystem()->getSubName() !== 'CASH') {
                $bankRequisitionsManagerProfit += $requisition->getProfit() * ($this->getPercentCash() / 100);
            }
        }

        return $bankRequisitionsManagerProfit;
    }

    /**
     * @param PersistentCollection $requisitions
     */
    public function setRequisitions($requisitions): void
    {
        $this->requisitions = $requisitions;
    }

    /**
     * @return Collection|ManagerPercentProfitHistory[]
     */
    public function getManagerPercentProfitHistories(): Collection
    {
        return $this->managerPercentProfitHistories;
    }

    public function addManagerPercentProfitHistory(ManagerPercentProfitHistory $managerPercentProfitHistory): self
    {
        if (!$this->managerPercentProfitHistories->contains($managerPercentProfitHistory)) {
            $this->managerPercentProfitHistories[] = $managerPercentProfitHistory;
            $managerPercentProfitHistory->setManager($this);
        }

        return $this;
    }

    public function removeManagerPercentProfitHistory(ManagerPercentProfitHistory $managerPercentProfitHistory): self
    {
        if ($this->managerPercentProfitHistories->removeElement($managerPercentProfitHistory)) {
            // set the owning side to null (unless already changed)
            if ($managerPercentProfitHistory->getManager() === $this) {
                $managerPercentProfitHistory->setManager(null);
            }
        }

        return $this;
    }

    /**
     * @param float|null $percentBank
     */
    public function setPercentBank(?float $percentBank): void
    {
        $this->percentBank = $percentBank;
    }

}

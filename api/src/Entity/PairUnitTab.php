<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\PersistentCollection;
use ApiPlatform\Core\Action\NotFoundAction;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\ExistsFilter;

/**
 * @ApiResource(
 *     attributes={"pagination_enabled"=false},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *          "collection_query"={"normalization_context"={"groups"={"tabs:collection_query"}}},
 *     },
 * )
 * @ORM\Entity()
 * @ApiFilter(ExistsFilter::class, properties={"name"})
 */
class PairUnitTab
{
    public const PAIR_UNIT_TABS = ["bank", "cash", "payments", "coin"];

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private int $id;

    /**
     * @var string
     * @ORM\Column(type="string", length=16)
     * @Groups({"tabs:collection_query", "pair-unit:collection_query"})
     */
    private string $name;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=PairUnit::class, mappedBy="pairUnitTabs")
     */
    private $pairUnit;

    /**
     * PairUnitTab constructor.
     */
    public function __construct()
    {
        $this->pairUnit = new ArrayCollection();
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
     * @return Collection|PairUnit[]
     */
    public function getPairUnit(): Collection
    {
        return $this->pairUnit;
    }

    /**
     * @param PairUnit $pairUnit
     * @return $this
     */
    public function addPairUnit(PairUnit $pairUnit): self
    {
        if (!$this->pairUnit->contains($pairUnit)) {
            $this->pairUnit[] = $pairUnit;
            $pairUnit->setPairUnitTabs($this);
        }

        return $this;
    }

    /**
     * @param PairUnit $pairUnit
     * @return $this
     */
    public function removePairUnit(PairUnit $pairUnit): self
    {
        if ($this->pairUnit->contains($pairUnit)) {
            $this->pairUnit->removeElement($pairUnit);
            // set the owning side to null (unless already changed)
            if ($pairUnit->getPairUnitTabs() === $this) {
                $pairUnit->setPairUnitTabs(null);
            }
        }

        return $this;
    }

}

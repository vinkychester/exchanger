<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\NumericFilter;
use App\Repository\ReferralLevelRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Resolver\ReferralLevel\UpdateForNewClientsMutationResolver;
use App\Resolver\ReferralLevel\UpdateForAllClientsMutationResolver;
use App\Resolver\ReferralLevel\UpdateForAllVipClientsMutationResolver;
use App\Resolver\ReferralLevel\UpdateForAllExceptVipClientsMutationResolver;
use App\Resolver\ReferralLevel\CollectionWithActiveCheckingResolver;
use App\Validator as AcmeAssert;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=ReferralLevelRepository::class)
 * @ApiResource(
 *     attributes={
 *          "pagination_type"="page",
 *          "pagination_client_enabled"=true
 *     },
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *          "delete",
 *          "update"={"groups"={"referral-level:update_mutation"}},
 *          "create"={
 *              "denormalization_context"={"groups"={"referral-level:create_mutation"}},
 *          },
 *          "delete"={
 *              "denormalization_context"={"groups"={"referral-level:delete_mutation"}},
 *          },
 *          "collection_query"={
 *              "normalization_context"={"groups"={"referral-level:collection_query"}},
 *              "collection_query"=CollectionWithActiveCheckingResolver::class,
 *          },
 *          "item_query"={"normalization_context"={"groups"={"referral-level:item_query"}}},
 *          "updateForNewClients"={
 *               "mutation"=UpdateForNewClientsMutationResolver::class,
 *               "args"={"referralLevelID"={"type"="Int!"}}
 *          },
 *          "updateForAllClients"={
 *               "mutation"=UpdateForAllClientsMutationResolver::class,
 *               "args"={"referralLevelID"={"type"="Int!"}}
 *          },
 *          "updateForAllVipClients"={
 *               "mutation"=UpdateForAllVipClientsMutationResolver::class,
 *               "args"={"referralLevelID"={"type"="Int!"}}
 *          },
 *          "updateForAllExceptVipClients"={
 *               "mutation"=UpdateForAllExceptVipClientsMutationResolver::class,
 *               "args"={"referralLevelID"={"type"="Int!"}}
 *          },
 *     }
 * )
 * @ApiFilter(BooleanFilter::class, properties={"isDefault"})
 * @ApiFilter(NumericFilter::class, properties={"level"})
 * @ORM\EntityListeners(value={"App\EntityListener\ReferralLevelEntityListener"})
 * @AcmeAssert\CostsPercent()
 * @AcmeAssert\LevelLoyaltyLevel()
 */
class ReferralLevel
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     * @Groups({
     *     "referral-level:collection_query",
     *     "referral-level:item_query",
     *     "referral-level:create_mutation",
     *     "referral-level:update_mutation",
     *     "referral-level:delete_mutation",
     *     "referral-client-level:collection_query",
     * })
     */
    private $name;

    /**
     * @ORM\Column(type="float")
     * @Groups({
     *     "referral-level:collection_query",
     *     "referral-level:item_query",
     *     "referral-level:create_mutation",
     *     "referral-level:update_mutation",
     *     "referral-level:delete_mutation",
     *     "referral-client-level:collection_query",
     * })
     */
    private $percent;

    /**
     * @ORM\Column(type="integer")
     * @Groups({
     *     "referral-level:collection_query",
     *     "referral-level:item_query",
     *     "referral-level:create_mutation",
     *     "referral-level:update_mutation",
     *     "referral-level:delete_mutation",
     *     "referral-client-level:collection_query",
     * })
     */
    private $level;

    /**
     * @ORM\OneToMany(targetEntity=ReferralClientLevel::class, mappedBy="referralLevel")
     * @Groups({
     *     "referral-level:collection_query",
     *     "referral-level:item_query",
     *     "referral-level:create_mutation",
     *     "referral-level:update_mutation",
     *     "referral-level:delete_mutation",
     *     "referral-client-level:collection_query",
     * })
     */
    private $referralClientLevels;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({
     *     "referral-level:collection_query",
     *     "referral-level:item_query",
     *     "referral-level:create_mutation",
     *     "referral-level:update_mutation",
     *     "referral-level:delete_mutation",
     *     "referral-client-level:collection_query",
     * })
     */
    private $isDefault;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({
     *     "referral-level:collection_query",
     *     "referral-level:item_query",
     *     "referral-level:create_mutation",
     *     "referral-level:update_mutation",
     *     "referral-level:delete_mutation",
     *     "referral-client-level:collection_query",
     * })
     */
    private $commentary;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({
     *     "referral-level:collection_query",
     *     "referral-level:item_query",
     *     "referral-level:update_mutation",
     *     "referral-level:delete_mutation",
     *     "referral-client-level:collection_query",
     * })
     */
    private $isActive;

    /**
     * ReferralLevel constructor.
     */
    public function __construct()
    {
        $this->referralClientLevels = new ArrayCollection();
        $this->isDefault = false;
        $this->isActive = false;
    }

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
     * @return Collection|ReferralClientLevel[]
     */
    public function getReferralClientLevels(): Collection
    {
        return $this->referralClientLevels;
    }

    /**
     * @param ReferralClientLevel $referralClientLevel
     * @return $this
     */
    public function addReferralClientLevel(ReferralClientLevel $referralClientLevel): self
    {
        if (!$this->referralClientLevels->contains($referralClientLevel)) {
            $this->referralClientLevels[] = $referralClientLevel;
            $referralClientLevel->setReferralLevel($this);
        }

        return $this;
    }

    /**
     * @param ReferralClientLevel $referralClientLevel
     * @return $this
     */
    public function removeReferralClientLevel(ReferralClientLevel $referralClientLevel): self
    {
        if ($this->referralClientLevels->removeElement($referralClientLevel)) {
            // set the owning side to null (unless already changed)
            if ($referralClientLevel->getReferralLevel() === $this) {
                $referralClientLevel->setReferralLevel(null);
            }
        }

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
     * @return string|null
     */
    public function getCommentary(): ?string
    {
        return $this->commentary;
    }

    /**
     * @param string|null $commentary
     * @return $this
     */
    public function setCommentary(?string $commentary): self
    {
        $this->commentary = $commentary;

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
}

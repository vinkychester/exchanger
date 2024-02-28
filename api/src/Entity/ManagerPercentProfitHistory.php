<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\{ApiFilter};
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\{RangeFilter, SearchFilter};
use App\Entity\Traits\TimestampableTrait;
use App\Repository\ManagerPercentProfitHistoryRepository;
use App\Resolver\ManagerPercentProfitHistory\CreateBankPercentProfitMutationResolver;
use App\Resolver\ManagerPercentProfitHistory\GetLastBankPercentQueryResolver;
use App\Validator as AcmeAssert;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ApiResource(
 *     attributes={"pagination_enabled"=false},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *         "item_query"={
 *              "normalization_context"={"groups"={"manager-percent-profit-history:item_query"}},
 *         },
 *         "collection_query"={
 *              "normalization_context"={"groups"={"manager-percent-profit-history:collection_query"}},
 *         },
 *         "update" = {
 *              "denormalization_context"={"groups"={"manager-percent-profit-history:update"}},
 *              "security"="is_granted('ROLE_ADMIN')",
 *          },
 *         "create" = {
 *              "denormalization_context"={"groups"={"manager-percent-profit-history:create"}},
 *              "security"="is_granted('ROLE_ADMIN')",
 *          },
 *         "createManagersBank" = {
 *              "mutation"=CreateBankPercentProfitMutationResolver::class,
 *              "args"={
 *                  "percent"={"type"="Float!"}
 *              },
 *              "security"="is_granted('ROLE_ADMIN')",
 *          },
 *         "getLastBank" = {
 *              "item_query"=GetLastBankPercentQueryResolver::class,
 *              "args"={},
 *              "security"="is_granted('ROLE_ADMIN')",
 *          },
 *     }
 * )
 * @ORM\Entity(repositoryClass=ManagerPercentProfitHistoryRepository::class)
 * @AcmeAssert\CostsPercent()
 * @ApiFilter(RangeFilter::class, properties={"createdAt","percent"})
 * @ApiFilter(SearchFilter::class, properties={"percentName"})
 */
class ManagerPercentProfitHistory
{
    public const NAME_BANK = 'bank';
    public const NAME_CASH = 'cash';

    use TimestampableTrait;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="float", nullable=true)
     * @Groups({
     *    "manager-percent-profit-history:collection_query",
     *    "manager-percent-profit-history:item_query",
     *    "manager-percent-profit-history:create",
     *    "managers:item_query",
     * })
     * @Assert\Range(
     *      min = 0,
     *      max = 75,
     *      minMessage = "Процент не может быть меньше 0",
     *      maxMessage = "Процент не может быть больше 75"
     * )
     */
    private $percent;

    /**
     * @ORM\ManyToOne(targetEntity=Manager::class, inversedBy="managerPercentProfitHistories")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({
     *    "manager-percent-profit-history:collection_query",
     *    "manager-percent-profit-history:item_query",
     *    "manager-percent-profit-history:create",
     *    "managers:item_query",
     * })
     */
    private $manager;

    /**
     * @ORM\Column(type="string", length=10)
     * @Groups({
     *    "manager-percent-profit-history:collection_query",
     *    "manager-percent-profit-history:item_query",
     *    "manager-percent-profit-history:create",
     *    "managers:item_query",
     *    "managers:collection_query",
     * })
     */
    private $percentName;

    public function __construct() {
        $this->createdAt = time();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return float|null
     */
    public function getPercent(): ?float
    {
        return $this->percent;
    }

    /**
     * @param float|null $percent
     * @return $this
     */
    public function setPercent(?float $percent): self
    {
        $this->percent = $percent;

        return $this;
    }

    public function getManager(): ?Manager
    {
        return $this->manager;
    }

    public function setManager(?Manager $manager): self
    {
        $this->manager = $manager;

        return $this;
    }

    public function getPercentName(): ?string
    {
        return $this->percentName;
    }

    public function setPercentName(string $percentName): self
    {
        $this->percentName = $percentName;

        return $this;
    }
}

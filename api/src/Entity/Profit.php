<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Action\NotFoundAction;
use App\Repository\ProfitRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Resolver\Profit\ProfitCollectionResolver;
use App\Resolver\Profit\ManagerProfitResolver;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ApiResource(
 *     attributes={"pagination_enabled"=false},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *          "collection_query"={
 *              "normalization_context"={"groups"={"profit:collection_query"}}
 *         },
 *          "collectionQuery"={
 *              "collection_query"=ProfitCollectionResolver::class,
 *              "args"={
 *                  "date_gte"={"type"="String"},
 *                  "date_lte"={"type"="String"},
 *              },
 *              "security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_MANAGER')"
 *          },
 *          "managersQuery"={
 *              "collection_query"=ManagerProfitResolver::class,
 *              "args"={
 *                  "date_gte"={"type"="String"},
 *                  "date_lte"={"type"="String"},
 *                  "fieldName"={"type"="String"},
 *                  "manager"={"type"="String"},
 *              },
 *              "security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_MANAGER')"
 *          }
 *     }
 * )
 * @ApiFilter(SearchFilter::class, properties={"fieldName": "exact"})
 * @ORM\Entity(repositoryClass=ProfitRepository::class)
 */
class Profit
{
    public const SYSTEM_PROFIT = 'systemProfit';
    public const PROFIT = 'profit';
    public const MANGER_PROFIT = 'managerProfit';
    public const MANGER_PROFIT_BANK = 'managerProfitBank';
    public const MANGER_PROFIT_CASH = 'managerProfitCash';
    public const REFERRAL_PROFIT = 'referralProfit';
    public const CASHBACK_PROFIT = 'cashbackProfit';

    public const fieldTypes = [
        'systemProfit',
        'profit',
    ];

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var string|null
     * @ORM\Column(type="string")
     * @Groups("profit:collection_query")
     */
    private ?string $fieldName = '';

    /**
     * @var float|null
     * @ORM\Column(type="float")
     * @Groups("profit:collection_query")
     */
    private ?float $value = 0;

    /**
     * @Groups("profit:collection_query")
     */
    private string $tempName;

    /**
     * @Groups("profit:collection_query")
     */
    private float $tempValue;

    /**
     * @Groups("profit:collection_query")
     */
    private array $profits = [];

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
    public function getFieldName(): ?string
    {
        return $this->fieldName;
    }

    /**
     * @param string|null $fieldName
     * @return $this
     */
    public function setFieldName(?string $fieldName): self
    {
        $this->fieldName = $fieldName;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getValue(): ?float
    {
        return $this->value;
    }

    /**
     * @param float|null $value
     * @return $this
     */
    public function setValue(?float $value): self
    {
        $this->value = $value;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getTempName(): ?string
    {
        return $this->tempName;
    }

    /**
     * @param string $tempName
     * @return $this
     */
    public function setTempName(string $tempName): self
    {
        $this->tempName = $tempName;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getTempValue(): ?float
    {
        return $this->tempValue;
    }

    /**
     * @param float $tempValue
     * @return $this
     */
    public function setTempValue(float $tempValue): self
    {
        $this->tempValue = $tempValue;

        return $this;
    }

    /**
     * @return array|null
     */
    public function getProfits(): ?array
    {
        return $this->profits;
    }

    /**
     * @param array $profits
     * @return $this
     */
    public function setProfits(array $profits): self
    {
        $this->profits = $profits;

        return $this;
    }

}

<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\{SearchFilter};
use App\Repository\RequisitionProfitHistoryRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *     attributes={"pagination_enabled"=false},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *          "collection_query"={
 *              "normalization_context"={"groups"={"requisitionProfitHistory:collection_query"}},
 *              "security"="is_granted('ROLE_CLIENT') or is_granted('ROLE_MANAGER') or is_granted('ROLE_ADMIN')"
 *          }
 *     }
 * )
 * @ORM\Entity(repositoryClass=RequisitionProfitHistoryRepository::class)
 * @ApiFilter(SearchFilter::class, properties={
 *     "requisition_id": "exact",
 *     "fieldName": "exact"
 * })
 */
class RequisitionProfitHistory
{
    public const REFERRAL_PROFIT_FIELD = 'referralProfit';
    public const CASHBACK_PROFIT_FIELD = 'cashbackProfit';
    public const MANAGER_PROFIT_FIELD = 'managerProfit';
    public const MANAGER_PERCENT_FIELD = 'managerPercent';
    public const PAYMENT_USDT_COURSE = 'paymentUsdtCourse';
    public const PAYOUT_USDT_COURSE = 'payoutUsdtCourse';

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id;

    /**
     * @ORM\ManyToOne(targetEntity=Requisition::class, inversedBy="requisitionProfitHistories")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({
     *     "requisitionProfitHistory:collection_query"
     * })
     */
    private ?Requisition $requisition;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({
     *     "requisitionProfitHistory:collection_query"
     * })
     */
    private ?string $fieldName;

    /**
     * @ORM\Column(type="float")
     * @Groups({
     *     "requisitionProfitHistory:collection_query"
     * })
     */
    private ?float $value;

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Requisition|null
     */
    public function getRequisition(): ?Requisition
    {
        return $this->requisition;
    }

    /**
     * @param Requisition|null $requisition
     * @return $this
     */
    public function setRequisition(?Requisition $requisition): self
    {
        $this->requisition = $requisition;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getFieldName(): ?string
    {
        return $this->fieldName;
    }

    /**
     * @param string $fieldName
     * @return $this
     */
    public function setFieldName(string $fieldName): self
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
     * @param float $value
     * @return $this
     */
    public function setValue(float $value): self
    {
        $this->value = $value;

        return $this;
    }
}

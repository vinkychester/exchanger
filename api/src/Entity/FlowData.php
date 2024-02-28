<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Action\NotFoundAction;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *     attributes={"pagination_enabled"=false},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *         "item_query"={"normalization_context"={"groups"={"flow-data:item_query"}}},
 *         "collection_query"={"normalization_context"={"groups"={"flow-data:collection_query"}}},
 *     }
 * )
 * @ORM\Entity()
 * @ApiFilter(SearchFilter::class, properties={"status": "exact", "invoice.id": "exact", "invoice.requisition.id": "exact"})
 */
class FlowData
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id;

    /**
     * @var null|string
     * @ORM\Column(type="string", length=100)
     * @Groups({
     *     "invoice_item_query",
     *     "requisition:details",
     *     "flow-data:item_query",
     *     "flow-data:collection_query"
     * })
     */
    private ?string $name;

    /**
     * @var null|string
     * @ORM\Column(type="string", length=180)
     * @Groups({
     *     "invoice_item_query",
     *     "requisition:details",
     *     "flow-data:item_query",
     *     "flow-data:collection_query"
     * })
     */
    private ?string $value;

    /**
     * @var null|Invoice
     * @ORM\ManyToOne(targetEntity=Invoice::class, inversedBy="flowData", cascade={"persist"})
     * @ORM\JoinColumn(nullable=false)
     */
    private ?Invoice $invoice;

    /**
     * @var null|string
     * @ORM\Column(type="string", length=20)
     */
    private ?string $status;

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
     * @return string|null
     */
    public function getValue(): ?string
    {
        return $this->value;
    }

    /**
     * @param string $value
     * @return $this
     */
    public function setValue(string $value): self
    {
        $this->value = $value;

        return $this;
    }

    /**
     * @return Invoice|null
     */
    public function getInvoice(): ?Invoice
    {
        return $this->invoice;
    }

    /**
     * @param Invoice|null $invoice
     * @return $this
     */
    public function setInvoice(?Invoice $invoice): self
    {
        $this->invoice = $invoice;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getStatus(): ?string
    {
        return $this->status;
    }

    /**
     * @param string $status
     * @return $this
     */
    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }
}

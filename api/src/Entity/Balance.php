<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\DiscriminatorMap;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\InheritanceType("SINGLE_TABLE")
 * @ORM\DiscriminatorColumn(name="owner", type="string", length=30)
 * @DiscriminatorMap({"manager"="ManagerBalance", "client"="ClientBalance"})
 * @ApiResource(
 *     attributes={"pagination_client_enabled"=true, "pagination_type"="page"},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *         "item_query"={
 *              "normalization_context"={"groups"={"balance:item_query"}},
 *              "security"="(object === user) or is_granted('ROLE_ADMIN')"
 *          },
 *         "collection_query"={
 *              "normalization_context"={"groups"={"balance:collection_query"}},
 *              "security"="is_granted('ROLE_ADMIN')"
 *          },
 *         "create"={
 *             "normalization_context"={"groups"={"balance:collection_query"}},
 *             "denormalization_context"={"groups"={"balance:mutation"}}
 *          },
 *          "update"={
 *              "groups"={"balance:update_mutation"},
 *              "security"="is_granted('ROLE_ADMIN')",
 *          },
 *     }
 * )
 * @ORM\Entity()
 */
abstract class Balance
{
    public const BALANCE_FIELD = 'balance';
    public const SYSTEM_PROFIT = 'systemProfit';
    public const PROFIT = 'profit';
    public const MONTH_PAYMENT_AMOUNT = 'monthPaymentAmount';
    public const MIN_PAYOUT_FIELD = 'min-payout';

    public const fieldTypes = [
        'balance',
        'cashbackProfit',
        'referralProfit',
        'systemProfit',
        'monthPaymentAmount',
        'profit',
        'minPayout',
        'cash',
        'bank'
    ];

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private ?int $id;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="balances")
     * @Groups({
     *     "balance:item_query",
     *     "balance:collection_query",
     *     "user:collection_query",
     *     "admins:update_user",
     *     "managers:item_query"
     * })
     */
    private $user;

    /**
     * @ORM\Column(type="string", length=50)
     * @Groups({
     *     "balance:item_query",
     *     "balance:collection_query",
     *     "user:collection_query",
     *     "user:item_query",
     *     "admins:update_user",
     *     "managers:item_query"
     * })
     */
    private $field;

    /**
     * @ORM\Column(type="float")
     * @ORM\Column(type="boolean", options={"default" : 0})
     * @Groups({
     *     "balance:item_query",
     *     "balance:collection_query",
     *     "user:collection_query",
     *     "user:item_query",
     *     "admins:update_user",
     *     "managers:item_query"
     * })
     */
    private $value;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getField(): ?string
    {
        return $this->field;
    }

    public function setField(string $field): self
    {
        $this->field = $field;

        return $this;
    }

    public function getValue(): ?float
    {
        return $this->value;
    }

    public function setValue(float $value): self
    {
        $this->value = $value;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}

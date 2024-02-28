<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\CashbackClientLevelRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Action\NotFoundAction;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\{BooleanFilter, NumericFilter, SearchFilter};
use App\Resolver\CashbackClientLevel\CreateVipLevelResolver;
use App\Resolver\CashbackClientLevel\CreateLevelResolver;
use App\Resolver\CashbackClientLevel\SetCurrentCashbackClientLevelResolver;
use App\Resolver\CashbackClientLevel\UpdateWithLogCashbackClientLevelResolver;

/**
 * @ORM\Entity(repositoryClass=CashbackClientLevelRepository::class)
 * @ApiResource(
 *     attributes={
 *          "pagination_type"="page",
 *          "pagination_client_enabled"=true
 *     },
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *          "delete",
 *          "update"={"groups"={"cashback-client-level:update_mutation"}},
 *          "collection_query"={"normalization_context"={"groups"={"cashback-client-level:collection_query"}}},
 *          "item_query"={"normalization_context"={"groups"={"cashback-client-level:item_query"}}},
 *          "createVip"={
 *               "mutation"=CreateVipLevelResolver::class,
 *               "args"={
 *                  "cashbackClientLevelID"={"type"="Int!"},
 *                  "cashbackLevelID"={"type"="Int!"}
 *               }
 *          },
 *          "createIfNotExist"={
 *               "mutation"=CreateLevelResolver::class,
 *               "args"={
 *                  "clientID"={"type"="String!"},
 *                  "cashbackLevelID"={"type"="Int!"}
 *               }
 *          },
 *          "setCurrent"={
 *               "mutation"=SetCurrentCashbackClientLevelResolver::class,
 *               "args"={
 *                  "cashbackClientLevelID"={"type"="Int!"}
 *               }
 *          },
 *          "updateWithLog"={
 *              "mutation"=UpdateWithLogCashbackClientLevelResolver::class,
 *              "args"={
 *                  "cashbackClientLevelID"={"type"="Int!"},
 *                  "cashbackLevelID"={"type"="Int!"}
 *               }
 *           }
 *     }
 * )
 * @ApiFilter(NumericFilter::class, properties={"cashbackLevel.id"})
 * @ApiFilter(SearchFilter::class, properties={"client.id": "exact"})
 * @ApiFilter(BooleanFilter::class, properties={"isCurrent"})
 * @ORM\EntityListeners(value={"App\EntityListener\CashbackClientLevelEntityListener"})
 */
class CashbackClientLevel
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=CashbackLevel::class, inversedBy="cashbackClientLevels")
     * @Groups({
     *     "cashback-client-level:collection_query",
     *     "cashback-client-level:item_query",
     *     "cashback-client-level:create_mutation",
     *     "cashback-client-level:update_mutation"
     * })
     */
    private $cashbackLevel;

    /**
     * @ORM\ManyToOne(targetEntity=Client::class, inversedBy="cashbackClientLevels")
     * @Groups({
     *     "cashback-client-level:collection_query",
     *     "cashback-client-level:item_query",
     *     "cashback-client-level:create_mutation",
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private $client;

    /**
     * @ORM\Column(type="float")
     * @Groups({
     *     "cashback-client-level:collection_query",
     *     "cashback-client-level:item_query",
     *     "cashback-client-level:create_mutation",
     * })
     */
    private $profit;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({
     *     "cashback-client-level:collection_query",
     *     "cashback-client-level:item_query",
     *     "cashback-client-level:create_mutation",
     * })
     */
    private $isCurrent;

    /**
     * @ORM\Column(type="integer")
     * @Groups({
     *     "cashback-client-level:collection_query",
     *     "cashback-client-level:item_query",
     *     "cashback-client-level:create_mutation",
     * })
     */
    private $updatedAt;

    /**
     * @ORM\Column(type="integer")
     * @Groups({
     *     "cashback-client-level:collection_query",
     *     "cashback-client-level:item_query",
     *     "cashback-client-level:create_mutation",
     * })
     */
    private $createdAt;

    /**
     * CashbackClientLevel constructor.
     */
    public function __construct() {
        $this->isCurrent = false;
        $this->profit = 0;
        $this->createdAt = time();
        $this->updatedAt = time();
    }

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return CashbackLevel
     */
    public function getCashbackLevel(): CashbackLevel
    {
        return $this->cashbackLevel;
    }

    /**
     * @param CashbackLevel|null $cashbackLevel
     * @return $this
     */
    public function setCashbackLevel(?CashbackLevel $cashbackLevel): self
    {
        $this->cashbackLevel = $cashbackLevel;

        return $this;
    }

    /**
     * @return float|null
     */
    public function getProfit(): ?float
    {
        return $this->profit;
    }

    /**
     * @param float $profit
     * @return $this
     */
    public function setProfit(float $profit): self
    {
        $this->profit = $profit;

        return $this;
    }

    /**
     * @return bool|null
     */
    public function getIsCurrent(): ?bool
    {
        return $this->isCurrent;
    }

    /**
     * @param bool $isCurrent
     * @return $this
     */
    public function setIsCurrent(bool $isCurrent): self
    {
        $this->isCurrent = $isCurrent;

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
     * @return mixed
     */
    public function getClient()
    {
        return $this->client;
    }

    /**
     * @param mixed $client
     */
    public function setClient($client): void
    {
        $this->client = $client;
    }
}

<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Action\NotFoundAction;
use Calculation\Utils\Exchange\ServiceInterface;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\UuidInterface;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity()
 * @ApiResource(
 *     attributes={"pagination_enabled"=false},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *          "collection_query"={"normalization_context"={"groups"={"service:collection_query"}}}
 *     }
 * )
 */
class Service implements ServiceInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private ?int $id;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=20)
     * @Groups({
     *     "service:collection_query",
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair:collection_query",
     *     "pair:collection_rates",
     * })
     */
    private ?string $name;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=20)
     * @Groups({
     *     "service:collection_query",
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair:collection_query",
     *     "pair:collection_rates",
     * })
     */
    private ?string $tag;

    /**
     * @var UuidInterface|null
     * @ORM\Column(type="uuid")
     * @Groups({
     *     "pair-unit:collection_query",
     *     "pair-unit:item_query",
     *     "pair:collection_query"
     * })
     */
    private ?UuidInterface $connection;

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
     * @return string
     */
    public function getTag(): string
    {
        return $this->tag;
    }

    /**
     * @param string $tag
     * @return $this
     */
    public function setTag(string $tag): self
    {
        $this->tag = $tag;

        return $this;
    }

    /**
     * @return UuidInterface|null
     */
    public function getConnection(): ?UuidInterface
    {
        return $this->connection;
    }

    /**
     * @param UuidInterface $connection
     * @return $this
     */
    public function setConnection(UuidInterface $connection): self
    {
        $this->connection = $connection;

        return $this;
    }
}

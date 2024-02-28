<?php


namespace App\Entity\Traits;


use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * Trait BitwiseFlagsTrait
 * @package App\Entity\Traits
 */
trait BitwiseFlagsTrait
{
    /**
     * @var int
     * @Groups({"pair:write", "pair:read", "pair_mutation", "item_query", "pair_item_query", "calculator_collection_query", "collection_query"})
     * @ORM\Column(type="integer")
     */
    private int $flags;

    /**
     * @return int
     */
    public function getFlags(): int
    {
        return $this->flags;
    }

    /**
     * @param int $flags
     * @return $this
     */
    public function setFlags(int $flags): self
    {
        $this->flags = $flags;

        return $this;
    }

    /**
     * @param int $const
     * @return bool
     */
    protected function isFlagSet(int $const): bool
    {
        return ($this->flags & $const) === $const;
    }

    /**
     * @param int $const
     * @param bool $value
     */
    protected function setFlag(int $const, bool $value): void
    {
        $value ? $this->flags |= $const : $this->flags &= ~$const;
    }
}
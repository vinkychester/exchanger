<?php


namespace App\Entity\Traits;


use Doctrine\ORM\Mapping as ORM;
use Exception;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * Adds created at and updated at timestamps to entities.
 * Entities using this must have HasLifecycleCallbacks annotation.
 * Trait TimestampableTrait
 * @package App\Entity\Traits
 * @ORM\HasLifecycleCallbacks
 */
trait TimestampableTrait
{
    /**
     * @var int $createdAt
     * @ORM\Column(name="created_at", type="integer")
     * @Groups({
     *     "requisition:collection_query",
     *     "requisition:details",
     *     "requisition:item_query",
     *     "user:item_query",
     *     "user:collection_query",
     *     "review:item_query",
     *     "review:collection_query",
     *     "referral-client-level:collection_query",
     *     "referral-client-level:item_query",
     *     "referral-client-level:create_mutation",
     *     "post:item_query",
     *     "post:collection_query",
     *     "post:mutation_update",
     *     "user:collection_query",
     *     "payout-requisition:collection_query",
     *     "managers:item_query",
     *     "managers:collection_query",
     *     "feedback:collection_query",
     *     "feedback:item_query",
     *     "feedbackMessage:collection_query",
     *     "feedbackMessage:item_query",
     *     "traffic:collection_query",
     *     "trafficDetails:collection_query",
     *     "credit-card:item_query",
     *     "credit-card:collection_query",
     *     "referral-user-relation:item_query",
     *     "mailing:collection_query",
     *     "mailing:item_query",
     *     "manager-percent-profit-history:collection_query",
     *     "manager-percent-profit-history:item_query"
     * })
     */
    private int $createdAt;

    /**
     * Gets triggered only on insert
     *
     * @ORM\PrePersist()
     * @throws Exception
     */
    public function onCreatedAt(): void
    {
        $this->createdAt = time();
    }

    /**
     * Get createdAt
     *
     * @return int
     */
    public function getCreatedAt(): int
    {
        return $this->createdAt;
    }

     /**
     * @param int $createdAt
     * @return TimestampableTrait
     */
    public function setCreatedAt(int $createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }
}

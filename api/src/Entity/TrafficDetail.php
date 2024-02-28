<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Traits\TimestampableTrait;
use DateTime;
use DateTimeZone;
use Doctrine\ORM\Mapping as ORM;
use Exception;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\{
    NumericFilter,
    RangeFilter
};

/**
 * @ApiResource(
 *     attributes={"order"={"id": "DESC"}, "pagination_enabled"=true, "pagination_type"="page"},
 *     graphql={
 *          "collection_query"={
 *              "normalization_context"={"groups"={"trafficDetails:collection_query"}},
 *              "security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_SEO')"
 *          }
 *     }
 * )
 * @ORM\Entity(repositoryClass="App\Repository\TrafficDetailRepository")
 * @ApiFilter(NumericFilter::class, properties={"trafficLink.id"})
 * @ApiFilter(RangeFilter::class, properties={"createdAt"})
 */
class TrafficDetail
{
    use TimestampableTrait;
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=100)
     * @Groups({"read","write","trafficDetails:collection_query"})
     */
    private string $ip = '';

    /**
     * @ORM\ManyToOne(targetEntity="TrafficLink",inversedBy="trafficDetail")
     * @Groups({"read"})
     */
    private ?TrafficLink $trafficLink;

    /**
     * TrafficDetail constructor.
     * @throws Exception
     */
    public function __construct()
    {
        $this->time = new DateTime('now', new DateTimeZone('Europe/Kiev'));
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
    public function getIp(): ?string
    {
        return $this->ip;
    }

    /**
     * @param string $ip
     * @return $this
     */
    public function setIp(string $ip): self
    {
        $this->ip = $ip;

        return $this;
    }

    /**
     * @return TrafficLink|null
     */
    public function getTrafficLink(): ?TrafficLink
    {
        return $this->trafficLink;
    }

    /**
     * @param TrafficLink|null $trafficLink
     * @return $this
     */
    public function setTrafficLink(?TrafficLink $trafficLink): self
    {
        $this->trafficLink = $trafficLink;

        return $this;
    }
}

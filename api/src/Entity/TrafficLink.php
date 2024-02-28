<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Traits\TimestampableTrait;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\PersistentCollection;
use Exception;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\{
    SearchFilter, RangeFilter, NumericFilter
};
use App\Controller\TrafficStatisticsExcelAction;

/**
 * @ORM\HasLifecycleCallbacks
 * @ApiResource(
 *     attributes={"order"={"createdAt": "DESC"}, "pagination_client_enabled"=true, "pagination_type"="page"},
 *     collectionOperations={
            "api_excel_statistics_traffic" = {
 *                "method"="GET",
 *                "path"="panel/traffic/excel",
 *                "controller"=TrafficStatisticsExcelAction::class
 *          }
 *     },
 *     itemOperations={
 *          "get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}
 *     },
 *     graphql={
 *          "item_query"={
 *              "normalization_context"={"groups"={"traffic:item_query"}},
 *              "security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_SEO')"
 *          },
 *          "collection_query"={
 *              "normalization_context"={"groups"={"traffic:collection_query"}},
 *              "security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_SEO')"
 *          },
 *          "create"={
 *              "denormalization_context"={"groups"={"traffic:create-mutation"}},
 *              "security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_SEO')"
 *          },
 *          "update"={
 *              "denormalization_context"={"groups"={"traffic:update-mutation"}},
 *              "security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_SEO')"
 *          },
 *          "delete"={
 *              "security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_SEO')"
 *          },
 *          "updateConversion"={
 *              "mutation"="App\Resolver\TrafficLink\UpdateConversionResolver",
 *              "args"= {
 *                  "token"={"type"="String!"},
 *              },
 *              "denormalization_context"={"groups"={"traffic:update-mutation"}},
 *          }
 *     }
 * )
 * @ORM\Entity(repositoryClass="App\Repository\TrafficLinkRepository")
 * @ORM\EntityListeners(value={"App\EntityListener\TrafficLinkEntityListener"})
 * @UniqueEntity(fields={"siteName"}, message="Данный сайт уже существует")
 * @ApiFilter(SearchFilter::class, properties={
 *     "siteName": "partial"
 * })
 * @ApiFilter(RangeFilter::class, properties={"createdAt"})
 * @ApiFilter(NumericFilter::class, properties={"id"})
 */
class TrafficLink
{

    use TimestampableTrait;

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(
     *     message = "Имя сайта не может быть пустым"
     * )
     * @Groups({
     *     "traffic:item_query",
     *     "traffic:collection_query",
     *     "traffic:create-mutation",
     *     "traffic:update-mutation",
     *     "user:item_query",
     *     "user:collection_query",
     * })
     */
    private ?string $siteName;

    /**
     * @ORM\Column(type="string")
     * @Assert\NotBlank(
     *     message = "Поле ссылка не может быть пустым"
     * )
     * @Assert\Regex(
     *     pattern="/^(https:\/\/coin24\.com\.ua)(\/?[\w\-\.]?)*$/",
     *     message="Введите корректный url"
     * )
     * @Groups({
     *     "traffic:item_query",
     *     "traffic:collection_query",
     *     "traffic:create-mutation",
     *     "traffic:update-mutation"
     * })
     */
    private $siteUrl;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({
     *     "traffic:item_query",
     *     "traffic:collection_query",
     *     "traffic:update-mutation"
     * })
     */
    private ?string $token;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity="TrafficDetail", mappedBy="trafficLink", cascade={"persist","remove"}, orphanRemoval=true)
     * @Groups({
     *     "traffic:item_query",
     *     "traffic:collection_query",
     *     "traffic:create-mutation",
     *     "traffic:update-mutation"
     * })
     */
    private $trafficDetails;

    /**
     * @var PersistentCollection
     * @ORM\OneToMany(targetEntity=Client::class, mappedBy="trafficLink", cascade={"persist"})
     * @Groups({
     *     "user:item_query",
     *     "user:collection_query",
     *     "traffic:item_query",
     *     "traffic:collection_query",
     *     "traffic:create-mutation",
     *     "traffic:update-mutation"
     * })
     */
    private PersistentCollection $clients;

    /**
     * @ORM\Column(type="integer")
     * @Groups({
     *     "traffic:item_query",
     *     "traffic:collection_query"
     * })
     */
    private int $countOfRegisterClients = 0;

    /**
     * @ORM\Column(type="integer")
     * @Groups({
     *     "traffic:item_query",
     *     "traffic:collection_query"
     * })
     */
    private int $countOfClicks = 0;

    /**
     * @var int
     */
    private int $countOfClicksForPeriod;

    /**
     * @var int
     */
    private int $countOfRequisitionForPeriod;

    /**
     * @var float
     */
    private float $systemProfitForPeriod;

    /**
     * @var float
     */
    private float $cleanSystemProfitForPeriod;

    /**
     * @var int
     * @ORM\Column(type="integer")
     * @Groups({
     *     "traffic:item_query",
     *     "traffic:collection_query"
     * })
     */
    private int $countOfRequisition = 0;

    /**
     * @var float
     * @ORM\Column(type="float")
     * @Groups({
     *     "traffic:item_query",
     *     "traffic:collection_query"
     * })
     */
    private $systemProfit = 0;

    /**
     * @var float
     * @ORM\Column(type="float")
     * @Groups({
     *     "traffic:item_query",
     *     "traffic:collection_query"
     * })
     */
    private $cleanSystemProfit = 0;

    /**
     * @var array
     * @Groups({"read"})
     */
    private array $registerClients;

    /**
     * Traffic constructor.
     * @throws Exception
     */
    public function __construct()
    {
        $this->trafficDetails = [];
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
    public function getSiteName(): ?string
    {
        return $this->siteName;
    }

    /**
     * @param string $siteName
     * @return $this
     */
    public function setSiteName(string $siteName): self
    {
        $this->siteName = $siteName;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getToken(): ?string
    {
        return $this->token;
    }

    /**
     * @param string $token
     * @return $this
     */
    public function setToken(string $token): self
    {
        $this->token = $token;

        return $this;
    }

    /**
     * @return array|object
     */
    public function getTrafficDetails()
    {
        return $this->trafficDetails;
    }

    /**
     * @return int
     */
    public function getCountOfRegisterClients(): int
    {
        return $this->countOfRegisterClients;
    }

    /**
     * @param int $countOfRegisterClients
     */
    public function setCountOfRegisterClients(int $countOfRegisterClients): void
    {
        $this->countOfRegisterClients = $countOfRegisterClients;
    }

    /**
     * @return int
     */
    public function getCountOfClicks(): int
    {
        return $this->countOfClicks;
    }

    /**
     * @param int $countOfClicks
     */
    public function setCountOfClicks(int $countOfClicks): void
    {
        $this->countOfClicks = $countOfClicks;
    }

    /**
     * @return int
     */
    public function getCountOfRequisition(): int
    {
        return $this->countOfRequisition;
    }

    /**
     * @param int $countOfRequisition
     */
    public function setCountOfRequisition(int $countOfRequisition): void
    {
        $this->countOfRequisition = $countOfRequisition;
    }


    /**
     * @return mixed
     */
    public function getSiteUrl()
    {
        return $this->siteUrl;
    }

    /**
     * @param mixed $siteUrl
     */
    public function setSiteUrl($siteUrl): void
    {
        $this->siteUrl = str_replace(' ', '', $siteUrl);
    }

    /**
     * @param float $systemProfit
     * @return TrafficLink
     */
    public function setSystemProfit(float $systemProfit): TrafficLink
    {
        $this->systemProfit = $systemProfit;

        return $this;
    }

    /**
     * @return float
     */
    public function getSystemProfit(): float
    {
        return $this->systemProfit;
    }


    /**
     * @param float $cleanSystemProfit
     * @return TrafficLink
     */
    public function setCleanSystemProfit(float $cleanSystemProfit): TrafficLink
    {
        $this->cleanSystemProfit = $cleanSystemProfit;

        return $this;
    }

    /**
     * @return float
     */
    public function getCleanSystemProfit(): float
    {
        return $this->cleanSystemProfit;
    }

    /**
     * @param int $increment
     */
    public function increaseCountOfRegisteregClients($increment = 1)
    {
        $this->countOfRegisterClients += $increment;
    }

    /**
     * @param int $increment
     */
    public function increaseCountOfClicks($increment = 1)
    {
        $this->countOfClicks += $increment;
    }

    /**
     * @param int $increment
     */
    public function increaseCountOfRequisitions($increment = 1)
    {
        $this->countOfRequisition += $increment;
    }

    /**
     * @param int $increment
     */
    public function increaseSystemProfit($increment = 0)
    {
        $this->systemProfit += $increment;
    }

    /**
     * @param int $increment
     */
    public function increaseCleanSystemProfit($increment = 0)
    {
        $this->cleanSystemProfit += $increment;
    }

    /**
     * @return array
     */
    public function getRegisterClients(): array
    {
        return $this->registerClients ?? [];
    }

    /**
     * @param array $registerClients
     */
    public function setRegisterClients(array $registerClients): void
    {
        $this->registerClients = $registerClients;
    }

    /**
     * @return int
     */
    public function getCountOfClicksForPeriod(): int
    {
        return $this->countOfClicksForPeriod;
    }

    /**
     * @param int $countOfClicksForPeriod
     */
    public function setCountOfClicksForPeriod(int $countOfClicksForPeriod): void
    {
        $this->countOfClicksForPeriod = $countOfClicksForPeriod;
    }

    /**
     * @return int
     */
    public function getCountOfRequisitionForPeriod(): int
    {
        return $this->countOfRequisitionForPeriod;
    }

    /**
     * @param int $countOfRequisitionForPeriod
     */
    public function setCountOfRequisitionForPeriod(int $countOfRequisitionForPeriod): void
    {
        $this->countOfRequisitionForPeriod = $countOfRequisitionForPeriod;
    }

    /**
     * @return float
     */
    public function getSystemProfitForPeriod(): float
    {
        return $this->systemProfitForPeriod;
    }

    /**
     * @param float $systemProfitForPeriod
     */
    public function setSystemProfitForPeriod(float $systemProfitForPeriod): void
    {
        $this->systemProfitForPeriod = $systemProfitForPeriod;
    }

    /**
     * @return float
     */
    public function getCleanSystemProfitForPeriod(): float
    {
        return $this->cleanSystemProfitForPeriod;
    }

    /**
     * @param float $cleanSystemProfitForPeriod
     */
    public function setCleanSystemProfitForPeriod(float $cleanSystemProfitForPeriod): void
    {
        $this->cleanSystemProfitForPeriod = $cleanSystemProfitForPeriod;
    }

    /**
     * @return PersistentCollection
     */
    public function getClients(): PersistentCollection
    {
        return $this->clients;
    }

    /**
     * @param PersistentCollection $clients
     */
    public function setClients(PersistentCollection $clients): void
    {
        $this->clients = $clients;
    }
}

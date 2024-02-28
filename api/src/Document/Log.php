<?php


namespace App\Document;

use DateTime;
use DateTimeZone;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Exception;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Action\NotFoundAction;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\MongoDbOdm\Filter\{SearchFilter, DateFilter};

/**
 * @MongoDB\Document(repositoryClass=LogRepository::class)
 * @ApiResource(
 *     attributes={"order"={"date": "DESC"}, "pagination_client_enabled"=true, "pagination_type"="page"},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *        "item_query",
 *        "collection_query"={
 *             "normalization_context"={"groups"={"log:collection_query"}},
 *             "security"="is_granted('ROLE_ADMIN')"
 *        }
 *     }
 * )
 * @ApiFilter(
 *     SearchFilter::class,
 *     properties={
 *          "entityClass": SearchFilter::STRATEGY_PARTIAL,
 *          "userEmail": SearchFilter::STRATEGY_PARTIAL,
 *          "action": SearchFilter::STRATEGY_PARTIAL,
 *          "text": SearchFilter::STRATEGY_PARTIAL,
 *          "ip": SearchFilter::STRATEGY_PARTIAL
 * })
 * @ApiFilter(DateFilter::class,  properties={"date"})
 */
class Log
{
    /**
     * @MongoDB\Id()
     */
    private $id;

    /**
     * @var string|null
     * @MongoDB\Field(type="string")
     * @Groups({
     *     "log:collection_query",
     * })
     */
    private ?string $entityClass = '';

    /**
     * @var string|null
     * @MongoDB\Field(type="string")
     * @Groups({
     *     "log:collection_query",
     * })
     */
    private ?string $userEmail = '';

    /**
     * @var string
     * @MongoDB\Field(type="string")
     * @Groups({
     *     "log:collection_query",
     * })
     */
    private string $action;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     * @Groups({
     *     "log:collection_query",
     * })
     */
    private string $text;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     * @Groups({
     *     "log:collection_query",
     * })
     */
    private string $ip;

    /**
     * @var string
     * @MongoDB\Field(type="string")
     * @Groups({
     *     "log:collection_query",
     * })
     */
    private string $countryZipCode;

    /**
     * @var DateTime
     * @MongoDB\Field(type="date")
     * @Groups({
     *     "log:collection_query",
     * })
     */
    private DateTime $date;

    /**
     * Log constructor.
     * @param $action
     * @param $text
     * @param string $entityClass
     * @param string $userEmail
     * @param $ip
     * @throws Exception
     */
    public function __construct(
        $action = '',
        $text = '',
        $entityClass = '',
        $userEmail = '',
        $ip = ''
        /*, $countryZipCode*/
    )
    {
        $this->entityClass = $entityClass;
        $this->userEmail = $userEmail;
        $this->action = $action;
        $this->text = $text;
        $this->date = new DateTime('now', new DateTimeZone('Europe/Kiev'));
        $this->ip = $ip;
        //$this->countryZipCode = $countryZipCode;
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getAction()
    {
        return $this->action;
    }

    /**
     * @param mixed $action
     */
    public function setAction($action): void
    {
        $this->action = $action;
    }

    /**
     * @return mixed
     */
    public function getText()
    {
        return $this->text;
    }

    /**
     * @param mixed $text
     */
    public function setText($text): void
    {
        $this->text = $text;
    }

    /**
     * @return mixed
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * @param mixed $date
     */
    public function setDate($date): void
    {
        $this->date = $date;
    }

    /**
     * @return string|null
     */
    public function getEntityClass(): ?string
    {
        return $this->entityClass;
    }

    /**
     * @param string|null $entityClass
     */
    public function setEntityClass(?string $entityClass): void
    {
        $this->entityClass = $entityClass;
    }

    /**
     * @return mixed
     */
    public function getUserEmail()
    {
        return $this->userEmail;
    }

    /**
     * @param mixed $userEmail
     */
    public function setUserEmail($userEmail): void
    {
        $this->userEmail = $userEmail;
    }

    /**
     * @return mixed
     */
    public function getIp()
    {
        return $this->ip;
    }

    /**
     * @param mixed $ip
     */
    public function setIp($ip): void
    {
        $this->ip = $ip;
    }

    /**
     * @return mixed
     */
    public function getCountryZipCode()
    {
        return $this->countryZipCode;
    }

    /**
     * @param mixed $countryZipCode
     */
    public function setCountryZipCode($countryZipCode): void
    {
        $this->countryZipCode = $countryZipCode;
    }
}

<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Action\NotFoundAction;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ApiResource(
 *     attributes={"pagination_enabled"=false,"order"={"cityName"}},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *         "item_query"={
 *              "normalization_context"={"groups"={"city-details:item_query"}},
 *         },
 *         "collection_query"={
 *              "normalization_context"={"groups"={"city-details:collection_query"}}
 *         },
 *         "update"={
 *              "groups"={"city-details:mutation"},
 *              "security"="is_granted('ROLE_MANAGER') or is_granted('ROLE_ADMIN') or is_granted('ROLE_SEO')",
 *         },
 *         "delete"={
 *              "groups"={"city-details:mutation"},
 *              "security"="is_granted('ROLE_MANAGER') or is_granted('ROLE_ADMIN') or is_granted('ROLE_SEO')",
 *         },
 *         "create"={
 *              "groups"={"city-details:mutation"},
 *              "security"="is_granted('ROLE_MANAGER') or is_granted('ROLE_ADMIN') or is_granted('ROLE_SEO')",
 *         },
 *     }
 * )
 * @ORM\Entity()
 * @ApiFilter(BooleanFilter::class, properties={"isPublish"})
 * @ApiFilter(SearchFilter::class, properties={"cityUrl"})
 * @UniqueEntity(
 *     fields={"cityUrl"},
 *     message="Этот URL уже используется"
 * )
 * @UniqueEntity(
 *     fields={"cityName"},
 *     message="Это имя уже используется!")
 * )
 * @ORM\EntityListeners(value={"App\EntityListener\CityDescriptionEntityListener"})
 */
class CityDescription
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=5000, nullable=true)
     * @Groups({
     *     "city-details:item_query",
     *     "city-details:collection_query",
     *     "city-details:mutation",
     *     "city:collection_query",
     *     "city:item_query",
     * })
     * @Assert\Length(
     *      min = 0,
     *      max = 5000,
     *      minMessage = "Описание должно быть как минимум {{ limit }} символов",
     *      maxMessage = "Описание не может быть длинне чем {{ limit }} символом",
     *      allowEmptyString = false,
     * )
     */
    private $description;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({
     *     "city-details:item_query",
     *     "city-details:collection_query",
     *     "city-details:mutation",
     *     "city:collection_query",
     *     "city:item_query",
     * })
     */
    private $isPublish;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     * @Groups({
     *     "city-details:item_query",
     *     "city-details:collection_query",
     *     "city-details:mutation",
     *     "city:collection_query",
     *     "city:item_query",
     * })
     * @Assert\NotBlank(
     *     message = "Ссылка города не может быть пустым"
     * )
     */
    private $cityUrl;

    /**
     * @ORM\Column(type="string", length=500, nullable=true)
     * @Groups({
     *     "city-details:item_query",
     *     "city-details:collection_query",
     *     "city-details:mutation",
     *     "city:collection_query",
     *     "city:item_query",
     * })
     */
    private $metaDescription;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     * @Groups({
     *     "city-details:item_query",
     *     "city-details:collection_query",
     *     "city-details:mutation",
     *     "city:collection_query",
     *     "city:item_query",
     * })
     */
    private $metaTitle;

    /**
     * @ORM\Column(type="string", length=50)
     * @Groups({
     *     "city-details:item_query",
     *     "city-details:collection_query",
     *     "city-details:mutation",
     *     "city:collection_query",
     *     "city:item_query",
     * })
     */
    private $cityName;

    public function __construct()
    {
        $this->isPublish = false;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return string|null
     */
    public function getDescription(): ?string
    {
        return $this->description;
    }

    /**
     * @param string|null $description
     * @return $this
     */
    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return bool|null
     */
    public function getIsPublish(): ?bool
    {
        return $this->isPublish;
    }

    /**
     * @param bool $isPublish
     * @return $this
     */
    public function setIsPublish(bool $isPublish): self
    {
        $this->isPublish = $isPublish;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getCityUrl(): ?string
    {
        return $this->cityUrl;
    }

    /**
     * @param string|null $cityUrl
     * @return $this
     */
    public function setCityUrl(?string $cityUrl): self
    {
        $this->cityUrl = $cityUrl;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getMetaDescription(): ?string
    {
        return $this->metaDescription;
    }

    /**
     * @param string|null $metaDescription
     * @return $this
     */
    public function setMetaDescription(?string $metaDescription): self
    {
        $this->metaDescription = $metaDescription;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getMetaTitle(): ?string
    {
        return $this->metaTitle;
    }

    /**
     * @param string|null $metaTitle
     * @return $this
     */
    public function setMetaTitle(?string $metaTitle): self
    {
        $this->metaTitle = $metaTitle;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getCityName(): ?string
    {
        return $this->cityName;
    }

    /**
     * @param string $cityName
     * @return $this
     */
    public function setCityName(string $cityName): self
    {
        $this->cityName = $cityName;

        return $this;
    }
}

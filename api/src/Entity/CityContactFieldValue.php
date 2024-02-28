<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\CityContactFieldValueRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Action\NotFoundAction;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Resolver\CityContactFieldValue\CreateContactFieldValueResolver;
use App\Resolver\CityContactFieldValue\CreateContactFieldValuesResolver;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\{ExistsFilter};
/**
 * @ApiResource(
 *     attributes={"pagination_enabled"=false},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *         "item_query"={
 *              "normalization_context"={"groups"={"city-contact-field-value:item_query"}},
 *         },
 *         "collection_query"={
 *              "normalization_context"={"groups"={"city-contact-field-value:collection_query"}}
 *         },
 *         "create" = {
 *              "security"="is_granted('ROLE_MANAGER') or is_granted('ROLE_ADMIN')",
 *          },
 *         "delete" = {
 *              "security"="is_granted('ROLE_MANAGER') or is_granted('ROLE_ADMIN')",
 *          },
 *         "createUpdate"={
 *              "mutation"=CreateContactFieldValueResolver::class,
 *              "args"={
 *                  "cityID"={"type"="String!"},
 *                  "fieldID"={"type"="Int!"},
 *                  "fieldValue"={"type"="String!"},
 *              },
 *              "security"="is_granted('ROLE_MANAGER') or is_granted('ROLE_ADMIN')",
 *          },
 *         "createValues"={
 *              "mutation"=CreateContactFieldValuesResolver::class,
 *              "args"={
 *                  "cityID"={"type"="String!"},
 *                  "contactNames"={"type"="[String]!"},
 *                  "contactValues"={"type"="[String]!"},
 *                  "isPublic"={"type"="Boolean!"},
 *              },
 *              "security"="is_granted('ROLE_MANAGER') or is_granted('ROLE_ADMIN')",
 *          },
 *     }
 * )
 *
 * @ApiFilter(ExistsFilter::class, properties={"value"})
 * @ORM\Entity(repositoryClass=CityContactFieldValueRepository::class)
 * @ORM\EntityListeners(value={"App\EntityListener\CityContactFieldValueEntityListener"})
 */
class CityContactFieldValue
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=CityContact::class, inversedBy="cityContactFieldValues")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({
     *     "city-contact-field-value:item_query",
     *     "city-contact-field-value:collection_query",
     * })
     */
    private $cityContact;

    /**
     * @ORM\ManyToOne(targetEntity=CityContactField::class, inversedBy="cityContactFieldValues")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({
     *     "city-contact-field-value:item_query",
     *     "city-contact-field-value:collection_query",
     * })
     */
    private $cityContactField;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({
     *     "city-contact-field-value:item_query",
     *     "city-contact-field-value:collection_query",
     *     "city-contact:item_query",
     *     "city-contact:collection_query",
     * })
     */
    private $value;

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return CityContact|null
     */
    public function getCityContact(): ?CityContact
    {
        return $this->cityContact;
    }

    /**
     * @param CityContact|null $cityContact
     * @return $this
     */
    public function setCityContact(?CityContact $cityContact): self
    {
        $this->cityContact = $cityContact;

        return $this;
    }

    /**
     * @return CityContactField|null
     */
    public function getCityContactField(): ?CityContactField
    {
        return $this->cityContactField;
    }

    /**
     * @param CityContactField|null $cityContactField
     * @return $this|null
     */
    public function setCityContactField(?CityContactField $cityContactField): ?self
    {
        $this->cityContactField = $cityContactField;

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
}

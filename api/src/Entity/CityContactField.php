<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Action\NotFoundAction;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ApiResource(
 *     attributes={"pagination_enabled"=false},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *         "item_query"={
 *              "normalization_context"={"groups"={"city-contact-field:item_query"}},
 *         },
 *         "collection_query"={
 *              "normalization_context"={"groups"={"city-contact-field:collection_query"}}
 *         },
 *         "update" = {
 *              "security"="is_granted('ROLE_MANAGER') or is_granted('ROLE_ADMIN')",
 *          },
 *         "delete" = {
 *              "security"="is_granted('ROLE_MANAGER') or is_granted('ROLE_ADMIN')",
 *          },
 *         "create" = {
 *              "security"="is_granted('ROLE_MANAGER') or is_granted('ROLE_ADMIN')",
 *          },
 *     }
 * )
 * @ORM\Entity()
 * @UniqueEntity(fields={"name"}, message="Это имя уже используется!"))
 */
class CityContactField
{
    public const TYPE_STRING = 'string';
    public const TYPE_PHONE_NUMBER = 'phone';
    public const TYPE_TELEGRAM = 'telegram';
    public const TYPE_VIBER = 'telegram';
    public const TYPE_WHATSAPP = 'whatsapp';
    public const TYPE_SKYPE = 'skype';

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=100, unique=true)
     * @Groups({
     *     "city-contact-field:item_query",
     *     "city-contact-field:collection_query",
     *     "city-contact-field-value:collection_query",
     *     "city-contact-field-value:item_query",
     * })
     * @Assert\NotBlank()
     */
    private $name;

    /**
     * @ORM\OneToMany(targetEntity=CityContactFieldValue::class, mappedBy="cityContactField", cascade={"persist", "remove"})
     * @Groups({
     *     "city-contact-field:item_query",
     *     "city-contact-field:collection_query",
     * })
     */
    private $cityContactFieldValues;

    /**
     * @ORM\Column(type="string", length=50)
     * @Groups({
     *     "city-contact-field:item_query",
     *     "city-contact-field:collection_query",
     *     "city-contact-field-value:collection_query",
     *     "city-contact-field-value:item_query",
     * })
     */
    private $type;

    public function __construct()
    {
        $this->type = self::TYPE_STRING;
        $this->cityContactFieldValues = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return string|null
     */
    public function getName(): ?string
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
     * @return Collection|CityContactFieldValue[]
     */
    public function getCityContactFieldValues(): Collection
    {
        return $this->cityContactFieldValues;
    }

    /**
     * @param CityContactFieldValue $cityContactFieldValue
     * @return $this
     */
    public function addCityContactFieldValue(CityContactFieldValue $cityContactFieldValue): self
    {
        if (!$this->cityContactFieldValues->contains($cityContactFieldValue)) {
            $this->cityContactFieldValues[] = $cityContactFieldValue;
            $cityContactFieldValue->setCityContactField($this);
        }

        return $this;
    }

    /**
     * @param CityContactFieldValue $cityContactFieldValue
     * @return $this
     */
    public function removeCityContactFieldValue(CityContactFieldValue $cityContactFieldValue): self
    {
        if ($this->cityContactFieldValues->removeElement($cityContactFieldValue)) {
            // set the owning side to null (unless already changed)
            if ($cityContactFieldValue->getCityContactField() === $this) {
                $cityContactFieldValue->setCityContactField(null);
            }
        }

        return $this;
    }

    /**
     * @return string|null
     */
    public function getType(): ?string
    {
        return $this->type;
    }

    /**
     * @param string $type
     * @return $this
     */
    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }
}

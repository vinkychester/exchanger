<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Action\NotFoundAction;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ApiResource(
 *     attributes={
 *          "pagination_type"="page",
 *          "pagination_client_enabled"=true,
 *          "security"="is_granted('ROLE_CLIENT')",
 *     },
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *          "update"={"groups"={"client-verification-schema:update_mutation"}},
 *          "collection_query"={
 *              "normalization_context"={"groups"={"client-verification-schema:collection_query"}}
 *          },
 *          "item_query"={"normalization_context"={"groups"={"client-verification-schema:item_query"}}},
 *          "create"={
 *              "denormalization_context"={"groups"={"client-verification-schema:mutation_create"}},
 *              "security_post_denormalize"="is_granted('ROLE_CLIENT')",
 *          }
 *     }
 * )
 * @ApiFilter(SearchFilter::class, properties={"verificationSchema": "exact", "client": "exect"})
 * @ORM\Entity()
 */
class ClientVerificationSchema
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private int $id;

    /**
     * @ORM\ManyToOne(targetEntity=VerificationSchema::class, inversedBy="clientVerificationSchema")
     * @Groups({
     *     "client-verification-schema:mutation_create",
     * })
     */
    private $verificationSchema;

    /**
     * @ORM\ManyToOne(targetEntity=Client::class, inversedBy="clientVerificationSchema")
     * @Groups({
     *     "client-verification-schema:mutation_create",
     *     "client-verification-schema:collection_query",
     *     "verificationSchema:collection_query"
     * })
     */
    private $client;


    /**
     * @var array
     * @Groups({
     *     "verificationSchema:item_query",
     *     "client-verification-schema:collection_query",
     *     "verificationSchema:collection_query"
     * })
     */
    private array $verificationInfo = [];

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getVerificationSchema()
    {
        return $this->verificationSchema;
    }

    /**
     * @param $verificationSchema
     * @return $this
     */
    public function setVerificationSchema($verificationSchema): self
    {
        $this->verificationSchema = $verificationSchema;

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
     * @param $client
     * @return $this
     */
    public function setClient($client): self
    {
        $this->client = $client;

        return $this;
    }

    /**
     * @return array
     */
    public function getVerificationInfo(): array
    {
        return $this->verificationInfo;
    }

    /**
     * @param array $verificationInfo
     */
    public function setVerificationInfo(array $verificationInfo): void
    {
        $this->verificationInfo = $verificationInfo;
    }
}

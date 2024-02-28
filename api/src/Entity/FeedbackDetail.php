<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Entity\Traits\TimestampableTrait;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Action\NotFoundAction;

/**
 * @ORM\Entity()
 * * @ApiResource(
 *     attributes={"pagination_enabled"=false},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *          "item_query"={"normalization_context"={"groups"={"feedbackMessage:item_query"}}},
 *      "collection_query"={"normalization_context"={"groups"={"feedbackMessage:collection_query"}}},
 *      "create"={
 *          "denormalization_context"={"groups"={"feedbackMessage:create-mutation"}},
 *     },
 *     "update"={
 *          "denormalization_context"={"groups"={"feedbackMessage:update-mutation"}},
 *          "security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_MANAGER')"
 *     },
 *     "delete"={"security"="is_granted('ROLE_SUPERADMIN') or is_granted('ROLE_ADMIN') or is_granted('ROLE_MANAGER')"}
 *     },
 * )
 * @ORM\EntityListeners(value={"App\EntityListener\FeedbackDetailEntityListener"})
 */
class FeedbackDetail
{

    public const Client = 'client';
    public const Manager = 'manager';

    use TimestampableTrait;

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column (type="integer")
     */
    private int $id;

    /**
     * @ORM\Column(type="text", length=3600)
     * @Assert\NotBlank(
     *     message = "Ваше сообщение не должно быть пустым",
     * )
     * @Assert\Length(
     *     min = 3,
     *     max = 3600,
     *     minMessage = "Ваше сообщение должно содержать не менее {{ limit }} символов",
     *     maxMessage = "Ваше сообщение не может быть длиннее {{ limit }} символов",
     * )
     * @Groups({"feedbackMessage:collection_query","feedbackMessage:item_query", "feedbackMessage:create-mutation"})
     */
    private string $message;

    /**
     * @ORM\Column(type="string", length=10)
     * @Groups({"feedbackMessage:collection_query","feedbackMessage:item_query", "feedbackMessage:create-mutation"})
     */
    private string $author;

    /**
     * @ORM\ManyToOne(targetEntity="FeedbackMessage", inversedBy="feedbackMessage")
     * @Groups({"feedbackMessage:create-mutation"})
     */
    private FeedbackMessage $feedbackMessage;

    /**
     * FeedbackDetail constructor.
     */
    public function __construct()
    {
        $this->createdAt = time();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId(int $id): void
    {
        $this->id = $id;
    }

    /**
     * @return string
     */
    public function getMessage(): string
    {
        return $this->message;
    }

    /**
     * @param string $message
     */
    public function setMessage(string $message): void
    {
        $this->message = $message;
    }

    /**
     * @return string
     */
    public function getAuthor(): string
    {
        return $this->author;
    }

    /**
     * @param string $author
     */
    public function setAuthor(string $author): void
    {
        $this->author = $author;
    }

    /**
     * @return FeedbackMessage
     */
    public function getFeedbackMessage(): FeedbackMessage
    {
        return $this->feedbackMessage;
    }

    /**
     * @param FeedbackMessage $feedbackMessage
     */
    public function setFeedbackMessage(FeedbackMessage $feedbackMessage): void
    {
        $this->feedbackMessage = $feedbackMessage;
    }

}

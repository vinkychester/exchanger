<?php

namespace App\Entity;

use ApiPlatform\Core\Action\NotFoundAction;
use ApiPlatform\Core\Annotation\ApiResource;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity()
 * @ApiResource(
 *     attributes={"order"={"createdAt": "DESC"}, "pagination_client_enabled"=true, "pagination_type"="page"},
 *     collectionOperations={},
 *     itemOperations={"get"={"controller"=NotFoundAction::class, "read"=false, "output"=false}},
 *     graphql={
 *         "item_query"={"normalization_context"={"groups"={"parent-news:item_query"}}},
 *         "collection_query"={"normalization_context"={"groups"={"parent-news:collection_query"}}},
 *     }
 * )
 */
class ParentNews
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Post", mappedBy="parentNews")
     */
    private $news;

    /**
     * ParentNews constructor.
     */
    public function __construct()
    {
        $this->news = new ArrayCollection();
    }

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return array
     */
    public function getNews(): array
    {
        return $this->news;
    }

    /**
     * @param Post $news
     * @return $this
     */
    public function addNews(Post $news): self
    {
        if (!$this->news->contains($news)) {
            $this->news[] = $news;
            $news->setParentNews($this);
        }

        return $this;
    }

    /**
     * @param Post $news
     * @return $this
     */
    public function removeNews(Post $news): self
    {
        if ($this->news->contains($news)) {
            $this->news->removeElement($news);
            // set the owning side to null (unless already changed)
            if ($news->getParentNews() === $this) {
                $news->setParentNews(null);
            }
        }

        return $this;
    }
}

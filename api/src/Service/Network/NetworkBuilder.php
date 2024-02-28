<?php


namespace App\Service\Network;

use App\Entity\City;
use App\Entity\Network as NetworkEntity;
use App\Service\EntityBuilderInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Class CurrencyBuilder
 * @package App\Service\CurrencyBuilder
 */
class NetworkBuilder implements EntityBuilderInterface
{
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    /**
     * CurrencyBuilder constructor.
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @param $networkResponse
     * @return $this
     */
    public function setItems($networkResponse): NetworkBuilder
    {
        $networks = $networkResponse->getData()->first();

        foreach ($networks->getData() as $network) {

            foreach ($network->getCities() as $city) {
                $cityEntity = $this->entityManager->getRepository(City::class)->findOneBy(
                    ['externalId' => $city->getCity()->getId()]
                );

                if ($cityEntity) {
                    $cityEntity->setName($city->getCity()->getName())
                        ->setTransliteName($city->getCity()->getTranslateName());
                } else {
                    $cityEntity = (new City())
                        ->setExternalId($city->getCity()->getId())
                        ->setName($city->getCity()->getName())
                        ->setTransliteName($city->getCity()->getTranslateName());
                }

                $this->entityManager->persist($cityEntity);
            }

            $this->entityManager->flush();
        }

        return $this;
    }

    /**
     * @return $this
     */
    public function storeItems(): NetworkBuilder
    {
        $this->entityManager->flush();

        return $this;
    }
}

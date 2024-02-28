<?php


namespace App\Resolver;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\Attribute;
use App\Entity\Pair;
use App\Entity\Requisition;
use App\Entity\RequisitionFeeHistory;
use App\Service\RequisitionFeeHistoryBuilder\RequisitionFeeHistoryHistoryBuilder;
use Calculation\Service\Course;
use Calculation\Service\Exchange;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Mercure\PublisherInterface;
use Symfony\Component\Mercure\Update;

class UpdateAttributesMutationResolver implements MutationResolverInterface
{
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;
    /**
     * @var PublisherInterface
     */
    private PublisherInterface $publisher;

    /**
     * UpdateAttributesMutationResolver constructor.
     * @param EntityManagerInterface $entityManager
     * @param PublisherInterface $publisher
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        PublisherInterface $publisher
    )
    {
        $this->entityManager = $entityManager;
        $this->publisher = $publisher;
    }

    /**
     * @param Attribute|null $item
     *
     * @return Attribute
     */
    public function __invoke($item, array $context): ?Attribute
    {
        $args = $context['args']['input'];
        $bankDetails = $args['bank_details'];
        $requisitionId = $args['requisition_id'];
        $pairPercent = $args['pairPercent'];
        $amount = $args['amount'];

        /** @var Requisition $requisition */
        $requisition = $this->entityManager->getRepository(Requisition::class)->find($requisitionId);
        if ($amount !== $requisition->getPayoutAmount()) {
            $requisition->setPayoutAmount($amount);
            $requisition->setCourse(Course::calculate($requisition->getPair(), $pairPercent));
            $requisition->setPairPercent($pairPercent);
            $requisition->setCommission(Course::calculateLastFee($requisition->getPair(), $pairPercent));
        }

        (new RequisitionFeeHistoryHistoryBuilder($this->entityManager))
            ->setFee($requisition, $requisition->getPair()->getPayment(), false)
            ->storeItem();

        (new RequisitionFeeHistoryHistoryBuilder($this->entityManager))
            ->setFee($requisition, $requisition->getPair()->getPayout(), false)
            ->storeItem();

        $em = $this->entityManager;
        $em->persist($requisition);

        array_walk($bankDetails, static function ($value) use ($em) {
            /** @var Attribute $attribute */
            $attribute = $em->getRepository(Attribute::class)->find(explode("/", $value['id'])[3]);
            if (null !== $attribute) {
                $attribute->setValue($value['value']);
                $attribute->setInformation($value['information']);
                $em->persist($attribute);
            }
        });

        $this->entityManager->flush();

        return null;
    }
}
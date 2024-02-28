<?php


namespace App\Service\RequisitionFeeHistoryBuilder;


use App\Entity\Requisition;
use App\Entity\RequisitionFeeHistory;
use Calculation\Utils\Exchange\PairUnitInterface;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Class RequisitionFeeHistoryHistoryBuilder
 * @package App\Service\RequisitionFeeHistoryHistoryBuilder
 */
class RequisitionFeeHistoryHistoryBuilder implements RequisitionFeeHistoryBuilderInterface
{
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    /**
     * BankDetailBuilder constructor.
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @param Requisition $requisition
     * @param PairUnitInterface $pairUnit
     * @param bool $isUpdatePaymentSystemPrice
     * @return mixed|void
     */
    public function setFee(Requisition $requisition, PairUnitInterface $pairUnit, $isUpdatePaymentSystemPrice = true)
    {
        $direction = ucfirst($pairUnit->getDirection());
        $rate = "get{$direction}Rate";

        /** @var RequisitionFeeHistory $fee */
        $fee = $this->entityManager->getRepository(RequisitionFeeHistory::class)->findOneBy([
            'requisitionExternalId' => $requisition->getId(), 'type' => $pairUnit->getDirection()
        ]);

        if (!$fee) {
            $fee = new RequisitionFeeHistory();
            $fee
                ->setRequisitionExternalId($requisition->getId())
                ->setType($pairUnit->getDirection())
                ->setRequisition($requisition);
        }

        $fee
            ->setPercent($pairUnit->getFee()->getPercent())
            ->setPairPercent($requisition->getPair()->getPercent())
            ->setConstant($pairUnit->getFee()->getConstant())
            ->setRate($pairUnit->getCurrency()->$rate())
            ->setRequisition($requisition);

        if ($isUpdatePaymentSystemPrice) {
            $fee->setPaymentSystemPrice($pairUnit->getPrice());
        }

        $this->entityManager->persist($fee);

        return $this;
    }

    /**
     * @return mixed|void
     */
    public function storeItem()
    {
        $this->entityManager->flush();

        return $this;
    }
}
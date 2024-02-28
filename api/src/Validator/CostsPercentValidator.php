<?php

namespace App\Validator;

use App\Entity\CashbackLevel;
use App\Entity\ManagerPercentProfitHistory;
use App\Entity\ReferralLevel;
use App\Repository\ReferralLevelRepository;
use App\Service\SystemCosts\SystemCostsCalculation;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class CostsPercentValidator extends ConstraintValidator
{
    /**
     * @var SystemCostsCalculation
     */
    protected SystemCostsCalculation $systemCostsCalculation;

    /**
     * CostsPercentValidator constructor.
     * @param SystemCostsCalculation $systemCostsCalculation
     */
    public function __construct(SystemCostsCalculation $systemCostsCalculation) {
        $this->systemCostsCalculation = $systemCostsCalculation;
    }

    /**
     * @param mixed $entityObject
     * @param Constraint $constraint
     */
    public function validate($entityObject, Constraint $constraint)
    {
        /* @var $constraint \App\Validator\CostsPercent */

        if (null === $entityObject || '' === $entityObject) {
            return;
        }

        $cashbackCostsPercent = $this->systemCostsCalculation->calculateCashbackCostsPercent();
        $referralCostsPercent = $this->systemCostsCalculation->calculateReferralCostsPercent();
        $managerCostsPercent = $this->systemCostsCalculation->calculateManagerCostsPercent();

        $percentWithNewValue = 0;
        $percentWithoutNewValue = 0;

        if($entityObject instanceof ReferralLevel) {
            $percentWithNewValue = $this->systemCostsCalculation->getReferralCostsPercentWithNewPercent($entityObject)
                + $cashbackCostsPercent
                + $managerCostsPercent;

            $percentWithoutNewValue = $cashbackCostsPercent + $managerCostsPercent + $referralCostsPercent;
        }

        if($entityObject instanceof CashbackLevel) {
            $biggestCashbackPercent = $cashbackCostsPercent > $entityObject->getPercent()
                ? $cashbackCostsPercent
                : $entityObject->getPercent();

            $percentWithNewValue = $referralCostsPercent + $managerCostsPercent + $biggestCashbackPercent;
            $percentWithoutNewValue = $referralCostsPercent + $managerCostsPercent;
        }

        if($entityObject instanceof ManagerPercentProfitHistory) {
            $biggestManagerPercent = $managerCostsPercent > $entityObject->getPercent()
                ? $managerCostsPercent
                : $entityObject->getPercent();

            $percentWithNewValue = $cashbackCostsPercent + $referralCostsPercent + $biggestManagerPercent;

            $percentWithoutNewValue = $cashbackCostsPercent + $referralCostsPercent;
        }

        if($percentWithNewValue > 95) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ value }}', 95 - $percentWithoutNewValue)
                ->atPath('percent')
                ->addViolation();
        }
    }
}

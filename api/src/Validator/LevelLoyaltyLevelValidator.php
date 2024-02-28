<?php

namespace App\Validator;

use App\Entity\ReferralLevel;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class LevelLoyaltyLevelValidator extends ConstraintValidator
{
    private EntityManagerInterface $entityManager;

    /**
     * LevelLoyaltyLevelValidator constructor.
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function validate($classObject, Constraint $constraint)
    {
        /* @var $constraint \App\Validator\LevelLoyaltyLevel */

        if (null === $classObject || '' === $classObject) {
            return;
        }

        $maxPermittedLevel = $this->entityManager->getRepository($this->context->getClassName())
                ->getBiggestDefaultLevel() + 1;

        if($classObject->getLevel() > $maxPermittedLevel) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ value }}', $classObject->getLevel())
                ->atPath('level')
                ->addViolation();
        }
    }
}

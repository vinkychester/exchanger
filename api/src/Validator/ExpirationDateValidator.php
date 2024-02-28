<?php


namespace App\Validator;


use App\Service\CreditCard\CreditCard;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

/**
 * Class ExpirationDateValidator
 * @package App\Validator
 */
class ExpirationDateValidator extends ConstraintValidator
{
    /**
     * @param mixed $value
     * @param Constraint $constraint
     */
    public function validate($value, Constraint $constraint)
    {
        if (!$constraint instanceof ExpirationDate) {
            throw new UnexpectedTypeException($constraint, ExpirationDate::class);
        }

        if (null === $value || '' === $value) {
            return;
        }

        if (!is_string($value)) {
            throw new UnexpectedValueException($value, 'string');
        }

        $info = explode("/", $value);
        $month = $info[0];
        $year = $info[1];

        $month = str_pad($month, 2, '0', STR_PAD_LEFT);

//        if (! preg_match('/^(0[1-9]|1[0-2])$/', $month)) {
//             $this->context->buildViolation($constraint->monthMessage)
//                ->setParameter('{{ string }}', $month)
//                ->addViolation();
//        }

        // past date
//        $validDate = CreditCard::validDate($year, $month); // past date
//        if (!$validDate) {
//            $this->context->buildViolation($constraint->expiryDateMessage)
//                ->setParameter('{{ string }}', $value)
//                ->addViolation();
//        }
    }
}
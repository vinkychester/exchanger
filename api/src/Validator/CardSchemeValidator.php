<?php


namespace App\Validator;


use App\Service\CreditCard\CreditCard;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

/**
 * Class CardSchemeValidator
 * @package App\Validator
 */
class CardSchemeValidator extends ConstraintValidator
{
    /**
     * @param mixed $value
     * @param Constraint $constraint
     */
    public function validate($value, Constraint $constraint)
    {
        if (!$constraint instanceof CardScheme) {
            throw new UnexpectedTypeException($constraint, CardScheme::class);
        }

        if (null === $value || '' === $value) {
            return;
        }

        if (!is_string($value)) {
            throw new UnexpectedValueException($value, 'string');
        }

        $card = CreditCard::validCreditCard($value, [
            CreditCard::TYPE_VISA,
            CreditCard::TYPE_MASTERCARD,
            CreditCard::TYPE_VISA_ELECTRON,
            CreditCard::TYPE_MIR,
            CreditCard::TYPE_MAESTRO,
            CreditCard::TYPE_UNIONPAY
        ]);

        if (!$card["valid"]) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ string }}', $value)
                ->addViolation();
        }
    }
}
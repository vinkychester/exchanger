<?php


namespace App\Validator;


use Symfony\Component\Validator\Constraint;


/**
 * @Annotation
 */
class ExpirationDate extends Constraint
{
    public string $message = 'The string "{{ string }}" contains an illegal character: it can only contain letters or numbers.';
    public string $monthMessage = 'Невалидное значение';
    public string $expiryDateMessage = 'Срок действия карты невалиден';
}
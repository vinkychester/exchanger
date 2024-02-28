<?php


namespace App\Validator;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class UniqueCardUser extends Constraint
{
    public string $message = 'Данная карта уже есть в системе';
}
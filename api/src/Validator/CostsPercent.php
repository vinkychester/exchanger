<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class CostsPercent extends Constraint
{
    public function getTargets()
    {
        return self::CLASS_CONSTRAINT;
    }

    /*
     * Any public properties become valid options for the annotation.
     * Then, use these in your validator class.
     */
    public $message = 'Вводимый процент является недопустимым. Доступный процент - "{{ value }}".';
}

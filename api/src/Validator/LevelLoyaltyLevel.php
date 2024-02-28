<?php

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class LevelLoyaltyLevel extends Constraint
{
    public function getTargets()
    {
        return self::CLASS_CONSTRAINT;
    }

    /*
     * Any public properties become valid options for the annotation.
     * Then, use these in your validator class.
     */
    public $message = 'Уровень {{ value }} больше допустимого. Следующий уровень может быть больше максимального на 1 пункт.';
}

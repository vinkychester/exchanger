<?php


namespace App\Service\BitwiseFilterFactory;

/**
 * Class BitwiseFilterFactory
 * @package App\Service\BitwiseFilterFactory
 */
class BitwiseFilterFactory
{
    public static function sumFlags(string $entityClass, array $flags)
    {
        $total = 0;
        foreach ($flags as $flag => $value) {
            $const = 'FLAG_' . strtoupper($flag);
            if (defined($entityClass . '::' . $const) && $value) {
                $total += constant($entityClass . '::' . $const);
            }
        }

        return $total;
    }
}
<?php

namespace App\Exception;

use Exception;
use Throwable;

/**
 * Class InvalidConfirmationTokenException
 * @package App\Exception
 */
class InvalidConfirmationTokenException extends Exception
{
    /**
     * InvalidConfirmationTokenException constructor.
     * @param string $message
     * @param int $code
     * @param Throwable|null $previous
     */
    public function __construct($message = '', $code = 0, Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}

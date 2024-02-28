<?php


namespace App\Events;


use App\Entity\Requisition;
use App\Entity\RequisitionFeeHistory;
use Symfony\Contracts\EventDispatcher\Event;

/**
 * Class RequisitionCallbackEvent
 * @package App\Events
 */
class RequisitionCallbackEvent extends Event
{
    /**
     * @var Requisition
     */
    private Requisition $requisition;
    private string $callbackDirection;

    /**
     * RequisitionCallbackEvent constructor.
     * @param Requisition $requisition
     * @param string $callbackDirection
     */
    public function __construct(Requisition $requisition, string $callbackDirection)
    {
        $this->requisition = $requisition;
        $this->callbackDirection = $callbackDirection;
    }

    /**
     * @return Requisition
     */
    public function getRequisition(): Requisition
    {
        return $this->requisition;
    }

    /**
     * @return string
     */
    public function getCallbackDirection(): string
    {
        return $this->callbackDirection;
    }
}
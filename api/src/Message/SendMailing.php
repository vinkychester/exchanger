<?php


namespace App\Message;


use App\Entity\Mailing;

/**
 * Class SendMailing
 * @package App\Message
 */
class SendMailing
{

    /**
     * @var Mailing
     */
    protected Mailing $mailing;

    /**
     * SendMailing constructor.
     * @param Mailing $mailing
     */
    public function __construct(Mailing $mailing)
    {
        $this->mailing = $mailing;
    }

    /**
     * @return Mailing
     */
    public function getMailing(): Mailing
    {
        return $this->mailing;
    }

}
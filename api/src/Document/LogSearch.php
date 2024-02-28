<?php


namespace App\Document;

use DateTime;
use Exception;

/**
 * Class LogSearch
 * @package App\Document
 */
class LogSearch
{
    /**
     * @var datetime|null
     */
    protected $to;
    /**
     * @var datetime|null
     */
    protected $from;
    /**
     * @var string|null
     */
    private $email;
    /**
     * @var string|null
     */
    private $role;

    /**
     * @return string|null
     */
    public function getEmail(): ?string
    {
        return $this->email;
    }

    /**
     * @param string|null $email
     */
    public function setEmail(?string $email): void
    {
        $this->email = $email;
    }

    /**
     * @return string|null
     */
    public function getRole(): ?string
    {
        return $this->role;
    }

    /**
     * @param string $role
     */
    public function setRole(string $role): void
    {
        $this->role = $role;
    }

    /**
     * @return DateTime|null
     */
    public function getTo(): ?DateTime
    {
        return $this->to;
    }

    /**
     * @param string|null $to
     * @throws Exception
     */
    public function setTo(?string $to): void
    {
        $this->to = new DateTime($to);
    }

    /**
     * @return DateTime|null
     */
    public function getFrom(): ?DateTime
    {
        return $this->from;
    }

    /**
     * @param string|null $from
     * @throws Exception
     */
    public function setFrom(?string $from): void
    {
        $this->from = new DateTime($from);
    }
}

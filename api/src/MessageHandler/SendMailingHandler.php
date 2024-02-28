<?php


namespace App\MessageHandler;


use App\Message\SendMailing;
use App\Service\Mailing\SendMailingService;
use Symfony\Component\Messenger\Handler\MessageHandlerInterface;

/**
 * Class SendMailingHandler
 * @package App\MessageHandler
 */
class SendMailingHandler implements MessageHandlerInterface
{

    /**
     * @var SendMailingService
     */
    protected SendMailingService $mailingService;

    /**
     * SendMailingHandler constructor.
     * @param SendMailingService $mailingService
     */
    public function __construct(SendMailingService $mailingService)
    {
        $this->mailingService = $mailingService;
    }

    /**
     * @param SendMailing $sendMailing
     */
    public function __invoke(SendMailing $sendMailing)
    {

        $this->mailingService->sending($sendMailing->getMailing());
    }
}
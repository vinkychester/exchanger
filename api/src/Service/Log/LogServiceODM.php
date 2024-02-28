<?php


namespace App\Service\Log;


use App\Document\Log;
use App\Service\UserService\UserRequestService;
use Doctrine\ODM\MongoDB\DocumentManager;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * Class LogServiceODM
 * @package App\Service\Log
 */
class LogServiceODM
{
    /**
     * @var DocumentManager
     */
    protected DocumentManager $documentManager;

    /**
     * @var Request|null
     */
    protected ?Request $request;
    /**
     * @var UserRequestService
     */
    protected UserRequestService $userRequestService;

    /**
     * LogServiceODM constructor.
     * @param DocumentManager $documentManager
     * @param UserRequestService $userRequestService
     */
    public function __construct(DocumentManager $documentManager, UserRequestService $userRequestService)
    {
        $this->documentManager = $documentManager;
        $this->userRequestService = $userRequestService;
    }

    /**
     * @param string|null $message
     * @param object|string $user
     * @throws Exception
     */
    public function info(string $message, $user): void
    {
        $user = $this->adaptUser($user);

        $this->documentManager->persist(
            new Log(
                LogAction::INFO,
                $message,
                $user->getClass(),
                $user->getEmail(),
                $this->userRequestService->getIp()
            )
        );
        $this->documentManager->flush();
    }

    /**
     * @param string|null $message
     * @param object|string $user
     * @throws Exception
     */
    public function warning(?string $message, $user): void
    {
        $user = $this->adaptUser($user);

        $this->documentManager->persist(
            new Log(
                LogAction::WARNING,
                $message,
                $user->getClass(),
                $user->getEmail(),
                $this->userRequestService->getIp()
            )
        );
        $this->documentManager->flush();
    }

    /**
     * @param string|null $message
     * @param object|string $user
     * @throws Exception
     */
    public function error(?string $message, $user): void
    {
        $user = $this->adaptUser($user);

        $this->documentManager->persist(
            new Log(
                LogAction::ERROR,
                $message,
                $user->getClass(),
                $user->getEmail(),
                $this->userRequestService->getIp()
            )
        );
        $this->documentManager->flush();
    }

    /**
     * @param $user
     * @return mixed
     */
    protected function adaptUser($user)
    {
        return new UserObjectAdapter($user);
    }
}

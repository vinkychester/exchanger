<?php


namespace App\Service\Document;


use App\Entity\Client;
use App\Repository\ClientRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use ItlabStudio\ApiClient\Service\ApiClient;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/**
 * Class VerificationService
 * @package App\Service\Document
 */
class VerificationService
{
    /**
     * @var ApiClient
     */
    protected ApiClient $apiClient;
    /**
     * @var UrlGeneratorInterface
     */
    protected UrlGeneratorInterface $router;
    /**
     * @var ClientRepository
     */
    protected ClientRepository $clientRepository;

    /**
     * VerificationService constructor.
     * @param ApiClient $apiClient
     * @param UrlGeneratorInterface $router
     * @param ClientRepository $clientRepository
     */
    public function __construct(
        ApiClient $apiClient,
        UrlGeneratorInterface $router,
        ClientRepository $clientRepository
    ) {
        $this->apiClient = $apiClient;
        $this->router = $router;
        $this->clientRepository = $clientRepository;
    }

    /**
     * @param Client $client
     * @param $flow
     * @return array
     */
    public function verify(Client $client, $flow): array
    {
        $verifyInfo = ['link' => '', 'status' => false];

        if (null !== $client) {
            $response = $this->apiClient->ControlPanel()->Document()->verify(
                [
                    "email"       => $client->getEmail(),
                    "connection"  => $_ENV['CP_DOCUMENT_CONNECTION'],
                    "flow" => $flow,
                    "callBackUrl" => $this->router->generate(
                        'applicantReviwed',
                        [],
                        UrlGeneratorInterface::ABSOLUTE_URL
                    ),
                ]
            )->getData()->first();

            $verifyInfo['link'] = $response->getFlowData()['link'];
            if ($response->getStatus() == 'APPROVE') {
                $verifyInfo['status'] = true;
            } else {
                $verifyInfo['status'] = false;
            }

        }

        return $verifyInfo;
    }
}

<?php


namespace App\Controller;

use App\Events\VerifyDocumentEvent;
use App\Repository\ClientRepository;
use App\Service\Log\LogServiceODM;
use Exception;
use ItlabStudio\ApiClient\Service\EncryptionManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\PublisherInterface;
use Symfony\Component\Mercure\Update;
use RuntimeException;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class VerifyDocumentCallbackController
 * @package App\Controller
 */
class VerifyDocumentCallbackController extends AbstractController
{
    /**
     * @var ClientRepository
     */
    protected ClientRepository $clientRepository;
    /**
     * @var EventDispatcherInterface
     */
    protected EventDispatcherInterface $eventDispatcher;
    /**
     * @var LogServiceODM
     */
    protected LogServiceODM $LogServiceODM;

    /**
     * VerifyDocumentCallbackController constructor.
     * @param ClientRepository $clientRepository
     * @param EventDispatcherInterface $eventDispatcher
     * @param LogServiceODM $LogServiceODM
     */
    public function __construct(
        ClientRepository $clientRepository,
        EventDispatcherInterface $eventDispatcher,
        LogServiceODM $LogServiceODM

    ) {
        $this->clientRepository = $clientRepository;
        $this->eventDispatcher = $eventDispatcher;
        $this->LogServiceODM = $LogServiceODM;
    }

    /**
     * @Route("/applicant-reviwed", name="applicantReviwed", methods={"POST"})
     * @param Request $request
     * @param PublisherInterface $publisher
     * @return JsonResponse
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     * @throws \JsonException
     */
    public function verifyDocumentCallback(Request $request, PublisherInterface $publisher)
    {
        $response = json_decode($request->getContent(), true);

        file_get_contents(
            "https://api.telegram.org/bot1132760191:AAHk2HgyE-aJxaTvXzGASSDNPzFkTGoGYYo/sendMessage?chat_id=-1001479842731&parse_mode=html&text="
            . json_encode($response, JSON_THROW_ON_ERROR)
        );

        if (!EncryptionManager::checkSignature($response['data'], $response['signature'], $_ENV['PROJECT_SECRET'])) {
            $this->LogServiceODM->error(
                'Coin24.com.ua Attempt to intercept callback on document verification',
                'applicantId' . $response['data']['applicantId']
            );
            file_get_contents(
                "https://api.telegram.org/bot1132760191:AAHk2HgyE-aJxaTvXzGASSDNPzFkTGoGYYo/sendMessage?chat_id=-1001479842731&parse_mode=html&text=" .
                'Coin24.com.ua Attempt to intercept callback on document verification'
            );
            throw new RuntimeException('Forbidden', 403);
        }

        $client = $this->clientRepository->findOneBy(['email' => $response['data']['email']]);

        if ($client && !$client->getIsVerified()) {
            $client->setIsVerified($response['data']['status'] === 'APPROVE');
            $this->clientRepository->save($client);

            $this->LogServiceODM->info(
                'Documents have been successfully verified',
                $client
            );

            //SEND_EMAIL
            $objectEvent = new VerifyDocumentEvent($client);
            $this->eventDispatcher->dispatch($objectEvent);

            //MERCURE
            try {
                $update = new Update(
                    'http://coin24/applicant-reviwed',
                    json_encode(['status' => Response::HTTP_OK], JSON_THROW_ON_ERROR)
                );
                $publisher($update);
            } catch (Exception $exception) {
                return new JsonResponse();
            }
        }

        return new JsonResponse();
    }
}

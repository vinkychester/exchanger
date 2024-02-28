<?php


namespace App\Resolver;


use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;
use App\Entity\ClientVerificationSchema;
use App\Service\Document\VerificationService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Security;

class SetVerificationFlowResolver implements QueryCollectionResolverInterface
{

    /**
     * @var VerificationService
     */
    protected VerificationService $verificationService;
    /**
     * @var Security
     */
    protected Security $security;
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;

    public function __construct(
        VerificationService $verificationService,
        Security $security,
        EntityManagerInterface $entityManager
    ) {
        $this->verificationService = $verificationService;
        $this->security = $security;
        $this->entityManager = $entityManager;
    }

    /**
     * @param iterable $collection
     * @param array $context
     * @return iterable
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function __invoke(iterable $collection, array $context): iterable
    {
        $client = $this->security->getUser();

        foreach ($collection as $verificationSchema) {
            $clientVerificationSchema = $this->entityManager->getRepository(ClientVerificationSchema::class)->findOneBy(
                [
                    'verificationSchema' => $verificationSchema,
                    'client'             => $client
                ]
            );
            $response = $this->verificationService->verify($client, $verificationSchema->getName());
            if ($clientVerificationSchema) {
                $clientVerificationSchema->setVerificationInfo($response);
            } else {
                $clientVerificationSchemaNew = new ClientVerificationSchema();
                $clientVerificationSchemaNew->setVerificationSchema($verificationSchema);
                $clientVerificationSchemaNew->setClient($client);
                $clientVerificationSchemaNew->setVerificationInfo($response);
                $this->entityManager->persist($clientVerificationSchemaNew);
                $this->entityManager->flush();
            }
        }

        return $collection;
    }

}
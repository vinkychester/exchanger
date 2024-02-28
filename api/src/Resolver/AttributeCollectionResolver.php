<?php


namespace App\Resolver;


use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;
use App\Entity\Attribute;
use App\Entity\PairUnit;
use Doctrine\ORM\EntityManagerInterface;
use ItlabStudio\ApiClient\Service\ApiClient;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * Class AttributePrerequestCollectionResolver
 * @package App\Resolver
 */
class AttributeCollectionResolver implements QueryCollectionResolverInterface
{
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;
    /**
     * @var ApiClient
     */
    private ApiClient $apiClient;
    /**
     * @var SessionInterface
     */
    private SessionInterface $session;

    /**
     * AttributePrerequestCollectionResolver constructor.
     * @param EntityManagerInterface $entityManager
     * @param ApiClient $apiClient
     * @param SessionInterface $session
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        ApiClient $apiClient,
        SessionInterface $session
    ) {
        $this->entityManager = $entityManager;
        $this->apiClient = $apiClient;
        $this->session = $session;
    }

    /**
     * @param iterable<Attribute> $collection
     *
     * @return iterable<Attribute>
     */
    public function __invoke(iterable $collection, array $context): iterable
    {
        $collection = [];
        $args = $context['args'];
        $direction = $args['direction'];
        $locale = $args['locale'];

        /** @var PairUnit $pairUnit */
        $pairUnit = $this->entityManager->getRepository(PairUnit::class)->find($args['pairUnit_id']);

        $class = ucfirst($direction);
        $attributePrerequestContent = $this->apiClient->ControlPanel()->$class()->attributePrerequest([
            "paymentSystem" => $pairUnit->getPaymentSystem()->getSubName(),
            "currency"      => $pairUnit->getCurrency()->getAsset(),
            "connection"    => $pairUnit->getService()->getConnection(),
            "locale"        => $locale
        ])->getData()->toArray();

        if (!empty($attributePrerequestContent)) {
            $session = $this->session;
            array_walk($attributePrerequestContent, static function ($value) use ($direction, &$collection, $session) {
                $attributePrerequest = new Attribute();
                $attributePrerequest->setName($value->getName());
                $attributePrerequest->setRegex($value->getRegex());
                $attributePrerequest->setFieldType($value->getFieldType());
                $attributePrerequest->setTitle($value->getTitle());
                $attributePrerequest->setDirection($direction);
                $collection[] = $attributePrerequest;

                //if(null === $session->get($value->getName())) {
                $session->set($value->getName(), $value->getRegex());
                //}

            });
        }

        return $collection;
    }
}

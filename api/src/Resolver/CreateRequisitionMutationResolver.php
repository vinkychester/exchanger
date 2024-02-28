<?php


namespace App\Resolver;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\Attribute;
use App\Entity\Client;
use App\Entity\Currency;
use App\Entity\Manager;
use App\Entity\Pair;
use App\Entity\Requisition;
use App\Entity\RequisitionFeeHistory;
use App\Repository\AttributeRepository;
use App\Service\BankDetailBuilder\BankDetailBuilder;
use App\Service\RequisitionFeeHistoryBuilder\RequisitionFeeHistoryHistoryBuilder;
use Calculation\Service\Course;
use Calculation\Service\Exchange;
use Calculation\Service\Limits;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

/**
 * Class CreateRequisitionMutationResolver
 * @package App\Resolver
 */
class CreateRequisitionMutationResolver implements MutationResolverInterface
{

    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;
    /**
     * @var DenormalizerInterface
     */
    private DenormalizerInterface $denormalizer;
    /**
     * @var SessionInterface
     */
    private SessionInterface $session;

    /**
     * CreateRequisitionMutationResolver constructor.
     * @param EntityManagerInterface $entityManager
     * @param DenormalizerInterface $denormalizer
     * @param SessionInterface $session
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        DenormalizerInterface $denormalizer,
        SessionInterface $session
    )
    {
        $this->entityManager = $entityManager;
        $this->denormalizer = $denormalizer;
        $this->session = $session;
    }

    public function findManager(array $attributes)
    {
        $key = array_search("cityId", array_column($attributes, 'name'));
        $externalId = $attributes[$key]['value'];
        return $this->entityManager->getRepository(Manager::class)->findManagerByExternalId($externalId);
    }

    /**
     * @param Requisition|null $item
     *
     * @return Requisition
     * @throws Exception
     */
    public function __invoke($item, array $context): ?Requisition
    {
        $args = $context['args']['input'];

        $paymentAttributes = $args['paymentAttributes'];
        $payoutAttributes = $args['payoutAttributes'];

        $errors = [];

        if (!$paymentAttributes && !$payoutAttributes) {
            $errors["attributes"] = "Реквизиты должны быть заполнены! В случае если нет данных для заполнения - перегрузите страницу или проверьте подключение к Интернету";
        }

        Limits::calculateMin($item->getPair());
        Limits::calculateMax($item->getPair());
        $min = $item->getPair()->getPayment()->getMin();
        $max = $item->getPair()->getPayment()->getMax();

        if ($item->getPaymentAmount() < $min) {
            $errors["min"] = "Невозможно создать заявку меньше минимальной заявленной суммы";
        }

        if ($item->getPaymentAmount() > $max) {
            $errors["max"] = "Невозможно создать заявку больше максимальной заявленной суммы";
        }

        if (count($errors)) {
            throw new \RuntimeException(json_encode($errors), Response::HTTP_NOT_ACCEPTABLE);
        }

        $savePaymentBankDetails = $args['savePaymentBankDetails'];
        $savePayoutBankDetails = $args['savePayoutBankDetails'];

        /** @var Client $client */
        $client = $this->entityManager->getRepository(Client::class)->find($args['client_id']);
        $item->setClient($client);

        // SET RECALCULATED AMOUNT INITIAL
        $item->setRecalculatedAmount($item->getPayoutAmount());
        // SET INITIAL COMMISSION
        $item->setCommission(Course::calculateLastFee($item->getPair(), $item->getPair()->getPercent()));
        // SET INITIAL PERCENT
        $item->setPairPercent($item->getPair()->getPercent());
        // SET INITIAL COURSE
        if ($item->getPair()->getPayment()->getCurrency()->getTag() === Currency::TYPE_CURRENCY) {
            $item->setCourse(1 / Course::calculate($item->getPair()));
        } else {
            $item->setCourse(Course::calculate($item->getPair()));
        }
//        $item->setCourse(Exchange::calculation("payout")->calculateRates($item->getPair()));

        if (!empty($paymentAttributes)) {
            (new BankDetailBuilder($this->entityManager))
                ->setBankDetail($item, $item->getPair()->getPayment(), $paymentAttributes, Pair::PAYMENT, $savePaymentBankDetails)
                ->storeBankDetail();
        }

        if (!empty($payoutAttributes)) {
            (new BankDetailBuilder($this->entityManager))
                ->setBankDetail($item, $item->getPair()->getPayout(), $payoutAttributes, Pair::PAYOUT, $savePayoutBankDetails)
                ->storeBankDetail();
        }

        (new RequisitionFeeHistoryHistoryBuilder($this->entityManager))
            ->setFee($item, $item->getPair()->getPayment())
            ->storeItem();

        (new RequisitionFeeHistoryHistoryBuilder($this->entityManager))
            ->setFee($item, $item->getPair()->getPayout())
            ->storeItem();

        return $item;
    }
}
<?php


namespace App\Service\BankDetailBuilder;


use App\Entity\Attribute;
use App\Entity\BankDetail;
use App\Entity\Requisition;
use App\Service\Validation\AttributeValidationSingleton;
use Calculation\Utils\Exchange\PairUnitInterface;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class BankDetailBuilder
 * @package App\Service\BankDetailBuilder
 */
class BankDetailBuilder implements BankDetailBuilderInterface
{
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    /**
     * BankDetailBuilder constructor.
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @param Requisition $requisition
     * @param PairUnitInterface $pairUnit
     * @param array $attributes
     * @param string $direction
     * @param bool $isSaveDetails
     * @return $this
     * @throws Exception
     */
    public function setBankDetail(
        Requisition $requisition,
        PairUnitInterface $pairUnit,
        array $attributes,
        string $direction,
        bool $isSaveDetails
    ): BankDetailBuilder
    {
        $bankDetailId = null;
        $em = $this->entityManager;

        $pairUnitItem = ucfirst($direction);
        $getPairUnit = "get{$pairUnitItem}";

        array_walk($attributes, static function ($value) use (&$bankDetailId, $em, $direction, $pairUnit, $requisition) {
            $attributeItem = $em->getRepository(Attribute::class)->findAttribute(
                $pairUnit,
                $requisition->getClient(),
                $value,
                $direction
            );

            if (null !== $attributeItem) {
                $bankDetailId = $attributeItem->getBankDetail()->getId();
            } else {
                $bankDetailId = null;
            }
        });

        /** @var BankDetail $bankDetail */
        $bankDetail = null;

        if (null !== $bankDetailId) {
            $bankDetail = $this->entityManager->getRepository(BankDetail::class)->find($bankDetailId);
        }

        if (null === $bankDetail) {
            $bankDetail = new BankDetail();
            $bankDetail
                ->setDirection($direction)
                ->setPairUnit($pairUnit)
                ->setTitle($pairUnit->getPaymentSystem()->getName() . " " . $pairUnit->getCurrency()->getAsset() . " (" . bin2hex(random_bytes(3)) . ")")
                ->addRequisition($requisition);
            if ($isSaveDetails) {
                $bankDetail->setClient($requisition->getClient());
            }

            $em = $this->entityManager;
            $errors = [];
            array_walk($attributes, static function ($value) use ($bankDetail, $requisition, $getPairUnit, $em, &$errors) {
                $name = ucfirst($value['name']);
                $method = "validate{$name}";
                if (method_exists(AttributeValidationSingleton::class, $method)) {
                    // validation attributes service
                    AttributeValidationSingleton::getInstance()->$method($value['value'], $errors);
                }

                if ($value['name'] === "wallet" && $bankDetail->getClient()) {
                    $bankAttributeDetails = $em->getRepository(BankDetail::class)->findClientAttributeByName(
                        $bankDetail->getClient(), $value['name'], $value['value']
                    );

                    if ($bankAttributeDetails) {
                        $errors[$value['name']] = "Такой кошелек уже хранится в личном кабинете";
                    }
                }

                if ($requisition->getPair()->$getPairUnit()->getPaymentSystem()->getSubName() == 'CASH' && "cityId" === $value['name']) {
                    if (empty($value['value'])) {
                        $errors[$value['name']] = "Выберите город";
                    }
                }

                $attribute = new Attribute();
                $attribute
                    ->setName($value['name'])
                    ->setValue($value['value'])
                    ->setIsHidden($value['isHidden'])
                    ->setRegex($value['regex'])
                    ->setInformation($value['information'])
                    ->setBankDetail($bankDetail);

                if ($requisition->getPair()->$getPairUnit()->getPaymentSystem()->getSubName() == 'CASH' && $value['name'] === "referenceId") {
                    $attribute->setValue(explode("-", $requisition->getId())[0]);
                }
                $em->persist($attribute);
            });

            if (count($errors)) {
                throw new \RuntimeException(json_encode($errors), Response::HTTP_NOT_ACCEPTABLE);
            }

            $em->persist($bankDetail);
        } else {
            $bankDetail->addRequisition($requisition);
            $this->entityManager->persist($bankDetail);
        }

        return $this;
    }

    /**
     * @return $this
     */
    public function storeBankDetail(): BankDetailBuilder
    {
        $this->entityManager->flush();

        return $this;
    }
}
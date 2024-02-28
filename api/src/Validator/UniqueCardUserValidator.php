<?php


namespace App\Validator;


use App\Entity\CreditCard;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

/**
 * Class UniqueCardUserValidator
 * @package App\Validator
 */
class UniqueCardUserValidator extends ConstraintValidator
{
    /**
     * @var TokenStorageInterface
     */
    private TokenStorageInterface $storage;
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    /**
     * UniqueCardUserValidator constructor.
     * @param TokenStorageInterface $storage
     * @param EntityManagerInterface $entityManager
     */
    public function __construct(TokenStorageInterface $storage, EntityManagerInterface $entityManager)
    {
        $this->storage = $storage;
        $this->entityManager = $entityManager;
    }

    /**
     * @param mixed $value
     * @param Constraint $constraint
     */
    public function validate($value, Constraint $constraint)
    {
        if (!$constraint instanceof UniqueCardUser) {
            throw new UnexpectedTypeException($constraint, UniqueCardUser::class);
        }

        $creditCards = $this->entityManager->getRepository(CreditCard::class)->findBy([
            'cardNumber' => $value
        ]);

        $storage =  $this->storage;
        $context = $this->context;

        if ($creditCards) {
            array_walk($creditCards, static function ($card) use ($constraint, $storage, $context) {
                if ($card->getStatus() !== CreditCard::CANCELED && $card->getClient() !== $storage->getToken()->getUser()) {
                    $context->buildViolation($constraint->message)
                        ->addViolation();
                }
            });
        }
    }
}
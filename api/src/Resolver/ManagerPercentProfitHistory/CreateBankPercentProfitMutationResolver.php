<?php


namespace App\Resolver\ManagerPercentProfitHistory;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use App\Entity\ManagerPercentProfitHistory;
use App\Repository\ManagerPercentProfitHistoryRepository;
use App\Repository\ManagerRepository;
use App\Service\SystemCosts\SystemCostsCalculation;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;

class CreateBankPercentProfitMutationResolver implements MutationResolverInterface
{
    /**
     * @var ManagerPercentProfitHistoryRepository
     */
    protected ManagerPercentProfitHistoryRepository $managerPercentProfitHistoryRepository;
    /**
     * @var ManagerRepository
     */
    protected ManagerRepository $managerRepository;
    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var SystemCostsCalculation
     */
    protected SystemCostsCalculation $systemCostsCalculation;

    /**
     * CreateBankPercentMutationProfit constructor.
     * @param ManagerPercentProfitHistoryRepository $managerPercentProfitHistoryRepository
     * @param ManagerRepository $managerRepository
     * @param EntityManagerInterface $entityManager
     * @param SystemCostsCalculation $systemCostsCalculation
     */
    public function __construct(
        ManagerPercentProfitHistoryRepository $managerPercentProfitHistoryRepository,
        ManagerRepository $managerRepository,
        EntityManagerInterface $entityManager,
        SystemCostsCalculation $systemCostsCalculation
    ) {
        $this->managerPercentProfitHistoryRepository = $managerPercentProfitHistoryRepository;
        $this->managerRepository = $managerRepository;
        $this->entityManager = $entityManager;

        $this->systemCostsCalculation = $systemCostsCalculation;
    }

    /**
     * @param object|null $item
     * @param array $context
     * @return null
     */
    public function __invoke($item, array $context)
    {
        $args = $context['args']['input'];
        $percent = $args['percent'];
        $errors = [];

        if ($percent < 0) {
            $errors['percent'] = "Процент не может быть меньше 0. ";
        }

        if ($percent > 75) {
            $errors['percent'] = "Процент не может быть больше 75. ";
        }

        $managers = $this->managerRepository->findAll();

        if (isset($managers[0])) {
            $manager = $managers[0];
            $cashbackCostsPercent = $this->systemCostsCalculation->calculateCashbackCostsPercent();
            $referralCostsPercent = $this->systemCostsCalculation->calculateReferralCostsPercent();
            $managerCostsPercent = $this->systemCostsCalculation->calculateManagerCostsPercent();

            $percentWithoutNewValue = $cashbackCostsPercent + $referralCostsPercent + $managerCostsPercent;

            $managerPercentProfitHistory = $this->managerPercentProfitHistoryRepository->createManagerPercentProfitHistory(
                $manager,
                $percent,
                ManagerPercentProfitHistory::NAME_BANK
            );

            $biggestManagerPercent = $managerCostsPercent > $managerPercentProfitHistory->getPercent()
                ? $managerCostsPercent
                : $managerPercentProfitHistory->getPercent();

            $percentWithNewValue = $cashbackCostsPercent + $referralCostsPercent + $biggestManagerPercent;

            if ($percentWithNewValue > 95) {
                $availablePercent = 95 - $percentWithoutNewValue;
                if (array_key_exists('percent', $errors)) {
                    $errors['percent'] .= "Вводимый процент является недопустимым. Доступный процент - $availablePercent.";
                } else {
                    $errors['percent'] = "Вводимый процент является недопустимым. Доступный процент - $availablePercent.";
                }
            }
        } else {
            $errors['managers'] = "Менеджеры не найдены";
        }

        if (count($errors)) {
            throw new \RuntimeException(json_encode($errors, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE), Response::HTTP_NOT_ACCEPTABLE);
        }

        foreach ($managers as $manager) {
            $managerPercentProfitHistory = $this->managerPercentProfitHistoryRepository->createManagerPercentProfitHistory(
                $manager,
                $percent,
                ManagerPercentProfitHistory::NAME_BANK
            );

            $this->entityManager->persist($managerPercentProfitHistory);
        }

        $this->entityManager->flush();

        return null;
    }
}
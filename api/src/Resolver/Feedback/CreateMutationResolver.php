<?php


namespace App\Resolver\Feedback;


use ApiPlatform\Core\Exception\RuntimeException;
use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use ApiPlatform\Core\Validator\ValidatorInterface;
use App\Entity\FeedbackDetail;
use App\Entity\FeedbackMessage;
use App\Service\FeedbackMessage\CheckCaptcha;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Class CreateMutationResolver
 * @package App\Resolver\Feedback
 */
class CreateMutationResolver implements MutationResolverInterface
{

    /**
     * @var EntityManagerInterface
     */
    protected EntityManagerInterface $entityManager;
    /**
     * @var ValidatorInterface
     */
    protected ValidatorInterface $validator;
    /**
     * @var CheckCaptcha
     */
    protected CheckCaptcha $captcha;

    /**
     * CreateMutationResolver constructor.
     * @param EntityManagerInterface $entityManager
     * @param ValidatorInterface $validator
     * @param CheckCaptcha $captcha
     */
    public function __construct(
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        CheckCaptcha $captcha
    ) {
        $this->entityManager = $entityManager;
        $this->validator = $validator;
        $this->captcha = $captcha;
    }

    /**
     * @param object|null $item
     * @param array $context
     * @return null
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function __invoke($item, array $context)
    {
        $captchaToken = $context['args']['input']['captchaToken'];
        if (!$this->captcha->checkCaptcha($captchaToken)) {
            throw new RuntimeException('Сообщение не отправлено, от вас исходит подозрительная активность!', 400);
        }
        if ($item->getType() === FeedbackMessage::CASH) {
            $citySearch = $item->getCity()->getExternalId();
            $feedbackMessage = $this->entityManager->getRepository(FeedbackMessage::class)
                ->findOneBy(
                    [
                        'type'       => FeedbackMessage::CASH,
                        'email'      => $item->getEmail(),
                        'city'       => $item->getCity(),
                        'citySearch' => $citySearch,
                        'deleted'    => false,
                    ]
                );
        } else {
            $citySearch = FeedbackMessage::BANK;
            $feedbackMessage = $this->entityManager->getRepository(FeedbackMessage::class)
                ->findOneBy(
                    [
                        'type'       => FeedbackMessage::BANK,
                        'email'      => $item->getEmail(),
                        'citySearch' => $citySearch,
                        'deleted'    => false
                    ]
                );
        }


        if ($feedbackMessage) {
            $feedbackMessage->setStatus(FeedbackMessage::NOT_VIEWED);
            $this->entityManager->persist($feedbackMessage);
            $feedbackDetail = new FeedbackDetail();
            $feedbackDetail->setFeedbackMessage($feedbackMessage);
            $feedbackDetail->setMessage($item->getMessage());
            $feedbackDetail->setAuthor(FeedbackDetail::Client);
            $this->validator->validate($feedbackDetail, $context);
            $this->entityManager->persist($feedbackDetail);
        } else {
            $item->setCitySearch($citySearch);
            $this->validator->validate($item, $context);
            $this->entityManager->persist($item);
        }

        $this->entityManager->flush();

        return null;
    }
}

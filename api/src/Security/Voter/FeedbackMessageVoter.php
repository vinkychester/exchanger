<?php


namespace App\Security\Voter;


use App\Entity\FeedbackMessage;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\User\UserInterface;

class FeedbackMessageVoter extends Voter
{

    /**
     * @var Security
     */
    protected Security $security;

    /**
     * FeedbackMessageVoter constructor.
     * @param Security $security
     */
    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    /**
     * @param string $attribute
     * @param mixed $subject
     * @return bool
     */
    protected function supports(string $attribute, $subject)
    {
        $supportsAttribute = in_array($attribute, ['FEEDBACK_MESSAGE_ITEM']);
        $supportsSubject = $subject instanceof FeedbackMessage;
        
        return $supportsAttribute && $supportsSubject;
    }

    /**
     * @param string $attribute
     * @param mixed $subject
     * @param TokenInterface $token
     * @return bool
     */
    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token)
    {
        $user = $token->getUser();

        if (!$user instanceof UserInterface) {
            return false;
        }

        /** @var FeedbackMessage $subject */

        switch ($attribute) {
            case 'FEEDBACK_MESSAGE_ITEM':
                if ($this->security->isGranted('ROLE_ADMIN')) {
                    return true;
                }
                if ($this->security->isGranted('ROLE_MANAGER')) {
                    if ($subject->getType() === FeedbackMessage::CASH && in_array($subject->getCity(), $user->getCities()->toArray(), true)) {
                        return true;
                    }
                    if ($subject->getType() === FeedbackMessage::BANK && $user->getIsBank()) {
                        return true;
                    }
                }
                break;
        }

        return false;
    }
}
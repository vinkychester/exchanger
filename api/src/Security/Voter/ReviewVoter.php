<?php


namespace App\Security\Voter;


use App\Entity\Review;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\User\UserInterface;

class ReviewVoter extends Voter
{
    private ?Security $security = null;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    protected function supports(string $attribute, $subject): bool
    {
        $supportsAttribute = in_array($attribute, ['REVIEW_CREATE', 'REVIEW_READ', 'REVIEW_EDIT', 'REVIEW_DELETE']);
        $supportsSubject = $subject instanceof Review;

        return $supportsAttribute && $supportsSubject;
    }

    /**
     * @param string $attribute
     * @param mixed $subject
     * @param TokenInterface $token
     * @return bool
     * @throws \Exception
     */
    protected function voteOnAttribute(string $attribute, $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        if (!$user instanceof UserInterface) {
            return false;
        }

        /** @var Review $subject */

        switch ($attribute) {
            case 'REVIEW_CREATE':
                if ($this->security->isGranted('ROLE_CLIENT')) {
                    return true;
                }  // only admins can create books
                break;
            case 'BOOK_READ':
                /** ... other autorization rules ... **/
        }

        throw new \RuntimeException(sprintf('Unhandled attribute "%s"', $attribute));
//        return false;
    }
}
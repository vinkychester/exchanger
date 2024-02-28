<?php


namespace App\Security\Voter;


use App\Entity\Requisition;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\User\UserInterface;

class RequisitionVoter extends Voter
{
    private ?Security $security = null;

    /**
     * RequisitionVoter constructor.
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
        $supportsAttribute = in_array($attribute, ['REQUISITION_CREATE', 'REQUISITION_DETAILS_READ', 'REQUISITION_UPDATE']);
        $supportsSubject = $subject instanceof Requisition;

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
        /** @var User $user */
        $user = $token->getUser();

        if (!$user instanceof UserInterface) {
            return false;
        }

        /** @var Requisition $subject */

        switch ($attribute) {
            case 'REQUISITION_UPDATE':
            case 'REQUISITION_CREATE':
                if ($this->security->isGranted(User::CLIENT)) {
                    return true;
                }  // only client can create requisitions
                break;
            case 'REQUISITION_DETAILS_READ':
                if ($this->security->isGranted(User::ADMIN)) {
                    return true;
                }

                if ($this->security->isGranted(User::MANAGER) && $subject->getManager() === $user) {
                    return true;
                }

                if ($this->security->isGranted(User::CLIENT) && $subject->getClient() === $user) {
                    return true;
                }
                break;
            /** ... other autorization rules ... **/
        }

        throw new \RuntimeException(sprintf('Unhandled attribute "%s"', $attribute));
//        return false;
    }
}
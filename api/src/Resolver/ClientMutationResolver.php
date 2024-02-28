<?php


namespace App\Resolver;


use ApiPlatform\Core\GraphQl\Resolver\MutationResolverInterface;
use Hackzilla\PasswordGenerator\Generator\ComputerPasswordGenerator;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class ClientMutationResolver implements MutationResolverInterface
{
    /**
     * @var UserPasswordEncoderInterface
     */
    private UserPasswordEncoderInterface $passwordEncoder;
    /**
     * @var ComputerPasswordGenerator
     */
    private ComputerPasswordGenerator $generator;

    /**
     * ClientMutationResolver constructor.
     * @param UserPasswordEncoderInterface $passwordEncoder
     */
    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
        $this->generator = new ComputerPasswordGenerator();
        $this->generator->setLength(16);
    }

    /**
     * @param object|null $item
     * @param array $context
     * @return object|null
     */
    public function __invoke($item, array $context)
    {
        dd($item);

        return $item;
    }
}
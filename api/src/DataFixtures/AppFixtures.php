<?php

namespace App\DataFixtures;

use App\Entity\Client;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Generator;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    public const OBJECT_COUNT = 10;
    public const PASSWORD = 'admin';

    /**
     * @var Generator
     */
    private Generator $faker;
    /**
     * @var UserPasswordEncoderInterface
     */
    private UserPasswordEncoderInterface $encoder;

    public function __construct(
        UserPasswordEncoderInterface $encoder
    )
    {
        $this->faker = \Faker\Factory::create();
        $this->encoder = $encoder;
    }

    /**
     * @param ObjectManager $manager
     */
    public function load(ObjectManager $manager): void
    {
        $this->loadClients($manager);
    }

    /**
     * @param ObjectManager $manager
     */
    public function loadClients(ObjectManager $manager): void
    {
        for ($i = 0; $i < self::OBJECT_COUNT; $i++) {
            $client = new Client();
            $client->setFirstname($this->faker->firstName)
                ->setLastname($this->faker->lastName)
                ->setEmail($this->faker->email)
                ->setPassword($this->encoder->encodePassword($client, self::PASSWORD))
                ->setStatus($this->faker->randomElement(['OK', 'DANGER']));

            $manager->persist($client);
        }

        $manager->flush();
    }
}

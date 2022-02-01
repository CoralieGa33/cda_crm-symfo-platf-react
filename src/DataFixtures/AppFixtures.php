<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    /**
     * Password hasher
     *
     * @var UserPasswordHasherInterface
     */
    private $hasher;

    public function __construct(UserPasswordHasherInterface $hasher) {
        $this->hasher = $hasher;
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create("fr_FR");

        
        for($u = 0; $u < 10; $u++) {
            $user = new User();
            $hash = $this->hasher->hashPassword($user, "password");
            $reference = 1;

            $user
            ->setEmail($faker->email)
            ->setPassword($hash)
                ->setFirstName($faker->firstName)
                ->setLastName($faker->lastName);

            $manager->persist($user);

            for($c = 0; $c < mt_rand(5, 20); $c++) {
                $customer = new Customer();
                $customer
                    ->setFirstName($faker->firstName)
                    ->setLastName($faker->lastName)
                    ->setCompany($faker->company)
                    ->setEmail($faker->email)
                    ->setUser($user);
    
                $manager->persist($customer);

                for($i = 0; $i < mt_rand(3, 10); $i++) {
                    $invoice = new Invoice();
                    $invoice
                        ->setAmount($faker->randomFloat(2, 250, 5000))
                        ->setSentAt($faker->dateTimeBetween('-6 months'))
                        ->setStatus($faker->randomElement(['SENT', 'PAID', 'CANCELLED']))
                        ->setCustomer($customer)
                        ->setReference($reference);

                    $reference++;

                    $manager->persist($invoice);
                }
            }
        }

        $manager->flush();
    }
}

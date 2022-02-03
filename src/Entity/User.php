<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ApiResource(
    collectionOperations: [
        'get' => ['path' => '/utilisateurs'],
        'post' => ['path' => '/utilisateurs']
    ],
    itemOperations: [
        'get' => ['path' => '/utilisateurs/{id}'],
        'patch' => ['path' => '/utilisateurs/{id}'],
        'delete' => ['path' => '/utilisateurs/{id}']
    ],
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups("invoices_read", "invoices_subresource")]
    private $id;

    #[ORM\Column(type: 'string', length: 180, unique: true)]
    #[Groups(["invoices_read", "invoices_subresource"])]
    private $email;

    #[ORM\Column(type: 'json')]
    private $roles = [];

    #[ORM\Column(type: 'string')]
    private $password;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(["invoices_read", "invoices_subresource"])]
    private $firstName;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(["invoices_read", "invoices_subresource"])]
    private $lastName;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $company;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $streetAddress;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $postcode;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $city;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $phoneNumber;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Customer::class)]
    private $customers;

    public function __construct()
    {
        $this->customers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getCompany(): ?string
    {
        return $this->company;
    }
    
    public function setCompany(?string $company): self
    {
        $this->company = $company;
        
        return $this;
    }
    
    public function getStreetAddress(): ?string
    {
        return $this->streetAddress;
    }
    
    public function setStreetAddress(?string $streetAddress): self
    {
        $this->streetAddress = $streetAddress;
        
        return $this;
    }
    
    public function getPostcode(): ?string
    {
        return $this->postcode;
    }
    
    public function setPostcode(?string $postcode): self
    {
        $this->postcode = $postcode;
        
        return $this;
    }
    
    public function getCity(): ?string
    {
        return $this->city;
    }
    
    public function setCity(?string $city): self
    {
        $this->city = $city;
        
        return $this;
    }
    
    public function getPhoneNumber(): ?string
    {
        return $this->phoneNumber;
    }
    
    public function setPhoneNumber(?string $phoneNumber): self
    {
        $this->phoneNumber = $phoneNumber;
        
        return $this;
    }

    /**
     * @return Collection|Customer[]
     */
    public function getCustomers(): Collection
    {
        return $this->customers;
    }

    public function addCustomer(Customer $customer): self
    {
        if (!$this->customers->contains($customer)) {
            $this->customers[] = $customer;
            $customer->setUser($this);
        }

        return $this;
    }

    public function removeCustomer(Customer $customer): self
    {
        if ($this->customers->removeElement($customer)) {
            // set the owning side to null (unless already changed)
            if ($customer->getUser() === $this) {
                $customer->setUser(null);
            }
        }

        return $this;
    }
}

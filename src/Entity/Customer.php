<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\CustomerRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: CustomerRepository::class)]
#[ApiResource(
    collectionOperations: [
        'get' => ['path' => '/clients'],
        'post' => ['path' => '/clients']
    ],
    itemOperations: [
        'get' => ['path' => '/clients/{id}'],
        'patch' => ['path' => '/clients/{id}'],
        'delete' => ['path' => '/clients/{id}']
    ],
    subresourceOperations: [
        'invoices_get_subresource' => [
            'path' => '/clients/{id}/factures',
        ],
    ],
    normalizationContext: ['groups' => ['customers_read']]
)]
#[ApiFilter(SearchFilter::class, properties: ["firstName" => 'partial', "lastName" => 'partial', "company" => 'partial'])]
#[ApiFilter(OrderFilter::class)]
class Customer
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(["customers_read", "invoices_read"])]
    private $id;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(["customers_read", "invoices_read"])]
    #[Assert\NotBlank(message: "Le prénom du client est obligatoire.")]
    #[Assert\Length(
        min: 2,
        max: 100,
        minMessage: 'Le prénom doit faire au moins {{ limit }} charactères.',
        maxMessage: 'Le prénom doit faire moins de {{ limit }} charactères.',
    )]
    private $firstName;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(["customers_read", "invoices_read"])]
    #[Assert\NotBlank(message: "Le nom du client est obligatoire.")]
    #[Assert\Length(
        min: 2,
        max: 100,
        minMessage: 'Le nom doit faire au moins {{ limit }} charactères.',
        maxMessage: 'Le nom doit faire moins de {{ limit }} charactères.',
    )]
    private $lastName;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(["customers_read", "invoices_read"])]
    #[Assert\NotBlank(message: "L'email du client est obligatoire.")]
    #[Assert\Email(
        message: "L'email {{ value }} n'est pas une adresse valide.",
    )]
    private $email;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    #[Groups(["customers_read", "invoices_read"])]
    private $company;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $streetAddress;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $postcode;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $city;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $phoneNumber;

    #[ORM\OneToMany(mappedBy: 'customer', targetEntity: Invoice::class)]
    #[Groups("customers_read")]
    #[ApiSubresource]
    private $invoices;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'customers')]
    #[Groups("customers_read")]
    #[Assert\NotBlank(message: "L'utilisateur est obligatoire.")]
    private $user;

    public function __construct()
    {
        $this->invoices = new ArrayCollection();
    }

    /**
     * To return the Incoices total amount
     *
     * @return string
     */
    #[Groups("customers_read")]
    public function getTotalAmount() : string
    {
        $total = 0;
        foreach($this->invoices as $invoice) {
            $total += floatval($invoice->getAmount());
        }
        return number_format($total, 2, '.', ' ');
        
    }

    /**
     * To return the unpaid amount
     *
     * @return string
     */
    #[Groups("customers_read")]
    public function getUnpaidAmount() : string
    {
        $total = 0;
        foreach($this->invoices as $invoice) {
            if($invoice->getStatus() === "SENT") {
                $total += floatval($invoice->getAmount());
            }
        }
        return number_format($total, 2, '.', ' ');
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

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

    public function setStreetAddress(string $streetAddress): self
    {
        $this->streetAddress = $streetAddress;

        return $this;
    }

    public function getPostcode(): ?string
    {
        return $this->postcode;
    }

    public function setPostcode(string $postcode): self
    {
        $this->postcode = $postcode;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(string $city): self
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
     * @return Collection|Invoice[]
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices[] = $invoice;
            $invoice->setCustomer($this);
        }

        return $this;
    }

    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->removeElement($invoice)) {
            // set the owning side to null (unless already changed)
            if ($invoice->getCustomer() === $this) {
                $invoice->setCustomer(null);
            }
        }

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}

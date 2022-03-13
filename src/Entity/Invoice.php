<?php

namespace App\Entity;

use App\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\InvoiceRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Controller\InvoiceIncrementationController;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;

use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: InvoiceRepository::class)]
#[ApiResource(
    collectionOperations: [
        'get' => ['path' => '/factures'],
        'post' => ['path' => '/factures']
    ],
    itemOperations: [
        'get' => ['path' => '/factures/{id}'],
        'put' => ['path' => '/factures/{id}'],
        'delete' => ['path' => '/factures/{id}'],
        'increment' => [
            'method' => 'post',
            'path' => '/factures/{id}/increment',
            'controller' => InvoiceIncrementationController::class,
            'openapi_context' => [
                'summary' => 'Donne une nouvelle référence à une facture.',
                'description' => "Change la référence d'une facture donnée.",
                'requestBody' => [
                    'content' => [
                        'application/json' => [
                            'schema'  => [
                                'type'       => 'object',
                            ],
                        ],
                    ],
                ],
            ]
        ]
    ],
    subresourceOperations: [
        'api_customers_invoices_get_subresource' => [
            'normalization_context' => [
                'groups' => ['invoices_subresource'],
            ],
        ],
    ],
    attributes: [
        "pagination_enabled" => false,
        "pagination_items_per_page" => 20
    ],
    order: ["sentAt" => "DESC"],
    normalizationContext: ['groups' => ['invoices_read']],
    denormalizationContext: ['disable_type_enforcement' => true]
)]
#[ApiFilter(OrderFilter::class, properties: ["amount", "sentAt", "status"])]
class Invoice
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(["invoices_read", "customers_read", "invoices_subresource"])]
    private $id;

    #[ORM\Column(type: 'decimal', precision: 7, scale: 2)]
    #[Groups(["invoices_read", "customers_read", "invoices_subresource"])]
    #[Assert\Type(
        type: 'numeric',
        message: 'Le montant de la facture doit être numérique.',
        )]
    #[Assert\NotBlank(message: "Le montant de la facture est obligatoire.")]
    private $amount;

    #[ORM\Column(type: 'datetime')]
    #[Groups(["invoices_read", "customers_read", "invoices_subresource"])]
    #[Assert\NotBlank(message: "La date de la facture est obligatoire.")]
    #[Assert\Type(type:'datetime', message: "La date doit être au format YYYY-MM-DD")]
    private $sentAt;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(["invoices_read", "customers_read", "invoices_subresource"])]
    #[Assert\NotBlank(message: "Le statut de la facture est obligatoire.")]
    #[Assert\Choice(['SENT', 'PAID', 'CANCELLED'], message: "Le statut n'est pas valide.")]
    private $status;

    #[ORM\ManyToOne(targetEntity: Customer::class, inversedBy: 'invoices')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups("invoices_read")]
    #[Assert\NotBlank(message: "Le client de la facture doit être renseigné.")]
    private $customer;

    #[ORM\Column(type: 'integer')]
    #[Groups(["invoices_read", "customers_read", "invoices_subresource"])]
    #[Assert\NotBlank(message: "La référence de la facture est obligatoire.")]
    #[Assert\Type(
        type: 'integer',
        message: 'La référence de la facture doit être un nombre.',
    )]
    private $reference;

    /**
     * Get the user for an invoice
     *
     * @return User
     */
    #[Groups(["invoices_read", "invoices_subresource"])]
    public function getUser(): User
    {
        return $this->customer->getUser();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?string
    {
        return $this->amount;
    }

    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt($sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getReference(): ?int
    {
        return $this->reference;
    }

    public function setReference($reference): self
    {
        $this->reference = $reference;

        return $this;
    }
}

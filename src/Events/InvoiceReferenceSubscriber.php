<?php

namespace App\Events;

use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use DateTime;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class InvoiceReferenceSubscriber implements EventSubscriberInterface {
    private $security;
    private $invoiceRepository;

    public function __construct(Security $security, InvoiceRepository $invoiceRepository)
    {
        $this->security = $security;
        $this->invoiceRepository = $invoiceRepository;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setInvoiceReference', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setInvoiceReference(ViewEvent $event)
    {
        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        
        // Récupérer l'utilisateur connecté
        $user = $this->security->getUser();
        // Récupérer la référence suivante
        $nextReference = $this->invoiceRepository->findNextReference($user);
        // L'assigner à la nouvelle facture
        
        if ($invoice instanceof Invoice && $method === "POST") {
            $invoice->setReference($nextReference);

            // pas le meilleur endroit, mais on peut gérer aussi une date par défault
            if (empty($invoice->getSentAt())) {
                $invoice->setSentAt(new DateTime());
            }
        }
    }
}
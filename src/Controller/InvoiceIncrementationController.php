<?php

namespace App\Controller;

use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class InvoiceIncrementationController extends AbstractController {
    public function __invoke(Invoice $data, EntityManagerInterface $entityManager, InvoiceRepository $invoiceRepository) {
        $maxReference = $invoiceRepository->findOneByMaxReference($data->getCustomer()->getId());
        $data->setReference($maxReference + 1);

        $entityManager->flush();
        
        return $data;
    }
}
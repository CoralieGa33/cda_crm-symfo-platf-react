<?php

namespace App\Repository;

use App\Entity\User;
use App\Entity\Invoice;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @method Invoice|null find($id, $lockMode = null, $lockVersion = null)
 * @method Invoice|null findOneBy(array $criteria, array $orderBy = null)
 * @method Invoice[]    findAll()
 * @method Invoice[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InvoiceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Invoice::class);
    }

    public function findOneByMaxReference($customerId) {
        $conn = $this->getEntityManager()->getConnection();
        
        $sql = 'SELECT MAX(reference) FROM invoice WHERE invoice.customer_id = :customerId';
        $stmt = $conn->prepare($sql);
        $result = $stmt->executeQuery(['customerId' => $customerId])->fetchOne();
        return $result;
    }

    public function findNextReference(User $user) {
        return $this->createQueryBuilder("invoice")
                    ->select("invoice.reference")
                    ->join("invoice.customer", "customer")
                    ->where("customer.user = :user")
                    ->setParameter("user", $user)
                    ->orderBy("invoice.reference", "DESC")
                    ->setMaxResults(1)
                    ->getQuery()
                    ->getSingleScalarResult() + 1;
    }

    // /**
    //  * @return Invoice[] Returns an array of Invoice objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('i.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Invoice
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';
import invoicesAPI from '../services/invoicesAPI';

const STATUS_CLASSES = {
    SENT: "light",
    PAID: "success",
    CANCELLED: "danger"
}

const STATUS_LABELS = {
    SENT: "Envoyée",
    PAID: "Réglée",
    CANCELLED: "Annulée"
}

const InvoicesPage = (props) => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const itemsPerPage = 10;

    const fetchInvoices = async () => {
        try {
            const data = await invoicesAPI.findAll();
            setInvoices(data);
        } catch(error) {
            console.log(error.response)
        }
    }

    useEffect(() => {
        fetchInvoices()
    }, []);

    // Gestion du changement de page
    const handlePageChange = (page) => setCurrentPage(page);

    // Pour rechercher une facture par mot clé
    const handleSearch = ({ currentTarget }) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }

    // Suppression d'une facture
    const handleDelete = async (id) => {
        const originalInvoices = [...invoices];
        setInvoices(invoices.filter(invoice => invoice.id !==id));

        try {
            await invoicesAPI.delete(id)
        } catch(error) {
            setInvoices(originalInvoices);
        }
    };
    

    // Filtrage des clients en fonction du mot clé entré dans la recherche
    const filteredInvoices = invoices.filter(i => 
        i.customer.firstName.toLowerCase().includes(search.toLowerCase()) || 
        i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
        STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    )

    // Pagination des données
    const paginatedInvoices = Pagination.getData(
        filteredInvoices,
        currentPage,
        itemsPerPage
    );

    return ( 
        <>
            <div className="title d-flex justify-content-between mb-3">
                <Link to="/factures/new" className="btn btn-sm btn-outline-dark">Ajouter une facture</Link>

                <h1>Liste des factures</h1>

                <div className="form-group col-sm-4">
                    <input
                        type="text"
                        placeholder="Rechercher ..."
                        className="form-control"
                        onChange={handleSearch}
                        value={search}
                    />
                </div>
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Référence</th>
                        <th>Client</th>
                        <th className="text-center">Date d'envoi</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Montant</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {paginatedInvoices.map(invoice =>
                        <tr key={invoice.id}>
                            <td>{invoice.reference}</td>
                            <td><a href="#">{invoice.customer.firstName} {invoice.customer.lastName}</a></td>
                            <td className="text-center">{new Date(invoice.sentAt).toLocaleDateString()}</td>
                            <td className="text-center"><span className={"badge bg-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span></td>
                            <td className="text-center">{parseFloat(invoice.amount).toLocaleString("fr-FR", {style: "currency", currency: "EUR"})}</td>
                            <td>
                                <Link to={"/factures/" + invoice.id} className="btn btn-sm btn-warning me-2">Editer</Link>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}>Supprimer</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <Pagination 
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={filteredInvoices.length}
                onPageChange={handlePageChange}
            />
        </>
    );
}

export default InvoicesPage;
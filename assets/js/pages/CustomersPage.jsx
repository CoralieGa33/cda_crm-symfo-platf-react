import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TableLoader from '../components/loaders/TableLoader';
import Pagination from '../components/Pagination';
import customersAPI from '../services/customersAPI';

const CustomersPage = (props) => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const itemsPerPage = 10;

    // Récupérer la liste des clients
    const fetchCustomers = async () => {
        try {
            const data = await customersAPI.findAll();
            setCustomers(data);
            setLoading(false);
        } catch(error) {
            toast.error("Erreur lors du chargement des clients !")
        }
    }

    // Au chargement du composant, on récupère les clients
    useEffect(() => {
        fetchCustomers()
    }, []);

    // Suppression d'un client (qui n'a pas de facture)
    const handleDelete = async (id) => {
        const originalCustomers = [...customers];
        setCustomers(customers.filter(customer => customer.id !==id));

        try {
            await customersAPI.delete(id);
            toast.success("Le client a bien été supprimé.");
        } catch(error) {
            setCustomers(originalCustomers);
            toast.success("Une erreur est survenue, le client n'a pas été supprimé");
        }
        
    };

    // Gestion du changement de page
    const handlePageChange = (page) => setCurrentPage(page);

    // Pour rechercher un client par mot clé
    const handleSearch = ({ currentTarget }) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    }

    
    // Filtrage des clients en fonction du mot clé entré dans la recherche
    const filteredCustomers = customers.filter(c => 
        c.firstName.toLowerCase().includes(search.toLowerCase()) || 
        c.lastName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    )
        
    // Pagination des données
    const paginatedCustomers = Pagination.getData(
        filteredCustomers,
        currentPage,
        itemsPerPage
    );

    return (
        <>
            <div className="title d-flex justify-content-between mb-3">
                    <Link to="/clients/new" className="btn btn-sm btn-outline-dark">Ajouter un client</Link>

                    <h1>Liste des clients</h1>

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
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th className="text-center">Factures</th>
                        <th className="text-end">Montant total</th>
                        <th />
                    </tr>
                </thead>

                {!loading && <tbody>
                    {paginatedCustomers.map(customer =>
                        <tr key={customer.id}>
                            <td><Link to={"/clients/" + customer.id}>{customer.firstName} {customer.lastName}</Link></td>
                            <td>{customer.email}</td>
                            <td>{customer.company}</td>
                            <td className="text-center"><span className="badge bg-dark">{customer.invoices.length}</span></td>
                            <td className="text-end">{parseFloat(customer.totalAmount).toLocaleString("fr-FR", {style: "currency", currency: "EUR"})}</td>
                            <td>
                                <button
                                    onClick={() => handleDelete(customer.id)}
                                    disabled={customer.invoices.length > 0}
                                    className="btn btn-sm btn-danger"
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody> }
            </table>
            {loading && <TableLoader /> }

            {itemsPerPage < filteredCustomers.length &&
                <Pagination 
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    length={filteredCustomers.length}
                    onPageChange={handlePageChange}
                />
            }
        </>
    );
}

export default CustomersPage;
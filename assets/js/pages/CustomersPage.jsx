import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import customersAPI from '../services/customersAPI';

const CustomersPage = (props) => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    useEffect(() => {
        customersAPI.findAll()
            .then(data => setCustomers(data))
            .catch(error => console.log(error.response))
    }, []);

    const handleDelete = async(id) => {
        const originalCustomers = [...customers];
        setCustomers(customers.filter(customer => customer.id !==id));

        try {
            await customersAPI.delete(id)
        } catch(error) {
            setCustomers(originalCustomers);
        }
        // customersAPI.delete(id)
        //     .then(response => console.log("Client supprimé"))
        //     .catch(error => {
        //         setCustomers(originalCustomers);
        //         console.log(error.response);
        //     })
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearch = (event) => {
        setSearch(event.currentTarget.value);
        setCurrentPage(1);
    }

    const itemsPerPage = 10;
    
    const filteredCustomers = customers.filter(c => 
        c.firstName.toLowerCase().includes(search.toLowerCase()) || 
        c.lastName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    )
        
    const paginatedCustomers = Pagination.getData(
        filteredCustomers,
        currentPage,
        itemsPerPage
    );

    return (
        <>
            <div className="title d-flex justify-content-between">
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
                        <th>Id</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th className="text-center">Factures</th>
                        <th className="text-end">Montant total</th>
                        <th />
                    </tr>
                </thead>

                <tbody>
                    {paginatedCustomers.map(customer =>
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td><a href="#">{customer.firstName} {customer.lastName}</a></td>
                            <td>{customer.email}</td>
                            <td>{customer.company}</td>
                            <td className="text-center"><span className="badge bg-dark">{customer.invoices.length}</span></td>
                            <td className="text-end">{customer.totalAmount} €</td>
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
                </tbody>
            </table>

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
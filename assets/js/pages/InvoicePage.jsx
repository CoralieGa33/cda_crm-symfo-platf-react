import axios from 'axios';
import React,  { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import CustomersAPI from '../services/customersAPI';
import InvoicesAPI from '../services/invoicesAPI';

const InvoicePage = (props) => {
    const navigate = useNavigate();

    const id  = useParams().id || "new";

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    });

    const [customers, setCustomers] = useState([]);

    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    });

    const [editing, setEditing] = useState(false);

    // Récupération d'une facture par son id
    const fetchInvoice = async (id) => {
        try {
            const data = await InvoicesAPI.findOne(id);
            const { amount, status, customer } = data;
            setInvoice({ amount, status, customer: customer.id });
        } catch (error) {
            console.log(error.response);
            navigate("/factures");
        }
    };

    // Récupération de la liste des clients
    const fetchCustomers = async (id) => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            if(!invoice.customer) setInvoice({...invoice, customer: data[0].id});
        } catch (error) {
            console.log(error.response);
            navigate("/factures");
        }
    };

    // Récupération de la liste des clients au chargement du composant
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Chargement du composant en fonction de la valeur de id
    useEffect(() => {
        if(id !== "new") {
            setEditing(true);
            fetchInvoice(id);
        }
    }, [id]);

    // Gestion du changement de la valeur des inputs
    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;

        setInvoice({
            ...invoice,
            [name]: value
        })
    }

    // Gestion du submit du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(editing) {
                await InvoicesAPI.update(id, invoice);
                // TODO : notification de succès
            } else {
                await InvoicesAPI.create(invoice);
                navigate("/factures");
            }
            setErrors({});
        } catch ({ response }) {
            const  { violations } = response.data;
            if(violations) {
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
            };
        }
    }


    return (
        <>
            <h1 className='text-center'>{!editing && "Ajouter une facture" || "Modifier une facture"}</h1>
            <p className="text-center">* Champs obligatoires</p>

            <form className='col-md-4 mx-auto' onSubmit={handleSubmit}>
                    <Field
                        name="amount"
                        label="Montant de la facture *"
                        value={invoice.amount}
                        onChange={handleChange}
                        type="number"
                        placeholder="Entrez le montant de la facture"
                        error = {errors.amount}
                    />

                    <Select
                        name="customer"
                        label="Choisir un client *"
                        value={invoice.customer}
                        onChange={handleChange}
                        error = {errors.customer}
                    >
                        {customers.map(customer => 
                            <option
                                key={customer.id}
                                value={customer.id}
                            >
                                {customer.firstName} {customer.lastName}
                            </option>
                        )}
                    </Select>

                    <Select
                        name="status"
                        label="Choisir un status *"
                        value={invoice.status}
                        onChange={handleChange}
                        error={errors.status}
                    >
                        <option value="SENT">Envoyée</option>
                        <option value="PAID">Réglée</option>
                        <option value="CANCELLED">Annulée</option>
                    </Select>

                <div className="form-group mt-4 text-center">
                    <button type="submit" className="btn btn-outline-primary">{!editing && "Enregistrer" || "Modifier"}</button>
                    <Link to="/factures" className="btn btn-link">{!editing && "Annuler" || "Retour à la liste"}</Link>
                </div>
            </form>
        </>
    );
}

export default InvoicePage;
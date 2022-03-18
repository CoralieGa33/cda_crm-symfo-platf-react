import axios from 'axios';
import React,  { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import FormContentLoader from '../components/loaders/FormContentLoader';
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
    const [loading, setLoading] = useState(true);

    // Récupération d'une facture par son id
    const fetchInvoice = async (id) => {
        try {
            const data = await InvoicesAPI.findOne(id);
            const { amount, status, customer } = data;
            setInvoice({ amount, status, customer: customer.id });
            setLoading(false);
        } catch (error) {
            toast.error("Erreur lors du chargement de la facture !")
            navigate("/factures");
        }
    };

    // Récupération de la liste des clients
    const fetchCustomers = async (id) => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            setLoading(false);
            if(!invoice.customer) setInvoice({...invoice, customer: data[0].id});
        } catch (error) {
            toast.error("Erreur lors du chargement des clients !")
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
            setErrors({});
            if(editing) {
                await InvoicesAPI.update(id, invoice);
                toast.success("La facture a bien été modifiée.")
            } else {
                await InvoicesAPI.create(invoice);
                toast.success("La facture a bien été enregistrée.")
                navigate("/factures");
            }
        } catch ({ response }) {
            const  { violations } = response.data;
            if(violations) {
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
            };
            toast.error("Merci de vérifier tous les champs.")
        }
    }


    return (
        <>
            <h1 className='text-center'>{!editing && "Ajouter une facture" || "Modifier une facture"}</h1>
            <p className="text-center">* Champs obligatoires</p>

            {loading && <FormContentLoader /> }

            {!loading && <form className='col-md-4 mx-auto' onSubmit={handleSubmit}>
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
            </form> }
        </>
    );
}

export default InvoicePage;
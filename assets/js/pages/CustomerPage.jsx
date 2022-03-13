import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Field from '../components/forms/Field';
import CustomersAPI from '../services/customersAPI';

const CustomerPage = (props) => {
    const navigate = useNavigate();
    
    const id  = useParams().id || "new";

    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: "",
        streetAddress: "",
        postcode: "",
        city: "",
        phoneNumber: ""
    });

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: "",
        streetAddress: "",
        postcode: "",
        city: "",
        phoneNumber: ""
    });

    const [editing, setEditing] = useState(false);

    // Récupération d'un client par son id
    const fetchCustomer = async (id) => {
        try {
            const data = await CustomersAPI.findOne(id);
            const { lastName, firstName, email, company, streetAddress, postcode, city, phoneNumber } = await CustomersAPI.findOne(id);
            setCustomer({ lastName, firstName, email, company, streetAddress, postcode, city, phoneNumber });
        } catch (error) {
            console.log(error.response);
            navigate("/clients");
        }
    };

    // Chargement du composant en fonction de la valeur de id
    useEffect(() => {
        if(id !== "new") {
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);

    // Gestion du changement de la valeur des inputs
    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;

        setCustomer({
            ...customer,
            [name]: value
        })
    }

    // Gestion du submit du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if(editing) {
                await CustomersAPI.update(id, customer);
                // TODO : notification de succès
            } else {
                await CustomersAPI.create(customer);
                navigate("/clients");
            }
            setErrors({});
        } catch ({ response }) {
            const  { violations } = response.data;
            if(violations) {
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                })
                setErrors(apiErrors);
            };
        }
    }

    return (
        <>
            <h1 className='text-center'>{!editing && "Ajouter un client" || "Détails du client"}</h1>
            <p className="text-center">* Champs obligatoires</p>

            <form className='mx-auto' onSubmit={handleSubmit}>
                <div className="d-flex justify-content-center">
                    <div className="col-md-5 p-2">
                        <Field
                            name="lastName"
                            label="Nom de famille *"
                            value={customer.lastName}
                            onChange={handleChange}
                            placeholder="Entrez le nom de famille du client"
                            error = {errors.lastName}
                        />
                        <Field
                            name="firstName"
                            label="Prénom *"
                            value={customer.firstName}
                            onChange={handleChange}
                            placeholder="Entrez le prénom du client"
                            error = {errors.firstName}
                        />
                        <Field
                            name="email"
                            label="Email *"
                            value={customer.email}
                            onChange={handleChange}
                            placeholder="Entrez l'email du client"
                            error = {errors.email}
                        />
                        <Field
                            name="company"
                            label="Entreprise"
                            value={customer.company}
                            onChange={handleChange}
                            placeholder="Entrez le nom de l'entreprise du client"
                            error = {errors.company}
                        />
                    </div>
                    <div className="col-md-5 p-2">
                        <Field
                            name="streetAddress"
                            label="Adresse"
                            value={customer.streetAddress}
                            onChange={handleChange}
                            placeholder="Entrez l'adresse du client"
                            error = {errors.streetAddress}
                        />
                        <Field
                            name="postcode"
                            label="Code postal"
                            value={customer.postcode}
                            onChange={handleChange}
                            placeholder="Entrez le code postal du client"
                            error = {errors.postcode}
                        />
                        <Field
                            name="city"
                            label="Ville"
                            value={customer.city}
                            onChange={handleChange}
                            placeholder="Entrez la ville du client"
                            error = {errors.city}
                        />
                        <Field
                            name="phoneNumber"
                            label="N° de téléphone"
                            value={customer.phoneNumber}
                            onChange={handleChange}
                            placeholder="Entrez le numéro de téléphone du client"
                            error = {errors.phoneNumber}
                        />
                    </div>
                </div>

                <div className="form-group mt-4 text-center">
                    <button type="submit" className="btn btn-outline-primary">{!editing && "Enregistrer" || "Modifier"}</button>
                    <Link to="/clients" className="btn btn-link">{!editing && "Annuler" || "Retour à la liste"}</Link>
                </div>
            </form>
        </>
    );
}

export default CustomerPage;
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Field from '../components/forms/Field';
import axios from 'axios';

const Customerpage = (props) => {
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

    const fetchCustomer = async (id) => {
        try {
            const data = await axios
                .get("http://127.0.0.1:8000/api/clients/" + id)
                .then(response => response.data)
            const { lastName, firstName, email, company, streetAddress, postcode, city, phoneNumber } = data;
            setCustomer({ lastName, firstName, email, company, streetAddress, postcode, city, phoneNumber });
        } catch (error) {
            console.log(error.response)
        }
    };

    useEffect(() => {
        if(id !== "new") {
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);

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
                const response = await axios
                    .put("http://127.0.0.1:8000/api/clients/" + id, customer)
                // TODO : notification de succès
            } else {
                const response = await axios
                    .post("http://127.0.0.1:8000/api/clients", customer)
                navigate("/clients")
            }
            setErrors({});
        } catch (error) {
            if(error.response.data.violations) {
                const apiErrors = {};
                error.response.data.violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                })
                setErrors(apiErrors);
            };
        }
    }

    return (
        <>
            <h1 className='text-center'>{!editing && "Ajouter un client" || "Détails du client"}</h1>

            <form className='mx-auto' onSubmit={handleSubmit}>
                <div className="d-flex justify-content-center">
                    <div className="col-md-5 p-2">
                        <Field
                            name="lastName"
                            label="Nom de famille"
                            value={customer.lastName}
                            onChange={handleChange}
                            placeholder="Entrez le nom de famille du client"
                            error = {errors.lastName}
                        />
                        <Field
                            name="firstName"
                            label="Prénom"
                            value={customer.firstName}
                            onChange={handleChange}
                            placeholder="Entrez le prénom du client"
                            error = {errors.firstName}
                        />
                        <Field
                            name="email"
                            label="Email"
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
                    <Link to="/clients" className="btn btn-link">Annuler</Link>
                </div>
            </form>
        </>
    );
}

export default Customerpage;
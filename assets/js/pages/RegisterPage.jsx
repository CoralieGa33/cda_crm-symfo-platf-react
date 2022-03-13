import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Field from '../components/forms/Field';
import usersAPI from '../services/usersAPI';
import UsersAPI from '../services/usersAPI';

const RegisterPage = (props) => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        passwordConfirm: "",
        company: "",
        streetAddress: "",
        postcode: "",
        city: "",
        phoneNumber: ""
    });

    const [errors, setErrors] = useState({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        passwordConfirm: "",
        company: "",
        streetAddress: "",
        postcode: "",
        city: "",
        phoneNumber: ""
    });

    // Gestion du submit du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        if(user.passwordConfirm !== user.password) {
            setErrors({...errors, passwordConfirm: "Les mots de passe doivent être identiques."});
            return;
        }

        try {
            await UsersAPI.register(user)
            setErrors({});
            navigate("/login");
        } catch ({ response }) {
            const  { violations } = response.data;
            if(violations) {
                const apiErrors = {};
                violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                })
                setErrors(apiErrors);
            };
        }
    }

    // Gestion du changement de la valeur des inputs
    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;

        setUser({
            ...user,
            [name]: value
        })
    }

    return (
        <>
            <h1 className='text-center'>Inscription à l'application</h1>
            <p className="text-center">* Champs obligatoires</p>

            <form className='mx-auto' onSubmit={handleSubmit}>
                <div className="d-flex justify-content-center">
                    <div className="col-md-5 p-2">
                        <Field
                            name="lastName"
                            label="Nom de famille *"
                            value={user.lastName}
                            onChange={handleChange}
                            placeholder="Entrez votre nom de famille"
                            error = {errors.lastName}
                        />
                        <Field
                            name="firstName"
                            label="Prénom *"
                            value={user.firstName}
                            onChange={handleChange}
                            placeholder="Entrez votre prénom"
                            error = {errors.firstName}
                        />
                        <Field
                            name="email"
                            label="Email *"
                            value={user.email}
                            onChange={handleChange}
                            placeholder="Entrez votre email"
                            type="email"
                            error = {errors.email}
                        />
                        <Field
                            name="password"
                            label="Mot de passe (5 caractères minimum) *"
                            value={user.password}
                            onChange={handleChange}
                            placeholder="Entrez votre mot de passe"
                            type="password"
                            error = {errors.password}
                        />
                        <Field
                            name="passwordConfirm"
                            label="Confirmation du mot de passe *"
                            value={user.passwordConfirm}
                            onChange={handleChange}
                            placeholder="Répétez votre mot de passe"
                            type="password"
                            error = {errors.passwordConfirm}
                        />
                    </div>
                    <div className="col-md-5 p-2">
                        <Field
                            name="company"
                            label="Entreprise"
                            value={user.company}
                            onChange={handleChange}
                            placeholder="Entrez le nom de votre entreprise"
                            error = {errors.company}
                        />
                        <Field
                            name="streetAddress"
                            label="Adresse"
                            value={user.streetAddress}
                            onChange={handleChange}
                            placeholder="Entrez votre adresse"
                            error = {errors.streetAddress}
                        />
                        <Field
                            name="postcode"
                            label="Code postal"
                            value={user.postcode}
                            onChange={handleChange}
                            placeholder="Entrez votre code postal"
                            error = {errors.postcode}
                        />
                        <Field
                            name="city"
                            label="Ville"
                            value={user.city}
                            onChange={handleChange}
                            placeholder="Entrez votre ville"
                            error = {errors.city}
                        />
                        <Field
                            name="phoneNumber"
                            label="N° de téléphone"
                            value={user.phoneNumber}
                            onChange={handleChange}
                            placeholder="Entrez votre numéro de téléphone"
                            error = {errors.phoneNumber}
                        />
                    </div>
                </div>

                <div className="form-group mt-4 text-center">
                    <button type="submit" className="btn btn-outline-primary">Je m'inscris</button>
                    <Link to="/login" className="btn btn-link">J'ai déjà un compte</Link>
                </div>
            </form>
        </>
    );
}

export default RegisterPage;
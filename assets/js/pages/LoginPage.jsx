import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthAPI from '../services/authAPI';
import AuthContext from '../contexts/AuthContext';
import Field from '../components/forms/Field';

const LoginPage = () => {
    const navigate = useNavigate();

    const { setIsAuth } = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState('');

    // Gestion des champs input
    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;

        setCredentials({
            ...credentials,
            [name]: value
        })
    }

    // Gestion du submit du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            AuthAPI.authenticate(credentials)
            setError("");
            setIsAuth(true);
            navigate("/clients")
        } catch (error) {
            setError("Vérifiez vos informations.");
            console.log(error)
        }
    }

    return ( 
        <>
            <h1 className='text-center'>Connexion à l'application</h1>

            <form  className='col-md-4 mx-auto' onSubmit={handleSubmit}>
                <Field
                    name="username"
                    label="Email"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Entrez votre email"
                    error = {error}
                />
                <Field
                    name="password"
                    label="Mot de passe"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Entrez votre mot de passe"
                    type="password"
                    error = {error}
                />
                <div className="form-group mt-4 text-center">
                    <button type="submit" className="btn btn-outline-primary">Connexion</button>
                    <Link to="/register" className="btn btn-link">Je n'ai pas de compte</Link>
                </div>
            </form>
        </>
    );
}

export default LoginPage;
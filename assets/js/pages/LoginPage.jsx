import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthAPI from '../services/authAPI';
import AuthContext from '../contexts/AuthContext';

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
            await AuthAPI.authenticate(credentials)
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
                <div className="form-group">
                    <label htmlFor="username" className="form-label mt-4">Email</label>
                    <input
                        value={credentials.username}
                        onChange={handleChange}
                        type="email"
                        className={"form-control" + (error && " is-invalid")}
                        id="username"
                        placeholder="Entrez votre email"
                        name="username"
                    />
                    {error && <p className="invalid-feedback">{error}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="form-label mt-4">Mot de passe</label>
                    <input
                        value={credentials.password}
                        onChange={handleChange}
                        type="password"
                        className={"form-control" + (error && " is-invalid")}
                        id="password" 
                        placeholder="Entrez votre mot de passe"
                        name="password"
                    />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-outline-primary mt-4">Connexion</button>
                </div>
            </form>
        </>
    );
}

export default LoginPage;
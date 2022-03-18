import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AuthAPI from '../services/authAPI';
import AuthContext from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
    const navigate = useNavigate();

    const { isAuth, setIsAuth } = useContext(AuthContext);

    const handleLogout = () => {
        AuthAPI.logout();
        setIsAuth(false);
        toast.info("Vous êtes désormais déconnecté...")
        navigate("/login");
    }
    
    return ( 
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">React'i'on !</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarColor01">
                    <ul className="navbar-nav mx-auto">
                        {isAuth && (<>
                            <li className="nav-item">
                                <NavLink className="nav-link active" to="/clients">Clients
                                    <span className="visually-hidden">(current)</span>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/factures">Factures</NavLink>
                            </li>
                        </>)}
                    </ul>
                    <ul className="navbar-nav ml-auto">
                        {!isAuth && (<>
                            <li className="nav-item">
                                <NavLink to="/register" className="nav-link">Inscription</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/login" className="btn btn-outline-light">Connexion</NavLink>
                            </li>
                        </>) ||
                            <li className="nav-item">
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={handleLogout}
                                >
                                    Deconnexion
                                </button>
                            </li>
                        }
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
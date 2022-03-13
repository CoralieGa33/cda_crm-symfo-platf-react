import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from './js/components/Navbar';
import PrivateRoute from './js/components/PrivateRoute';
import AuthContext from './js/contexts/AuthContext';
import CustomerPage from './js/pages/CustomerPage';
import CustomersPage from './js/pages/CustomersPage';
import HomePage from './js/pages/HomePage';
//import CustomersPagePlatPagination from './js/pages/CustomersPagePlatPagination';
import InvoicesPage from './js/pages/InvoicesPage';
import InvoicePage from './js/pages/InvoicePage';
import LoginPage from './js/pages/LoginPage';
import AuthAPI from './js/services/authAPI';

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';



AuthAPI.setup();

const App = () => {
    const [isAuth, setIsAuth] = useState(AuthAPI.isAuthenticated());

    return (
        <AuthContext.Provider value={{
            isAuth,
            setIsAuth
        }}>
        
            <Router >
                <Navbar />

                <main className="container pt-5">
                    <Routes>
                        <Route path='/' element={<HomePage />} />
                        <Route path='/login' element={<LoginPage />} />
                        <Route path='/clients' element={<PrivateRoute element={<CustomersPage />} />} />
                        {/* <Route path='/clients' element={<CustomersPagePlatPagination />} /> */}
                        <Route path='/clients/:id' element={<PrivateRoute element={<CustomerPage />} />} />
                        <Route path='/factures' element={<PrivateRoute element={<InvoicesPage />} />} />
                        <Route path='/factures/:id' element={<PrivateRoute element={<InvoicePage />} />} />
                        <Route path="*" element={<p>Oups cette page n'existe pas: 404!</p>} />
                    </Routes>
                </main>
            </Router>
        </AuthContext.Provider>
    )
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
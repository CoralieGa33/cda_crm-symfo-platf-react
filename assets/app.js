import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Routes, Route } from 'react-router-dom';

import Navbar from './js/components/Navbar';
import HomePage from './js/pages/HomePage';
import CustomersPage from './js/pages/CustomersPage';
import CustomersPagePlatPagination from './js/pages/CustomersPagePlatPagination';

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';

// start the Stimulus application
//import './bootstrap';

const App = () => {
    return (
        <HashRouter >
            <Navbar />

            <main className="container pt-5">
                <Routes>
                    <Route exact path='/' element={<HomePage />} />
                    <Route exact path='/clients' element={<CustomersPage />} />
                    {/* <Route exact path='/clients' element={<CustomersPagePlatPagination />} /> */}
                </Routes>
            </main>
        </HashRouter>
    )
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
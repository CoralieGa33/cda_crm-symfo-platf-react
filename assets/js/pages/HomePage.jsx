import React from 'react';

const HomePage = (props) => {
    return ( 
        <div className="col-md-8 mx-auto p-5 mb-4 bg-light rounded-3">
            <div className="py-5">
                <h1 className="text-center display-5 mb-5 fw-bold">React'i'on</h1>
                <p className="">Simple application de gestion de factures / clients.</p>
                <p className="">Le backend (invisible pour l'utilisateur, mais à la base du bon fonctionnement de l'application) a été réalisé sous Symfony v6.0 avec l'appui d'API Platform v2.6.</p>
                <p className="">Le frontend (l'interface utilisateur) a été créé avec React v17.0.2.</p>
            </div>
        </div>
    );
}

export default HomePage;
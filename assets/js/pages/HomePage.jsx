import React from 'react';

const HomePage = (props) => {
    return ( 
        <div className="p-5 mb-4 bg-light rounded-3">
            <div className="container-fluid py-5">
                <h1 className="display-5 fw-bold">Home page</h1>
                <p className="col-md-8 fs-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur nihil ut hic voluptas assumenda, vitae iusto temporibus culpa id nemo quisquam sapiente minus aspernatur animi asperiores nostrum expedita rerum iste.</p>
                <button className="btn btn-primary btn" type="button">Plus</button>
            </div>
        </div>
    );
}

export default HomePage;
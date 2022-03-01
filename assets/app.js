import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './js/components/Navbar';

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';

// start the Stimulus application
//import './bootstrap';

console.log("App running !!!");

const App = () => {
    return (
        <>
            <Navbar />
        </>
    )
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
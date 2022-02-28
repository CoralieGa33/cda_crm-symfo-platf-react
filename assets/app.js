import React from 'react';
import ReactDOM from 'react-dom';

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';

// start the Stimulus application
//import './bootstrap';

console.log("App running !!!");

const App = () => {
    return <h2>Hello React : )</h2>
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
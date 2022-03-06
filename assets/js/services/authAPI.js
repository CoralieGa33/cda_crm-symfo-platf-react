import axios from "axios";
import jwtDecode from "jwt-decode";

/**
 * Déconnexion de l'utilisateur
 * Suppression du token du storage et de l'auth Axios
 */
function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

/**
 * Enregistre le token sur Axios
 * @param {string} token 
 */
function setAxiosToken(token) {
    axios.defaults.headers.common['Authorization'] = "Bearer " + token;
}

/**
 * Requête d'authentification
 * Stockage du token dans le storage et sur Axios
 * @param {object} credentials 
 */
function authenticate(credentials) {
    axios
        .post("http://127.0.0.1:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token => {
            // On stocke le token dans le local storage
            window.localStorage.setItem("authToken", token);
        
            // On ajoute le token au header de toute nouvelle requête
            setAxiosToken(token);
        })
}

/**
 * Vérification du token
 */
function setup() {
    // Vérifier présence d'un token
    const token = window.localStorage.getItem("authToken");
    // Vérifier la validité du token
    if(token) {
        const jwtData = jwtDecode(token)
        // jwtData.exp est en secondes, Date().getTime en ms
        if(jwtData.exp * 1000 > new Date().getTime()) {
            // envoyer le token à Axios
            setAxiosToken(token);
        }
    }
}

/**
 * Permet de savoir si on est authentifié ou non
 * @returns boolean
 */
function isAuthenticated() {
    const token = window.localStorage.getItem("authToken");
    if(token) {
        const jwtData = jwtDecode(token)
        if(jwtData.exp * 1000 > new Date().getTime()) {
            return true;
        }
        return false;
    }
    return false;
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
};
import axios from "axios";

function register(user) {
    return axios
        .post("http://127.0.0.1:8000/api/utilisateurs", user)
}
export default {
    register
}
import axios from "axios";

async function findAll() {
    const response = await axios
        .get("http://127.0.0.1:8000/api/clients");
    return response.data['hydra:member'];
}

async function findOne(id) {
    const response = await axios
        .get("http://127.0.0.1:8000/api/clients/" + id);
    return response.data;
}

function create(customer) {
    return axios
        .post("http://127.0.0.1:8000/api/clients", customer)
}

function update(id, customer) {
    return axios
        .put("http://127.0.0.1:8000/api/clients/" + id, customer)
}

function deleteCustomer(id) {
    return axios
        .delete("http://127.0.0.1:8000/api/clients/" + id)
}

export default {
    findAll,
    findOne,
    create,
    update,
    delete: deleteCustomer
}
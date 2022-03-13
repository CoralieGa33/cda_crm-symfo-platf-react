import axios from "axios";

async function findAll() {
    const response = await axios
        .get("http://127.0.0.1:8000/api/factures");
    return response.data['hydra:member'];
}

async function findOne(id) {
    return axios
        .get("http://127.0.0.1:8000/api/factures/" + id)
        .then(response => response.data);
}

function create(invoice) {
    return axios
        .post("http://127.0.0.1:8000/api/factures", {
            ...invoice,
            customer: `/api/clients/${invoice.customer}`
        });
}

function update(id, invoice) {
    return axios
        .put("http://127.0.0.1:8000/api/factures/" + id, {
            ...invoice,
            customer: `/api/clients/${invoice.customer}`
        });
}

function deleteInvoice(id) {
    return axios
        .delete("http://127.0.0.1:8000/api/factures/" + id)
}

export default {
    findAll,
    findOne,
    create,
    update,
    delete: deleteInvoice
}
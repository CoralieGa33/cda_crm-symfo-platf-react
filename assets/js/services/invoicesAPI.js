import axios from "axios";
import { INVOICES_API } from "../../config"

async function findAll() {
    return axios
        .get(INVOICES_API)
        .then(response => response.data['hydra:member']);
}

async function findOne(id) {
    return axios
        .get(INVOICES_API + "/" + id)
        .then(response => response.data);
}

function create(invoice) {
    return axios
        .post(INVOICES_API, {
            ...invoice,
            customer: `/api/clients/${invoice.customer}`
        });
}

function update(id, invoice) {
    return axios
        .put(INVOICES_API + "/" + id, {
            ...invoice,
            customer: `/api/clients/${invoice.customer}`
        });
}

function deleteInvoice(id) {
    return axios
        .delete(INVOICES_API + id)
}

export default {
    findAll,
    findOne,
    create,
    update,
    delete: deleteInvoice
}
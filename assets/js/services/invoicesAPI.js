import axios from "axios";

function findAll() {
    return (
        axios
            .get("http://127.0.0.1:8000/api/factures")
            .then(response => response.data['hydra:member'])
    )
}

function deleteInvoice(id) {
    return (
        axios
            .delete("http://127.0.0.1:8000/api/factures/" + id)
    )
}

export default {
    findAll,
    delete: deleteInvoice
}
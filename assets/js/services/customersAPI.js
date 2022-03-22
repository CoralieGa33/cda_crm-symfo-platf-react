import axios from "axios";
import cache from "./cache";
import Cache from "./cache";
import { CUSTOMERS_API } from "../../config"

async function findAll() {
    const cachedCustomers = await Cache.get("customers");

    if(cachedCustomers) return cachedCustomers;

    return axios
    .get(CUSTOMERS_API)
    .then(response => {     
        // Méthode 1 : mettre le cache à jour si la requête s'est bien passée      
        const customers = response.data['hydra:member'];
        Cache.set("customers", customers);
        return customers;
        });
}

async function findOne(id) {
    const cachedCustomer = await Cache.get("customers." + id);
    if(cachedCustomer) return cachedCustomer

    return axios
        .get(CUSTOMERS_API + "/" + id)
        .then(response => {
            // Méthode 1 : mettre le cache à jour si la requête s'est bien passée  
            const customer = response.data;
            Cache.set("customers." + id, customer)
            return customer;
        })
}

function create(customer) {
    return axios
        .post(CUSTOMERS_API, customer)
        .then(async response => {
            // Méthode 1 : mettre le cache à jour si la requête s'est bien passée  
            const cachedCustomers = await Cache.get("customers");
            if(cachedCustomers) {
                Cache.set("customers", [...cachedCustomers, response.data])
            }
            return response;
        })
}

function update(id, customer) {
    return axios
        .put(CUSTOMERS_API + "/" + id, customer)
        .then(async response => {
            // Méthode 1 : mettre le cache à jour si la requête s'est bien passée  
            const cachedCustomers = await Cache.get("customers");
            const cachedCustomer = await Cache.get("customers." + id);
            if(cachedCustomer) {
                Cache.set("customers." + id, response.data);
            }
            if(cachedCustomers) {
                const index = cachedCustomers.findIndex(c => c.id === +id);
                cachedCustomers[index] = response.data;
            }
            return response;
        })
}

function deleteCustomer(id) {
    return axios
        .delete(CUSTOMERS_API + "/" + id)
        .then(async response => {
            // Méthode 2 : Vider le cache customers, il se réinitialisera au prochain chargement
            const cachedCustomers = await Cache.get("customers");
            if(cachedCustomers) {
                Cache.invalidate("customers")
            }
            return response;
        })
}

export default {
    findAll,
    findOne,
    create,
    update,
    delete: deleteCustomer
}
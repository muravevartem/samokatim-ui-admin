import {$api} from "../http.js";

class InventoryModelService {
    async create(model) {
        let response = await $api.post(`/api/v1/inventorymodels`, model);
        return response.data;
    }

    async search(string) {
        let response = await $api.get(`/api/v1/inventorymodels?keyword=${string}`);
        return response.data;
    }
}

export const inventoryModelService = new InventoryModelService()

import {$api} from "../http.js";

class EquipmentService {
    async getAllMy(pageable) {
        let url = `/api/v1/equipments?my&page=${pageable.page}&size=${pageable.size}&${pageable.sort}`;
        let response = await $api.get(url);
        return response.data;
    }

    async getOne(equipmentId) {
        let response = await $api.get(`/api/v1/equipments/${equipmentId}`);
        return response.data;
    }

    async create(equipment) {
        let response = await $api.post(`/api/v1/equipments`, equipment);
        return response.data;
    }

    async update(id, value, field) {
        let response = await $api.put(`/api/v1/equipments/${id}/${field}`, value);
        return response.data;
    }
}

export const equipmentService = new EquipmentService();

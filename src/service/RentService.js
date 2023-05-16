import {$api} from "../http.js";

class RentService {
    async getMyAll(pageable) {
        let url = `/api/v1/rents?my-org&page=${pageable.page}&size=${pageable.size}&${pageable.sort}`;
        let response = await $api.get(url);
        return response.data;
    }

    async getOne(id) {
        let response = await $api.get(`/api/v1/rents/${id}?full`);
        return response.data;
    }
}

export const rentService = new RentService();

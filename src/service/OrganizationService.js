import {$api} from "../http.js";

class OrganizationService {

    async getByInn(inn) {
        let response = await $api.get(`/api/v1/orgs?inn=${inn}`);
        return response.data;
    }

    async register(org) {
        let response = await $api.post(`/api/v1/orgs`, org);
        return response.data;
    }

}

export const organizationService = new OrganizationService();

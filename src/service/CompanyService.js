import {$handbook_api} from "../http";

class CompanyService {
    async getByInn(inn) {
        let response = await $handbook_api.get(`/api/v1/fns/organizations?inn=${inn}`)
        return response.data
    }

    async register(company) {
        let response = await $handbook_api.post(`/api/v1/admin/organizations`, company);
        return response.data;
    }
}

export const companyService = new CompanyService();
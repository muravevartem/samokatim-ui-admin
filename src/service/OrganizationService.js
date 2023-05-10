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

    async getMyOrg(){
        let axiosResponse = await $api.get(`/api/v1/orgs/me`);
        return axiosResponse.data;
    }

    async getTariffs() {
        let axiosResponse = await $api.get(`/api/v1/orgs/me/tariffs`);
        return axiosResponse.data;
    }

    async addTariff(tariff) {
        let axiosResponse = await $api.post(`/api/v1/orgs/me/tariffs`, tariff);
        return axiosResponse.data;
    }

    async deleteTariff(tariff) {
        let axiosResponse = await $api.delete(`/api/v1/orgs/me/tariffs/${tariff.id}`);
        return axiosResponse.data;
    }

    async changeLogo(logo) {
        let axiosResponse = await $api.post(`/api/v1/orgs/me/logo`, {fileId: logo.id});
        return axiosResponse.data;
    }

}

export const organizationService = new OrganizationService();

import React from "react";
import {$api} from "../http.js";

class OfficeService {

    async getAllMy(pageable) {
        let url = `/api/v1/offices?my&page=${pageable.page}&size=${pageable.size}&${pageable.sort}`;
        let response = await $api.get(url);
        return response.data;
    }

    async getAllMyByKeyword(keyword, pageable) {
        let url = `/api/v1/offices?my&keyword=${keyword}page=${pageable.page}&size=${pageable.size}&${pageable.sort}`;
        let response = await $api.get(url);
        return response.data;
    }

    async getOneMy(id) {
        let url = `/api/v1/offices/${id}?my`;
        let response = await $api.get(url);
        return response.data;
    }

    async create(office) {
        let axiosResponse = await $api.post(`/api/v1/offices`, office);
        return axiosResponse.data;
    }

    async changeSchedule(officeId, schedule) {
        let axiosResponse = await $api.put(`/api/v1/offices/${officeId}/schedule`, {days: schedule});
        return axiosResponse.data;
    }

}

export const officeService = new OfficeService();

import {$api} from "../http.js";

class EmployeeService {
    async getAllColleague(keyword, showRetired, pageable) {
        let url = `/api/v1/employees?page=${pageable.page}&size=${pageable.size}&${pageable.sort}&show_retired=${showRetired}&keyword=${keyword}`;
        let response = await $api.get(url);
        return response.data;
    }

    async create(obj) {
        let axiosResponse = await $api.post(`/api/v1/employees`, obj);
        return axiosResponse.data;
    }

    async update(id, obj) {
        let axiosResponse = await $api.put(`/api/v1/employees/${id}`, obj);
        return axiosResponse.data;
    }

    async getOne(id) {
        let axiosResponse = await $api.get(`/api/v1/employees/${id}`);
        return axiosResponse.data;
    }
}

export const employeeService = new EmployeeService();

import {$api} from "../http.js";

class EmployeeService {
    async getAllColleague(keyword, showRetired, pageable) {
        let url = `/api/v1/employees?page=${pageable.page}&size=${pageable.size}&${pageable.sort}&show_retired=${showRetired}&keyword=${keyword}`;
        let response = await $api.get(url);
        return response.data;
    }
}

export const employeeService = new EmployeeService();

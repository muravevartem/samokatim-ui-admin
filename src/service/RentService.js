import {$api} from "../http.js";
import moment from "moment";

class RentService {
    async getStatMyOrganization() {
        const end = moment();
        const start = end.startOf('days');
        const encodedStart = encodeURIComponent(start.toISOString());
        const encodedEnd = encodeURIComponent(end.toISOString());
        const uri = `/api/v1/admin/rents/me/stat?start=${encodedStart}&end=${encodedEnd}`;
        let response = await $api.get(uri);
        return response.data;
    }
}

export const rentService = new RentService();

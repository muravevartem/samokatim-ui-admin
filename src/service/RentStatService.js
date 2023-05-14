import {$api} from "../http.js";
import moment from "moment";

class RentStatService {

    async loadStat(start, end) {
        let response = await $api.get(`/api/v1/rents/stat?my&start=${encodeURIComponent(moment(start).toISOString(true))}&end=${encodeURIComponent(moment(end).toISOString(true))}`);
        return response.data;
    }

    async loadAmountStat(start, end) {
        let data = await this.loadStat(start, end)
        return [
            {
                id: 'Company',
                data: data.map(d => (
                    {
                        x: moment(d.date).format('L'),
                        y: d.amount
                    }
                ))
            }
        ]
    }

    async loadMoneySumStat(start, end) {
        let data = await this.loadStat(start, end)
        return [
            {
                id: 'Company',
                data: data.map(d => (
                    {
                        x: moment(d.date).format('L'),
                        y: d.moneySum
                    }
                ))
            }
        ]
    }
}

export const rentStatService = new RentStatService();

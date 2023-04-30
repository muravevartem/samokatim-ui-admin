import axios from "axios";

const handbookApi = axios.create({
    baseURL: 'https://handbook.1304294-cu57808.tw1.ru/',
    withCredentials: true
})

export const $handbook_api = handbookApi;
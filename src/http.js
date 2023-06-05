import axios from "axios";
import {userService} from "./service/UserService.js";
import {events, eventService} from "./service/EventService.js";

let api = axios.create({
    baseURL: (process.env.NODE_ENV === 'develpment')
        ? 'http://localhost:8080'
        : 'https://api.1304294-cu57808.tw1.ru',
    withCredentials: true,
});

let onFulfilledRequest = function (config) {
    if (userService.token) {
        config.headers.Authorization = `Bearer ${userService.token}`
    }
    return config;
};
let onRejectedRequest = function (error) {
};

let onFulfilledResponse = function (r) {
    return r;
};
let onRejectedResponse = function (error) {
    if (error.response.status === 401)
        eventService.raise(events.error401);
    throw error;
};

api.interceptors.request.use(onFulfilledRequest, onRejectedRequest)
api.interceptors.response.use(onFulfilledResponse, onRejectedResponse)

export const $api = api;

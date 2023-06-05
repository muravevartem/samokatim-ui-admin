import {events, eventService} from "./EventService.js";
import {$api} from "../http.js";
import {AppEvents, eventBus} from "./EventBus";

class UserService {
    constructor() {
        this.token = localStorage.getItem('token');
        eventService.subscribe(events.error401, () => {
            localStorage.removeItem('token');
            this.token = null
        })
    }

    async signin(cred) {
        try {
            let response = await $api.post(`/api/v1/auth`, {
                username: cred.username,
                password: cred.password,
                roles: ['LOCAL_ADMIN']
            });
            let data = response.data;
            this.token = data.accessToken;
            localStorage.setItem('token', data.accessToken);
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    async signout() {
        localStorage.removeItem('token');
        this.token = undefined;
        eventBus.raise(AppEvents.LogOut)
    }

    async resetPassword(cred) {
        let response = await $api.put(`/api/v1/users/reset-password`, cred);
        return response.data;
    }

    authenticated() {
        return this.token != null;
    }

    async me() {
        let response = await $api.get(`/api/v1/users/me`);
        return response.data;
    }

    async completeInvite(id, body) {
        let response = await $api.put(`/api/v1/user-invites/${id}`, body);
        return response.data
    }

}

export const userService = new UserService();

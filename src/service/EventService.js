class EventService {
    constructor() {
        this.handlers = {};
    }

    subscribe(type, handler) {
        if (!(this.handlers[type])) this.handlers[type] = [];
        this.handlers[type].push(handler)
    }

    raise(type) {
        if (this.handlers[type]) {
            this.handlers[type].forEach(handler => handler());
        }
    }
}


export const eventService = new EventService();

export const events = {
    myLocation: 'my-location',
    error: 'error',
    searchFocus: 'search-focus',
    searchBlur: 'search-focus',
    error401: 'error-401',
    updatedUserName: 'updated-user-name',
    moveMap: 'move-map',
    newEquipmentLocations: 'new-equipment-locations',
    selectedEquipment: 'selected-equipment',
    startRent: 'start-rent',
    stopRent: 'stop-rent',
    logout: 'logout'
}

class EventBus {
    constructor() {
        this.eventHandlers = {}
    }
    on(event, handler) {
        if (!this.eventHandlers[event])
            this.eventHandlers[event] = []
        let index = this .eventHandlers[event].length;
        this.eventHandlers[event][index] = handler;
        return () => {
            this.eventHandlers[event].splice(index, 1)
        }
    }

    raise(event, payload) {
        let handlers = this.eventHandlers[event]??[];
        handlers.forEach(value => value(payload))
    }
}

export const eventBus = new EventBus();


export const AppEvents = {
    MarkerLocated: "MarkerLocated",
    LogoUploaded: 'LogoUploaded',
    LogOut: 'LogOut'
}

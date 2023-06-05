import {Navigate, useNavigate} from "react-router-dom";
import {userService} from "../service/UserService.js";
import {routes} from "../routes.js";
import {useEffect} from "react";
import {AppEvents, eventBus} from "../service/EventBus";

export default function ({children, roles}) {

    let navigate = useNavigate();

    useEffect(() => {
        let onLogout = eventBus.on(AppEvents.LogOut, () => navigate(routes.signin));
        return () => {
            onLogout();
        }
    },[])

    if (!userService.authenticated())
        return <Navigate to={routes.signin}/>
    return children
}


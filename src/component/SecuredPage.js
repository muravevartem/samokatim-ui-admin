import {Navigate, useNavigate} from "react-router-dom";
import {userService} from "../service/UserService.js";
import {routes} from "../routes.js";

export default function ({children, roles}) {

    let navigate = useNavigate();

    if (!userService.authenticated())
        return <Navigate to={routes.signin}/>
    return children
}


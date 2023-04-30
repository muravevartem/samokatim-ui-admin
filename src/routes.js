import React from "react";
import {createBrowserRouter, createRoutesFromElements, Navigate, Route, useNavigate} from "react-router-dom";
import Root from "./component/Root";
import {LKPage} from "./component/LKPage";
import {RegistrationPage} from "./component/RegistrationPage";

export const routes = {
    root: '/',
    home: '/lk',
    creation: '/welcome',
    inventories: '/inventories',
    offices: '/offices',
    financials: '/financials',
    clients: '/clients',
    employees: '/employees',
    map: '/map'
}

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path={routes.root} element={<Root/>}>
            <Route path='' element={<Navigate to={routes.home}/>}/>
            <Route path={routes.home} element={<LKPage/>}/>
            <Route path={routes.creation} element={<RegistrationPage/>}/>
        </Route>
    )
)
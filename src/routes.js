import React from "react";
import {createBrowserRouter, createRoutesFromElements, Navigate, Route} from "react-router-dom";
import Root from "./component/Root";
import {OrganizationAdminPanel} from "./component/OrganizationAdminPanel.js";
import {RegistrationPage} from "./component/RegistrationPage";
import SecuredPage from "./component/SecuredPage.js";
import {SiginPage} from "./component/SiginPage.js";
import {InventoryPage} from "./component/inventory/InventoryPage.js";
import {OneInventoryPage} from "./component/inventory/OneInventoryPage.js";
import {NotFoundPage} from "./component/components.js";
import {ConfirmationUserPage} from "./component/ConfirmationUserPage.js";

export const routes = {
    root: '/',
    home: '/lk',
    creation: '/welcome',
    inventories: '/inventories',
    offices: '/offices',
    financials: '/financials',
    clients: '/clients',
    employees: '/employees',
    map: '/map',
    signin: '/sign-in',
    signup: '/sign-up',
    confirmationUser: '/confirm',
    '404': '/not-found'
}

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path={routes.root} element={<Root/>} errorElement={<NotFoundPage/>}>
            <Route path=''
                   element={
                       <Navigate to={routes.home}/>
                   }
            />
            <Route path={routes.home}
                   element={
                       <SecuredPage>
                           <OrganizationAdminPanel/>
                       </SecuredPage>
                   }
            />
            <Route path={routes.creation}
                   element={
                       <RegistrationPage/>
                   }
            />
            <Route path={routes.signin}
                   element={
                       <SiginPage/>
                   }
            />
            <Route path={routes.inventories}
                   element={
                       <SecuredPage>
                           <InventoryPage/>
                       </SecuredPage>
                   }
            />
            <Route path={`${routes.inventories}/:id`}
                   element={
                       <SecuredPage>
                           <OneInventoryPage/>
                       </SecuredPage>
                   }
            />
            <Route path={`${routes.confirmationUser}/:id`}
                   element={
                       <ConfirmationUserPage/>
                   }
            />
        </Route>
    )
)

import React from "react";
import {createBrowserRouter, createRoutesFromElements, Navigate, Route} from "react-router-dom";
import Root from "./component/Root";
import {OrganizationPage} from "./component/organization/OrganizationPage.js";
import {RegistrationPage} from "./component/organization/RegistrationPage.js";
import SecuredPage from "./component/SecuredPage.js";
import {SiginPage} from "./component/SiginPage.js";
import {InventoryPage} from "./component/inventory/InventoryPage.js";
import {ConfirmationUserPage} from "./component/ConfirmationUserPage.js";
import {InventoryRegistrationPage} from "./component/inventory/InventoryRegistrationPage.js";
import {InventoryOnePage} from "./component/inventory/InventoryOnePage.js";
import {EmployeePage} from "./component/employees/EmployeePage.js";
import {OfficeRegistrationPage} from "./component/rentalpoints/OfficeRegistrationPage.js";
import {OfficePage} from "./component/rentalpoints/OfficePage.js";
import {OfficeOnePage} from "./component/rentalpoints/OfficeOnePage.js";
import {Alert, AlertIcon} from "@chakra-ui/react";
import {EmployeeRegistrationPage} from "./component/employees/EmployeeRegistrationPage.js";
import {EmployeeOnePage} from "./component/employees/EmployeeOnePage.js";
import {FinancialPage} from "./component/financial/FinancialPage.js";
import {FinancialOnePage} from "./component/financial/FinancialOnePage.js";

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

export const routePaths = {
    'lk': 'Домашняя страница',
    'offices': 'Офисы',
    'employees': 'Сотрудники',
    'inventories': 'Инвентарь'
}

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path={routes.root}
               element={<Root/>}
               errorElement={
                   <Alert status='error'>
                       <AlertIcon/>
                       Страница не найдена
                   </Alert>
               }>
            <Route path=''
                   element={
                       <Navigate to={routes.home}/>
                   }
            />
            <Route path={routes.home}
                   element={
                       <SecuredPage>
                           <OrganizationPage/>
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
            <Route path={`${routes.confirmationUser}/:id`}
                   element={
                       <ConfirmationUserPage/>
                   }
            />
            <Route path={`${routes.inventories}/new`}
                   element={
                       <InventoryRegistrationPage/>
                   }
            />
            <Route path={`${routes.inventories}/:id`}
                   element={
                       <InventoryOnePage/>
                   }
            />
            <Route path={routes.employees}
                   element={
                       <EmployeePage/>
                   }
            />
            <Route path={`${routes.employees}/new`}
                   element={
                       <EmployeeRegistrationPage/>
                   }
            />
            <Route path={`${routes.employees}/:id`}
                   element={
                       <EmployeeOnePage/>
                   }/>
            <Route path={routes.offices}
                   element={
                       <OfficePage/>
                   }
            />
            <Route path={`${routes.offices}/new`}
                   element={
                       <OfficeRegistrationPage/>
                   }
            />
            <Route path={`${routes.offices}/:id`}
                   element={
                       <OfficeOnePage/>
                   }
            />
            <Route path={routes.financials}
                   element={
                       <FinancialPage/>
                   }
            />
            <Route path={`${routes.financials}/:id`}
                   element={
                       <FinancialOnePage/>
                   }
            />
        </Route>
    )
)

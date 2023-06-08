import React from "react";
import {MyBreadcrumb, Pageable} from "../components.js";
import {routes} from "../../routes.js";
import {officeService} from "../../service/OfficeService.js";
import {employeeService} from "../../service/EmployeeService.js";
import {Badge} from "@chakra-ui/react";


export function EmployeePage() {
    return (
        <Pageable
            loader={async (pageable) => {
                return employeeService.getAllColleague('', false, pageable);
            }}
            breadcromb={
                <MyBreadcrumb paths={[
                    {
                        name: 'Домашняя страница',
                        url: '/'
                    },
                    {
                        name: 'Сотрудники'
                    }
                ]}/>}
            columns={[
                {
                    name: 'ID',
                    fieldName: 'id',
                    getValue: (row) => row.id,
                    defaultSort: 'asc'
                },
                {
                    name: 'Название',
                    fieldName: 'firstName, lastName',
                    disabledSort: true,
                    getValue: (row) => row.lastName + ' ' + row.firstName
                },
                {
                    name: 'Адрес',
                    fieldName: 'email',
                    disabledSort: false,
                    getValue: (row) => row.email
                },
                {
                    name: 'Статус',
                    fieldName: 'status',
                    disabledSort: false,
                    getValue: (row) => {
                        if (row.retired)
                            return <Badge colorScheme='red'>Уволен</Badge>
                        if (row.notConfirmed)
                            return <Badge colorScheme='yellow'>Приглашен</Badge>
                        return <Badge colorScheme='green'>Активен</Badge>
                    }
                }
            ]}
            label='Сотрудники'
            baseUrl={routes.employees}
        />
    )
}

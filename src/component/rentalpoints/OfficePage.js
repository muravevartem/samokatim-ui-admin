import React from "react";
import {MyBreadcrumb, Pageable} from "../components.js";
import {routes} from "../../routes.js";
import {officeService} from "../../service/OfficeService.js";


export function OfficePage() {
    return (
        <Pageable
            loader={async (pageable) => {
                return officeService.getAllMy(pageable);
            }}
            breadcromb={
                <MyBreadcrumb paths={[
                    {
                        name: 'Домашняя страница',
                        url: '/'
                    },
                    {
                        name: 'Офисы'
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
                    fieldName: 'alias',
                    getValue: (row) => row.alias
                },
                {
                    name: 'Адрес',
                    fieldName: 'address',
                    disabledSort: true,
                    getValue: (row) => row.address
                }
            ]}
            label='Офисы проката'
            baseUrl={routes.offices}
        />
    )
}

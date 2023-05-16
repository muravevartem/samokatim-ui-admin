import React from "react";
import {MyBreadcrumb, Pageable} from "../components.js";
import {routes} from "../../routes.js";
import {officeService} from "../../service/OfficeService.js";
import {employeeService} from "../../service/EmployeeService.js";
import {equipmentService} from "../../service/EquipmentService.js";
import {EquipmentLogo} from "./InventoryModel.js";
import {inventoryColorStatus, inventoryStatus, inventoryType} from "../../util.js";
import {Badge} from "@chakra-ui/react";


export function InventoryPage() {
    return (
        <Pageable
            loader={async (pageable) => {
                return equipmentService.getAllMy(pageable);
            }}
            breadcromb={
                <MyBreadcrumb paths={[
                    {
                        name: 'Домашняя страница',
                        url: '/'
                    },
                    {
                        name: 'Инвентарь'
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
                    disabledSort: false,
                    getValue: (row) => row.alias
                },
                {
                    name: 'Модель',
                    fieldName: 'model.name',
                    disabledSort: true,
                    getValue: (row) => row.model.name
                },
                {
                    name: 'Тип',
                    fieldName: 'model.type',
                    disabledSort: true,
                    getValue: (row) => inventoryType[row.model.type]
                },
                {
                    name: 'Статус',
                    fieldName: 'status',
                    disabledSort: false,
                    getValue: (row) =>
                        <Badge colorScheme={inventoryColorStatus[row.status]}>
                            {inventoryStatus[row.status]}
                        </Badge>
                }
            ]}
            baseUrl={routes.inventories}
        />
    )
}

import {MyBreadcrumb, Pageable} from "../components.js";
import {rentService} from "../../service/RentService.js";
import {Badge} from "@chakra-ui/react";
import moment from "moment";
import {routes} from "../../routes.js";
import React from "react";

export const rentStatus = {
    STARTING: {
        label: 'Начало',
        color: 'blue'
    },
    ACTIVE: {
        label: 'Активна',
        color: 'green'
    },
    CANCELED: {
        label: 'Отмена',
        color: 'yellow'
    },
    COMPLETED: {
        label: 'Успешно',
        color: 'gray'
    },
    UNPAID: {
        label: 'Не оплачено',
        color: 'red'
    }
}

export const paymentStatus = {
    CREATING: {
        label: 'Создан',
        color: 'blue'
    },
    PENDING: {
        label: 'Ожидает клиента',
        color: 'yellow'
    },
    CONFIRMED: {
        label: 'Подтвержден клиентом',
        color: 'purple'
    },
    COMPLETED: {
        label: 'Успешно',
        color: 'gray'
    },
    CANCELED: {
        label: 'Отменен',
        color: 'red'
    }
}

export const depositStatus = {
    CREATING: {
        label: 'Создан',
        color: 'blue'
    },
    PENDING: {
        label: 'Ожидает клиента',
        color: 'yellow'
    },
    HOLD: {
        label: 'Удержан',
        color: 'purple'
    },
    REFUNDING: {
        label: 'Ожидает возврата',
        color: 'pink'
    },
    REFUNDED: {
        label: 'Успешно',
        color: 'gray'
    },
    CANCELED: {
        label: 'Отменен',
        color: 'red'
    }
}

export function FinancialPage() {
    return (
        <Pageable
            notAddable
            loader={pageable => rentService.getMyAll(pageable)}
            breadcromb={
                <MyBreadcrumb paths={[
                    {
                        name: 'Домашняя страница',
                        url: '/'
                    },
                    {
                        name: 'Финансы'
                    }
                ]}/>
            }
            baseUrl={routes.financials}
            columns={[
                {
                    name: 'ID',
                    fieldName: 'id',
                    getValue: (row) => row.id,
                    defaultSort: 'asc'
                },
                {
                    name: 'Начало',
                    fieldName: 'startTime',
                    getValue: row => `${moment(row.startTime).format('lll')}`
                },
                {
                    name: 'Завершение',
                    fieldName: 'endTime',
                    getValue: row => `${moment(row.endTime).format('lll')}`
                },
                {
                    name: 'Статус',
                    fieldName: 'status',
                    getValue: (row) =>
                        <Badge colorScheme={rentStatus[row.status].color}>
                            {rentStatus[row.status].label}
                        </Badge>
                },
                {
                    name: 'Платеж',
                    fieldName: 'price',
                    getValue: (row) => `${row.cheque?.price?.toFixed(2) ?? '-'} ₽`
                },
                {
                    name: 'Статус платежа',
                    fieldName: 'cheque.status',
                    getValue: (row) =>
                        <Badge colorScheme={paymentStatus[row.cheque?.status]?.color}>
                            {paymentStatus[row.cheque?.status]?.label ?? '-'}
                        </Badge>
                },
                {
                    name: 'Депозит',
                    fieldName: 'deposit.price',
                    getValue: row => `${row.deposit.price} ₽`
                },
                {
                    name: 'Статус депозита',
                    fieldName: 'deposit.status',
                    getValue: (row) =>
                        <Badge colorScheme={depositStatus[row.deposit.status].color}>
                            {depositStatus[row.deposit.status].label}
                        </Badge>
                }
            ]}
        />
    )
}

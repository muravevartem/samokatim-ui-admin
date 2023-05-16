import {useParams} from "react-router-dom";
import {rentService} from "../../service/RentService.js";
import React, {useEffect, useState} from "react";
import {Alert, AlertIcon, Badge, Box, Center, HStack, Link, Spinner, Stack, Text, VStack} from "@chakra-ui/react";
import {MyBreadcrumb} from "../components.js";
import {routes} from "../../routes.js";
import {depositStatus, paymentStatus, rentStatus} from "./FinancialPage.js";
import moment from "moment";
import {MapContainer, Polyline, TileLayer} from "react-leaflet";
import {toLastPoint} from "../../util.js";

export function FinancialOnePage() {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    let {id} = useParams();

    async function load() {
        let rent = await rentService.getOne(id);
        setData(rent);
        setLoading(false);
    }

    useEffect(() => {
        load()
    }, [])

    if (loading)
        return (
            <Center p={5} minH='100vh'>
                <Spinner/>
            </Center>
        )

    return (
        <Stack p={4}>
            <MyBreadcrumb paths={[
                {
                    name: 'Домашняя страница',
                    url: routes.home
                },
                {
                    name: 'Аренды',
                    url: routes.financials
                },
                {
                    name: id
                }
            ]}/>
            {(data.track ?? []).length === 0 &&
                <Alert>
                    <AlertIcon/>
                    Не зафиксировано перемещение
                </Alert>
            }
            {(data.track ?? []).length > 0 &&
                <Box h={600} maxH='100vh' w='100%'>
                    <MapContainer
                        zoomControl={false}
                        scrollWheelZoom={true}
                        center={toLastPoint(data.track)}
                        zoom={13}
                        style={{width: '100%', height: '100%'}}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Polyline pathOptions={{color: 'indigo', weight: 5}}
                                  positions={(data.track ?? []).map(point => [point.lat, point.lng])}/>
                    </MapContainer>
                </Box>
            }

            <Center spacing={2}>
                <HStack alignItems='start' gap={4}>
                    <Stack>
                        <Text fontWeight='extrabold' fontSize='xl'>Аренда #{id}</Text>
                        {data.startTime && <VStack alignItems='start'>
                            <Text fontWeight='bolder'>Начало</Text>
                            <Badge>
                                {moment(data.startTime).format('lll')}
                            </Badge>
                        </VStack>}
                        {data.endTime && <VStack alignItems='start'>
                            <Text fontWeight='bolder'>Завершена</Text>
                            <Badge>
                                {moment(data.endTime).format('lll')}
                            </Badge>
                        </VStack>}
                        {data.endTime && <VStack alignItems='start'>
                            <Text fontWeight='bolder'>Продолжительность</Text>
                            <Badge>
                                {moment(data.endTime).diff(data.startTime, 'minute')} мин
                            </Badge>
                        </VStack>}
                        <VStack alignItems='start'>
                            <Text fontWeight='bolder'>Статус</Text>
                            <Badge colorScheme={rentStatus[data.status]?.color}>
                                {rentStatus[data.status]?.label ?? '-'}
                            </Badge>
                        </VStack>
                    </Stack>
                    <Stack>
                        <Text fontWeight='extrabold' fontSize='xl'>Платеж</Text>
                        <VStack alignItems='start'>
                            <Text fontWeight='bolder'>Номер</Text>
                            <Badge colorScheme={paymentStatus[data.cheque?.status]?.color}>
                                {data.cheque?.bankId ?? '-'}
                            </Badge>
                        </VStack>
                        <VStack alignItems='start'>
                            <Text fontWeight='bolder'>Статус</Text>
                            <Badge colorScheme={paymentStatus[data.cheque?.status]?.color}>
                                {paymentStatus[data.cheque?.status]?.label ?? '-'}
                            </Badge>
                        </VStack>
                        <VStack alignItems='start'>
                            <Text fontWeight='bolder'>Сумма</Text>
                            <Badge>
                                {data.cheque?.price ?? '-'} ₽
                            </Badge>
                        </VStack>
                    </Stack>
                    <Stack>
                        <Text fontWeight='extrabold' fontSize='xl'>Депозит</Text>
                        <VStack alignItems='start'>
                            <Text fontWeight='bolder'>Номер</Text>
                            <Badge colorScheme={depositStatus[data.deposit?.status]?.color}>
                                {data.deposit?.bankId ?? '-'}
                            </Badge>
                        </VStack>
                        <VStack alignItems='start'>
                            <Text fontWeight='bolder'>Номер возврата</Text>
                            <Badge colorScheme={depositStatus[data.deposit?.status]?.color}>
                                {data.deposit?.refundBankId ?? '-'}
                            </Badge>
                        </VStack>
                        <VStack alignItems='start'>
                            <Text fontWeight='bolder'>Статус</Text>
                            <Badge colorScheme={depositStatus[data.deposit?.status]?.color}>
                                {depositStatus[data.deposit?.status]?.label ?? '-'}
                            </Badge>
                        </VStack>
                        <VStack alignItems='start'>
                            <Text fontWeight='bolder'>Сумма</Text>
                            <Badge>
                                {data.deposit?.price ?? '-'} ₽
                            </Badge>
                        </VStack>
                    </Stack>
                    <Stack>
                        <Text fontWeight='extrabold' fontSize='xl'>
                            Инвентарь
                        </Text>
                        <VStack alignItems='start'>
                            <Text fontWeight='bolder'>Номер</Text>
                            <Link href={`${routes.inventories}/${data.inventory?.id}`}>{data.inventory?.alias}</Link>
                        </VStack>
                        <VStack alignItems='start'>
                            <Text fontWeight='bolder'>Модель</Text>
                            <Badge>
                                {data.inventory?.model?.name ?? '-'}
                            </Badge>
                        </VStack>
                    </Stack>
                </HStack>
            </Center>
        </Stack>
    )
}

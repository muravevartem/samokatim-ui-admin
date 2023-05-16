import React, {useEffect, useState} from "react";
import {MyBreadcrumb, Pageable} from "../components.js";
import {routes} from "../../routes.js";
import {officeService} from "../../service/OfficeService.js";
import {employeeService} from "../../service/EmployeeService.js";
import {
    Badge, Box,
    Button,
    ButtonGroup,
    Center, Container, Divider, Editable, EditableInput, EditablePreview,
    FormControl,
    FormLabel,
    HStack,
    Input,
    InputGroup, Spinner,
    Stack,
    Text, useToast, VStack
} from "@chakra-ui/react";
import {useNavigate, useParams} from "react-router-dom";
import {errorConverter} from "../../error/ErrorConverter.js";
import moment from "moment/moment.js";
import {rentStatus} from "../financial/FinancialPage.js";
import isEmail from "validator/es/lib/isEmail.js";
import isEmpty from "validator/es/lib/isEmpty.js";


export function EmployeeOnePage() {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);

    let toast = useToast();
    let navigate = useNavigate();

    let {id} = useParams();

    async function load() {
        let employee = await employeeService.getOne(id);
        setData({
            ...employee,
            original: true
        });
        setLoading(false);
    }

    async function upload() {
        try {
            await employeeService.update(id, data);
            toast({
                status: 'success',
                title: 'Изменения успешно сохранены'
            });
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        }
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
            <MyBreadcrumb
                paths={[
                    {
                        name: 'Домашняя страница',
                        url: routes.home
                    },
                    {
                        name: 'Сотрудники',
                        url: routes.employees
                    },
                    {
                        name: `${data.lastName} ${data.firstName}`
                    }
                ]}/>
            <div style={{height: 30}}/>
            <Stack>
                <Center spacing={2}>
                    <Stack minW={200} p={2}>
                        <Text fontWeight='extrabold' fontSize='xl'>Профиль</Text>
                        <Stack divider={<Divider/>}>
                            <VStack alignItems='start' spacing={0}>
                                <Text fontWeight='bolder'>Имя</Text>
                                <Editable placeholder='Имя'
                                          onChange={nextValue => setData({...data, firstName: nextValue, original: false})}
                                          value={data.firstName}
                                          fontWeight='extrabold'>
                                    <EditablePreview/>
                                    <EditableInput/>
                                </Editable>
                            </VStack>
                            <VStack alignItems='start' spacing={0}>
                                <Text fontWeight='bolder'>Фамилия</Text>
                                <Editable placeholder='Имя'
                                          onChange={nextValue => setData({...data, lastName: nextValue, original: false})}
                                          value={data.lastName}
                                          fontWeight='extrabold'>
                                    <EditablePreview/>
                                    <EditableInput/>
                                </Editable>
                            </VStack>
                            <VStack alignItems='start' spacing={0}>
                                <Text fontWeight='bolder'>Адрес электронной почты</Text>
                                <Editable placeholder='Имя'
                                          onChange={nextValue => setData({...data, email: nextValue, original: false})}
                                          value={data.email}
                                          fontWeight='extrabold'>
                                    <EditablePreview/>
                                    <EditableInput/>
                                </Editable>
                            </VStack>
                            <VStack alignItems='start' spacing={0}>
                                <Text fontWeight='bolder'>Статус</Text>
                                <Box p={1}>
                                    {employeeStatus(data)}
                                </Box>
                            </VStack>
                        </Stack>
                        <HStack justifyContent='center'>
                            <Button
                                onClick={upload}
                                isDisabled={
                                data.original
                                || !isEmail(data.email)
                                || isEmpty(data.firstName)
                                || isEmpty(data.lastName)}>
                                Сохранить
                            </Button>
                        </HStack>
                    </Stack>
                </Center>
            </Stack>
        </Stack>
    )
}


function employeeStatus(employee) {
    {
        if (employee.retired)
            return <Badge colorScheme='red'>Уволен</Badge>
        if (employee.notConfirmed)
            return <Badge colorScheme='yellow'>Приглашен</Badge>
        return <Badge colorScheme='green'>Активен</Badge>
    }
}

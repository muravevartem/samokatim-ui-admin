import React, {useState} from "react";
import {MyBreadcrumb, Pageable} from "../components.js";
import {routes} from "../../routes.js";
import {officeService} from "../../service/OfficeService.js";
import {employeeService} from "../../service/EmployeeService.js";
import {
    Button,
    ButtonGroup,
    Center,
    FormControl,
    FormLabel,
    HStack,
    Input,
    InputGroup,
    Stack,
    Text, useToast
} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {errorConverter} from "../../error/ErrorConverter.js";


export function EmployeeRegistrationPage() {
    const [state, setState] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    let toast = useToast();
    let navigate = useNavigate();

    async function upload() {
        try {
            setLoading(true)
            await employeeService.create(state);
            navigate(routes.employees);
        } catch (e) {
            setLoading(false);
            toast(errorConverter.convertToToastBody(e))
        }
    }

    return (
        <Stack p={4}>
            <MyBreadcrumb paths={[
                {
                    name: 'Домашняя страница',
                    url: '/'
                },
                {
                    name: 'Сотрудники',
                    url: '/employees'
                },
                {
                    name: 'Регистрация'
                }
            ]}/>
            <Center minH='100vh'>
                <Stack>
                    <Text textAlign='center' fontSize='2xl' fontWeight='extrabold' color='brand.600'>
                        Регистрация сотрудника
                    </Text>
                    <div style={{height: 30}}/>
                    <Stack>
                        <FormControl>
                            <FormLabel>Имя</FormLabel>
                            <InputGroup>
                                <Input value={state.firstName}
                                       bgColor='white'
                                       fontWeight='bolder'
                                       onChange={e =>
                                           setState({...state, firstName: e.target.value})}/>
                            </InputGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Фамилия</FormLabel>
                            <InputGroup>
                                <Input value={state.lastName}
                                       bgColor='white'
                                       fontWeight='bolder'
                                       onChange={e =>
                                           setState({...state, lastName: e.target.value})}/>
                            </InputGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Адрес электронной почты</FormLabel>
                            <InputGroup>
                                <Input value={state.email}
                                       bgColor='white'
                                       fontWeight='bolder'
                                       onChange={e =>
                                           setState({...state, email: e.target.value})}/>
                            </InputGroup>
                        </FormControl>
                        <div style={{height: 30}}/>
                        <HStack justifyContent='center'>
                            <ButtonGroup>
                                <Button onClick={() => navigate(routes.employees)}>
                                    Отмена
                                </Button>
                                <Button colorScheme='brand'
                                        isDisabled={loading}
                                        onClick={upload}>
                                    Пригласить
                                </Button>
                            </ButtonGroup>
                        </HStack>
                    </Stack>
                </Stack>
            </Center>
        </Stack>
    )
}

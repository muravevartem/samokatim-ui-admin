import React, {useEffect, useState} from "react";
import {
    Badge,
    Button,
    ButtonGroup,
    Center,
    FormControl,
    FormLabel, HStack, IconButton,
    Input,
    InputGroup, InputRightAddon, InputRightElement, Link,
    Select,
    Stack,
    Text, useToast,
    VStack
} from "@chakra-ui/react";
import {IoMdSearch} from "react-icons/io";
import moment from "moment";
import {EquipmentLogo} from "./inventory/InventoryModel";
import {useNavigate} from "react-router-dom";
import {rentService} from "../service/RentService";
import {errorConverter} from "../error/ErrorConverter";
import {routes} from "../routes";
import {officeService} from "../service/OfficeService";
import isNumeric from "validator/es/lib/isNumeric.js";

export function StopRentPage() {
    let [state, setState] = useState({
        rentId: '',
        cause: 'BY_CLIENT'
    });
    let navigate = useNavigate();

    let toast = useToast();

    async function searchRent() {
        try {
            let rentId = state.rentId;
            if (!isNumeric(rentId)) {
                toast({
                    status: 'error',
                    title: 'Не валидный номер аренды'
                })
                setState({
                    ...state,
                    rent: undefined
                })
                return;
            }
            let rent = await rentService.getOne(rentId);
            if (rent.status !== 'ACTIVE') {
                toast({
                    status: 'error',
                    title: 'Аренда не активна'
                })
                return;
            }
            setState({
                ...state,
                rent: rent
            })
        } catch (e) {
            setState({
                ...state,
                rent: undefined
            })
            toast(errorConverter.convertToToastBody(e))
        }
    }

    async function loadOffices() {
        try {
            let officePage = await officeService.getAllMy({
                page: 0,
                size: 100000,
                sort: 'alias,asc'
            });
            setState({
                ...state,
                offices: officePage.content
            })
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        }
    }

    useEffect(() => {
        loadOffices()
    }, [])

    async function stopRent() {
        try {
            await rentService.stop(state.rent.id,{
                cause: state.cause,
                officeId: state.officeId
            })
            toast({
                status: 'success',
                title: 'Завершение аренды подтверждено',
                description: 'Клиенту необходимо оплатить аренду'
            })
            navigate(routes.home)
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        }
    }


    return (
        <Center>
            <VStack>
                <Text color='brand.600' fontSize='2xl' fontWeight={'extrabold'}>
                    Завершение аренды
                </Text>
                <FormControl>
                    <FormLabel>
                        Номер аренды
                    </FormLabel>
                    <InputGroup>
                        <Input bgColor='white'
                               value={state.rentId}
                               onKeyUp={event => {
                                   if (event.key === 'Enter')
                                       searchRent();
                               }}
                               onChange={e =>
                                   setState({
                                       ...state,
                                       rentId: e.target.value
                                   })}/>
                        <InputRightElement>
                            <IconButton aria-label={'search'}
                                        onClick={searchRent}
                                        size='sm'
                                        icon={<IoMdSearch/>}/>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>
                {state.rent &&
                    <>
                        <HStack w='100%' p={2} bgColor='white' borderRadius='15'
                                onClick={() => navigate(`/inventories/${state.rent.inventory.id}`)}>
                            <Center bgColor="brand.600" color='brand.100' p={2} rounded={10}>
                                <EquipmentLogo type={state.rent.inventory.model.type} size={32}/>
                            </Center>
                            <Stack spacing={0}>
                                <Text color='brand.600'
                                      fontSize="2xl"
                                      textAlign='start'
                                      fontWeight="extrabold">
                                    {state.rent.inventory.model.name}
                                </Text>
                                <HStack spacing={1}>
                                    <Text fontSize="md"
                                          textAlign='start'>
                                        {state.rent.inventory.alias}
                                    </Text>
                                </HStack>
                            </Stack>
                        </HStack>
                        <FormControl>
                            <FormLabel>
                                Начало аренды
                            </FormLabel>
                            <Text>
                                {moment(state.rent.startTime).format('lll')}
                            </Text>
                        </FormControl>
                        <FormControl>
                            <FormLabel>
                                Тариф
                            </FormLabel>
                            <HStack>
                                <Badge colorScheme='brand'>
                                    {state.rent.tariff.alias}
                                </Badge>
                            </HStack>
                        </FormControl>
                        <Link href={`${routes.financials}/${state.rent.id}`}>Подробнее</Link>
                        <FormControl>
                            <FormLabel>
                                Причина завершения
                            </FormLabel>
                            <InputGroup>
                                <Select bgColor='white'
                                        value={state.cause}
                                        onChange={e =>
                                            setState({
                                                ...state,
                                                cause: e.target.value
                                            })}>
                                    <option value="BY_CLIENT">По заявлению клиента</option>
                                    <option value="EMERGENCY">Экстренное завершение</option>
                                    <option value="CRASH">Поломка</option>
                                </Select>
                            </InputGroup>
                        </FormControl>
                        {state.cause === 'BY_CLIENT' &&
                            <FormControl>
                                <FormLabel>
                                    Пункт проката
                                </FormLabel>
                                <InputGroup>
                                    <Select bgColor='white'
                                            value={state.officeId}
                                            onChange={e => setState({
                                                ...state,
                                                officeId: e.target.value
                                            })}>
                                        {(state?.offices ?? []).map(office => (
                                            <option key={office.id}
                                                    value={office.id}>
                                                {office.alias}
                                            </option>
                                        ))}
                                    </Select>
                                </InputGroup>
                            </FormControl>
                        }
                    </>
                }
                <ButtonGroup>
                    <Button colorScheme='gray'>
                        Отмена
                    </Button>
                    <Button colorScheme='brand'
                            isDisabled={!state.rent}
                            onClick={stopRent}>
                        Завершить
                    </Button>
                </ButtonGroup>
            </VStack>
        </Center>
    )
}
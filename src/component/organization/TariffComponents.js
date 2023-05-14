import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Card,
    CardHeader,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputRightAddon,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    SimpleGrid,
    Stack,
    Tag,
    Text,
    useDisclosure,
    useToast,
    VStack
} from "@chakra-ui/react";
import {Select} from "chakra-react-select"
import {tariffType, tariffUnit} from "../../util.js";
import {IoMdAdd, IoMdCash, IoMdConstruct, IoMdTrash} from "react-icons/io";
import React, {useEffect, useState} from "react";
import isNumeric from "validator/es/lib/isNumeric.js";
import {organizationService} from "../../service/OrganizationService.js";
import {errorConverter} from "../../error/ErrorConverter.js";
import {equipmentService} from "../../service/EquipmentService.js";
import isEmpty from "validator/es/lib/isEmpty.js";
import {DaysOfWeek} from "../util.js";

export function TariffItemInfo({tariff, onChange}) {
    let [state, setState] = useState();
    const [loading, setLoading] = useState(false);
    let toast = useToast();
    let {isOpen, onOpen, onClose} = useDisclosure();

    async function deleteTariff() {
        try {
            setLoading(true);
            let changed = await organizationService.deleteTariff(tariff);
            onChange(changed)
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        } finally {
            setLoading(false);
        }
    }

    async function changeTariff() {
        try {
            setLoading(true);
            let changed = await organizationService.changeTariff({
                id: state.id,
                type: state.type.value,
                price: state.price,
                initialPrice: state.initialPrice,
                deposit: state.deposit,
                alias: state.alias
            });
            onChange(changed)
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        } finally {
            setLoading(false);
        }
    }

    function openEditMode() {
        setState({
            id: tariff.id,
            alias: tariff.alias,
            type: {
                value: tariff.type,
                label: tariffType[tariff.type]
            },
            price: tariff.price.toString(),
            initialPrice: tariff.initialPrice.toString(),
            deposit: tariff.deposit.toString(),
            days: tariff.days.map(day => ({
                value: day,
                label: DaysOfWeek[day]
            }))
        })
        onOpen();
    }

    if (isOpen) {
        return (
            <TariffInput state={state}
                         setState={setState}
                         loading={loading}
                         isOpen={isOpen}
                         onClose={onClose}
                         edit={true}
                         sendTariff={changeTariff}/>
        )
    }


    return (
        <Card w='max-content' p={2} minH={300} w='100%' maxW={400}>
            <CardHeader fontSize='xl'
                        p={1}
                        fontWeight='extrabold'
            >
                <Stack>
                    <HStack justifyContent='space-between'>
                        <Text>
                            {tariff.alias}
                        </Text>
                        <HStack>
                            <IconButton aria-label='modify'
                                        size='sm'
                                        onClick={openEditMode}
                                        icon={<IoMdConstruct/>}/>
                            <IconButton aria-label='delete'
                                        colorScheme='pink'
                                        size='sm'
                                        onClick={deleteTariff}
                                        icon={<IoMdTrash/>}/>
                        </HStack>
                    </HStack>
                    <Tag size='sm' w='max-content'>
                        {tariffType[tariff.type]}
                    </Tag>
                    <HStack wrap='wrap' gap={2} spacing={0}>
                        {(tariff.days??[]).map(day => (
                            <Tag colorScheme='brand'>{DaysOfWeek[day]}</Tag>
                        ))}
                    </HStack>
                </Stack>
            </CardHeader>
            <SimpleGrid columns={[null, 2]} gap={2}>
                <Stack spacing={0} p={2} bgColor='whitesmoke' rounded={10}>
                    <Text fontWeight='bolder'>Стоимость</Text>
                    <Text fontSize='md' fontWeight='extrabold' color='brand.600'>
                        {tariff.price.toFixed(2)} {tariffUnit[tariff.type]}
                    </Text>
                </Stack>
                {tariff.deposit &&
                    <Stack spacing={0} p={2} bgColor='whitesmoke' rounded={10}>
                        <Text fontWeight='bolder'>Депозит</Text>
                        <Text fontSize='md' fontWeight='extrabold' color='brand.600'>
                            {tariff.deposit.toFixed(2)} ₽
                        </Text>
                    </Stack>
                }
                {tariff.initialPrice &&
                    <Stack spacing={0} p={2} bgColor='whitesmoke' rounded={10}>
                        <Text fontWeight='bolder'>Начальная стоимость</Text>
                        <Text fontSize='md' fontWeight='extrabold' color='brand.600'>
                            {tariff.initialPrice.toFixed(2)} ₽
                        </Text>
                    </Stack>
                }
            </SimpleGrid>

        </Card>
    )
}

export function TariffAddButton({value, onChange}) {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState({
        type: '',
        price: '',
        initialPrice: '',
        deposit: '',
        alias: '',
        days: []
    });
    let toast = useToast();



    async function sendTariff() {
        try {
            setLoading(true);
            let changed = await organizationService.addTariff({
                type: state.type.value,
                price: state.price,
                initialPrice: state.initialPrice,
                deposit: state.deposit,
                alias: state.alias,
                days: state.days.map(day => day.value)
            });
            onClose();
            onChange(changed)
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        } finally {
            setLoading(false);
        }
    }


    return (
        <>
            <IconButton aria-label='Add tariff'
                        colorScheme='brand'
                        onClick={onOpen}
                        size='sm'
                        icon={<IoMdAdd/>}
                        isRound/>
            <TariffInput state={state}
                         setState={setState}
                         loading={loading}
                         isOpen={isOpen}
                         onClose={onClose}
                         sendTariff={sendTariff}/>
        </>
    )
}

function TariffInput({state, setState, isOpen, onClose, sendTariff, loading, edit}) {

    let days = Object.keys(DaysOfWeek);
    let tariffTypeOptions = Object.keys(tariffType).map(tariff => ({
        value: tariff,
        label: tariffType[tariff]
    }));
    let tariffDayOptions = Object.keys(DaysOfWeek).map(day => ({
        value: day,
        label: DaysOfWeek[day]
    }));

    return (
        <AlertDialog
            isOpen={isOpen}
            onClose={onClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        {edit ? 'Редактирование тарифа' : 'Добавление тарифа'}
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        <Stack>
                            <FormControl isInvalid={isEmpty(state.alias)}>
                                <FormLabel>Название</FormLabel>
                                <InputGroup>
                                    <Input value={state.alias}
                                           onChange={e => setState({...state, alias: e.target.value})}/>
                                </InputGroup>
                                <FormErrorMessage>Название не должно быть пустым</FormErrorMessage>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Тип</FormLabel>
                                <Select value={state.type}
                                        placeholder='Тип'
                                        colorScheme='brand'
                                        options={tariffTypeOptions}
                                        onChange={e => setState({...state, type: e})}/>
                                <FormHelperText>
                                    От этого будут зависить правила тарификации
                                </FormHelperText>
                            </FormControl>
                            <FormControl
                                isInvalid={!isNumeric(state.price) || Number.parseFloat(state.price) < 0.01}>
                                <FormLabel>Стоимость</FormLabel>
                                <InputGroup>
                                    <Input type='number'
                                           value={state.price}
                                           onChange={e => setState({...state, price: e.target.value})}/>
                                    <InputRightAddon>
                                        {tariffUnit[state.type.value]}
                                    </InputRightAddon>
                                </InputGroup>
                                <FormErrorMessage>Стоимость должна быть больше 0</FormErrorMessage>
                            </FormControl>
                            {state.type?.value === 'MINUTE_BY_MINUTE' &&
                                <FormControl
                                    isInvalid={!isNumeric(state.initialPrice) || Number.parseFloat(state.initialPrice) < 0.01}>
                                    <FormLabel>Начальная стоимость</FormLabel>
                                    <InputGroup>
                                        <Input type='number'
                                               value={state.initialPrice}
                                               onChange={e => setState({...state, initialPrice: e.target.value})}/>
                                        <InputRightAddon>
                                            ₽
                                        </InputRightAddon>
                                    </InputGroup>
                                    <FormErrorMessage>Стоимость должна быть больше 0</FormErrorMessage>
                                </FormControl>
                            }
                            {/*<FormControl*/}
                            {/*    isInvalid={state.days.length === 0}>*/}
                            {/*    <FormLabel>Расписание</FormLabel>*/}
                            {/*    <Select*/}
                            {/*        value={state.days}*/}
                            {/*        colorScheme='brand'*/}
                            {/*        isMulti*/}
                            {/*        onChange={(newValue) => setState({*/}
                            {/*            ...state,*/}
                            {/*            days: newValue.sort((a, b) => days.indexOf(a.value) - days.indexOf(b.value))*/}
                            {/*        })}*/}
                            {/*        options={tariffDayOptions}*/}
                            {/*        placeholder='Дни'*/}
                            {/*    />*/}
                            {/*    <FormErrorMessage>Стоимость должна быть больше 0</FormErrorMessage>*/}
                            {/*</FormControl>*/}
                            <FormControl
                                isInvalid={!isNumeric(state.deposit) || Number.parseFloat(state.deposit) < 0.01}>
                                <FormLabel>Депозит</FormLabel>
                                <InputGroup>
                                    <Input type='number'
                                           value={state.deposit}
                                           onChange={e => setState({...state, deposit: e.target.value})}/>
                                    <InputRightAddon>
                                        ₽
                                    </InputRightAddon>
                                </InputGroup>
                                <FormErrorMessage>Стоимость должна быть больше 0</FormErrorMessage>
                            </FormControl>
                        </Stack>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button onClick={onClose}
                                isDisabled={loading}>
                            Отмена
                        </Button>
                        <Button colorScheme='brand'
                                onClick={sendTariff}
                                ml={3}
                                isDisabled={loading || !isNumeric(state.price) || Number.parseFloat(state.price) < 0.01 || state.alias === ''}>
                            {edit ? 'Сохранить' : 'Добавить'}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}

export function TariffItem({tariff, value, onChange}) {
    const [loading, setLoading] = useState(false);
    let toast = useToast();
    const {isOpen, onToggle, onClose} = useDisclosure()

    async function deleteItem() {
        try {
            setLoading(true)
            let equip = await equipmentService.deleteTariff(value.id, tariff.id);
            onChange(equip);
            onToggle()
        } catch (e) {
            toast(errorConverter.convertToToastBody(e));
        } finally {
            setLoading(false);
        }
    }

    return (
        <Popover placement='top'
                 onClose={onClose}
                 closeOnBlur={false}
                 isOpen={isOpen}>
            <PopoverTrigger>
                <Tag bgGradient="linear(to-l, #7928CA,#FF0080)"
                     color='white'
                     cursor={'pointer'}
                     p={2}
                     fontSize="xl"
                     textAlign='center'
                     onClick={onToggle}
                     fontWeight="extrabold">
                    {tariff.alias}
                </Tag>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow/>
                <PopoverCloseButton/>
                <PopoverHeader>
                    <Text fontWeight='bold'>{tariff.alias}</Text>
                </PopoverHeader>
                <PopoverBody>
                    <VStack w='100%' alignItems='start'>
                        <HStack w='100%'>
                            <IoMdCash/>
                            <Text>{tariff.price} {tariffUnit[tariff.type]}</Text>
                        </HStack>
                        <IconButton aria-label='delete'
                                    colorScheme='red'
                                    onClick={deleteItem}
                                    icon={<IoMdTrash/>}
                                    size='sm'/>
                    </VStack>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}

export function TarriffSelection({value, onChange}) {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState();
    const [info, setInfo] = useState([]);
    let toast = useToast();

    async function loadTariffs() {
        try {
            setLoading(true);
            let tariffs = await organizationService.getTariffs();
            setInfo(tariffs);
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        } finally {
            setLoading(false);
        }
    }

    async function setTariff() {
        try {
            setLoading(true);
            let changed = await equipmentService.addTariff(value.id, state.value)
            onClose();
            onChange(changed)
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTariffs()
    }, [])



    return (
        <>
            <IconButton aria-label='Add tariff'
                        colorScheme='brand'
                        onClick={onOpen}
                        size='sm'
                        icon={<IoMdAdd/>}
                        isRound/>
            <AlertDialog
                isOpen={isOpen}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='xl' textAlign='center' fontWeight='bold'>
                            Добавление тарифа
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <Stack>
                                <FormControl>
                                    <Select placeholder='Тариф'
                                            options={info.map(tariff => ({
                                                value: tariff.id,
                                                label: tariff.alias
                                            }))}
                                            value={state}
                                            onChange={e => setState(e)}>
                                    </Select>
                                    <FormHelperText>
                                        От этого будут зависить правила тарификации
                                    </FormHelperText>
                                </FormControl>
                            </Stack>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button onClick={onClose}
                                    isDisabled={loading}>
                                Отмена
                            </Button>
                            <Button colorScheme='brand'
                                    onClick={setTariff}
                                    ml={3}
                                    isDisabled={loading || !state}>
                                Добавить
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

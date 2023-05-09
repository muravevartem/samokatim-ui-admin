import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Card,
    CardBody,
    CardFooter,
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
    Select,
    Stack,
    Tag,
    Text,
    useDisclosure,
    useToast,
    VStack
} from "@chakra-ui/react";
import {tariffType, tariffUnit} from "../../util.js";
import {IoMdAdd, IoMdCash, IoMdTrash} from "react-icons/io";
import React, {useEffect, useState} from "react";
import isNumeric from "validator/es/lib/isNumeric.js";
import {organizationService} from "../../service/OrganizationService.js";
import {errorConverter} from "../../error/ErrorConverter.js";
import {equipmentService} from "../../service/EquipmentService.js";
import isEmpty from "validator/es/lib/isEmpty.js";

export function TariffItemInfo({tariff, onChange}) {
    const [loading, setLoading] = useState(false);
    let toast = useToast();

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


    return (
        <Card w='max-content' p={2}>
            <CardHeader fontSize='xl'
                        p={1}
                        fontWeight='extrabold'
            >
                {tariffType[tariff.type]}
            </CardHeader>
            <CardBody p={1}>
                <Text fontSize='2xl' fontWeight='extrabold' color='brand.600'>
                    {tariff.price.toFixed(2)} {tariffUnit[tariff.type]}
                </Text>
            </CardBody>
            <CardFooter p={1}>
                <Button size='sm' onClick={deleteTariff}>Удалить</Button>
            </CardFooter>
        </Card>
    )
}

export function TariffAddButton({value, onChange}) {
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState({
        type: 'MINUTE_BY_MINUTE',
        price: '0',
        alias: ''
    });
    let toast = useToast();


    async function sendTariff() {
        try {
            setLoading(true);
            let changed = await organizationService.addTariff(state);
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
            <AlertDialog
                isOpen={isOpen}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Добавление тарифа
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <Stack>
                                <FormControl isInvalid={isEmpty(state.alias)}>
                                    <FormLabel>Название</FormLabel>
                                    <InputGroup>
                                        <Input value={state.alias}
                                               onChange={e => setState({...state, alias: e.target.value})}/>
                                    </InputGroup>
                                    <FormErrorMessage>Назвние не должно быть пустым</FormErrorMessage>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Тип</FormLabel>
                                    <Select value={state.type}
                                            onChange={e => setState({...state, type: e.target.value})}>
                                        {Object.keys(tariffType).map(tariff =>
                                            <option value={tariff} key={tariff}>{tariffType[tariff]}</option>
                                        )}
                                    </Select>
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
                                            {tariffUnit[state.type]}
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
                                Добавить
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export function TariffItem({tariff, value, onChange}) {
    const [loading, setLoading] = useState(false);
    let toast = useToast();
    const { isOpen, onToggle, onClose } = useDisclosure()

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
                <PopoverArrow />
                <PopoverCloseButton />
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
            let changed = await equipmentService.addTariff(value.id, state)
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

    useState(() => {
        console.log(state)
    }, [state])


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
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Добавление тарифа
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <Stack>
                                <FormControl>
                                    <Select placeholder='Тип'
                                            value={state}
                                            onChange={e => setState(e.target.value)}>
                                        {info.map(tariff =>
                                            <option value={tariff.id} key={tariff.id}>{tariff.alias}</option>
                                        )}
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

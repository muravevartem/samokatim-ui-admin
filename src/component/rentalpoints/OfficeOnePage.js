import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
    Alert,
    AlertDescription,
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    AlertIcon,
    AlertTitle,
    Badge,
    Button,
    Center,
    Divider,
    FormControl,
    HStack,
    Select,
    SimpleGrid,
    Spinner,
    Stack,
    Tag,
    Text,
    useClipboard,
    useToast,
    VStack,
    Tooltip as ChakraTooltip,
    IconButton,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Input,
    FormLabel,
    InputGroup,
    Switch,
    Checkbox,
    Table,
    TableContainer,
    Thead, Tr, Th, Tbody, Td
} from "@chakra-ui/react";
import {equipmentService} from "../../service/EquipmentService.js";
import {errorConverter} from "../../error/ErrorConverter.js";
import {MapContainer, Marker, Popup, TileLayer, Tooltip} from "react-leaflet";
import moment from "moment";
import {INVENTORY_ICON} from "../icons.js";
import {inventoryColorStatus, inventoryStatus, inventoryType} from "../../util.js";
import {IoMdCreate, IoMdHome} from "react-icons/io";
import {officeService} from "../../service/OfficeService.js";
import {OfficeScheduleComponent} from "./OfficeComponents.js";
import {DaysOfWeek, ShortDaysOfWeek} from "../util";

export function OfficeOnePage() {
    let {id} = useParams();
    let [data, setData] = useState({});
    let [loading, setLoading] = useState(true);
    let toast = useToast();
    let navigate = useNavigate();

    async function loadInventory() {
        try {
            setLoading(true)
            let loaded = await officeService.getOneMy(id);
            setData(loaded)
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        loadInventory()
    }, [])

    if (loading)
        return (
            <Center p={5} minH='100vh'>
                <Spinner/>
            </Center>
        )

    return (
        <Stack p={5} divider={<Divider/>}>
            <HStack justifyContent='space-between'>
                <HStack>
                    <Text bgColor='brand.600'
                          w='max-content'
                          color='brand.100'
                          rounded={20}
                          p={4}
                          fontSize="xl"
                          textAlign='center'
                          fontWeight="extrabold">
                        <IoMdHome size={32}/>
                    </Text>
                    <Text color='brand.500'
                          p={2}
                          fontSize="4xl"
                          textAlign='center'
                          fontWeight="extrabold">
                        {data.alias}
                    </Text>
                </HStack>
            </HStack>
            <OfficeLocation office={data}/>
            <SimpleGrid columns={[null, 2, 3]} gap={4}>
                <Stack>
                    <Text fontWeight='extrabold' fontSize='2xl'>
                        Владелец
                    </Text>
                    <Stack>
                        <HStack>
                            <Text>
                                Организация
                            </Text>
                            <Badge>
                                {data.organization.name}
                            </Badge>
                        </HStack>
                        <HStack w='100%'>
                            <Text>
                                ИНН
                            </Text>
                            <Badge>
                                {data.organization.inn}
                            </Badge>
                        </HStack>
                        <HStack w='100%'>
                            <Text>
                                КПП
                            </Text>
                            <Badge>
                                {data.organization.kpp}
                            </Badge>
                        </HStack>
                    </Stack>
                </Stack>
                <Stack>
                    <Text fontWeight='extrabold' fontSize='2xl'>
                        Местоположение
                    </Text>
                    <Stack>
                        <HStack>
                            <Text>
                                Адрес
                            </Text>
                            <Badge>
                                {data.address}
                            </Badge>
                        </HStack>
                        <HStack w='100%'>
                            <Badge>
                                {data.lat.toFixed(6)} {data.lng.toFixed(6)}
                            </Badge>
                        </HStack>
                    </Stack>
                </Stack>
                <OfficeSchedule data={data} onChange={setData}/>
            </SimpleGrid>
            <Divider/>
            <InventoryTable data={data}/>
            <Divider/>

        </Stack>
    )
}

function InventoryTable({data}) {
    let navigate = useNavigate();
    return (
        <Stack spacing={4}>
            <Text textAlign='center'
                  fontWeight='extrabold'
                  fontSize='2xl'>
                Инвентарь
            </Text>
            <TableContainer bgColor='whiteAlpha.300'>
                <Table variant='unstyled'>
                    <Thead>
                        <Tr>
                            <Th textAlign='center'>
                                ID
                            </Th>
                            <Th textAlign='center'>
                                Название
                            </Th>
                            <Th textAlign='center'>
                                Модель
                            </Th>
                            <Th textAlign='center'>
                                Тип
                            </Th>
                            <Th textAlign='center'>
                                Статус
                            </Th>
                        </Tr>

                    </Thead>
                    <Tbody>
                        {data?.inventories?.map(item => (
                            <Tr key={item.id}
                                onClick={() => navigate(`/inventories/${item.id}`)}
                                _hover={{bgColor: 'purple.50'}}>
                                <Td textAlign='center' align='center'>
                                    {item.id}
                                </Td>
                                <Td textAlign='center' align='center'>
                                    {item.alias}
                                </Td>
                                <Td textAlign='center' align='center'>
                                    {item.model.name}
                                </Td>
                                <Td textAlign='center' align='center'>
                                    {inventoryType[item.model.type]}
                                </Td>
                                <Td textAlign='center' align='center'>
                                    <Badge colorScheme={inventoryColorStatus[item.status]}>
                                        {inventoryStatus[item.status]}
                                    </Badge>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Stack>
    )
}

function OfficeSchedule({data, onChange}) {
    let {isOpen, onOpen, onClose} = useDisclosure();
    let toast = useToast();

    let [schedules, setSchedules] = useState([...data.schedules] ?? []);

    async function saveChanges() {
        try {
            let office = await officeService.changeSchedule(data.id, schedules);
            onChange(office);
            onClose();
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        } finally {

        }
    }

    return (
        <>
            <Stack>
                <HStack>
                    <ChakraTooltip label="Режим работы пункта проката по местному времени">
                        <Text fontWeight='extrabold'
                              fontSize='2xl'>
                            Режим работы
                        </Text>
                    </ChakraTooltip>
                    <IconButton aria-label='modification'
                                onClick={onOpen}
                                size='sm'
                                isRound
                                icon={<IoMdCreate/>}/>
                </HStack>
                <SimpleGrid columns={[null, 2]} gap={3}>
                    {(data.schedules ?? []).map((item, index) =>
                        (<OfficeScheduleComponent
                            key={index}
                            value={item}
                        />))}
                </SimpleGrid>
            </Stack>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        Режим работы
                    </ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Stack>
                            {schedules.map((item, index, array) =>
                                <FormControl key={index}>
                                    <FormLabel>
                                        {DaysOfWeek[item.day]}
                                    </FormLabel>
                                    <HStack justifyContent='space-between'>
                                        {!item.dayOff &&
                                            <HStack w='100%'>
                                                <Input type='time'
                                                       onChange={e => {
                                                           let time = e.target.value;
                                                           array[index] = {
                                                               ...(array[index]),
                                                               start: time
                                                           };
                                                           setSchedules([...array])
                                                       }}
                                                       value={item.start}/>
                                                <Text> - </Text>
                                                <Input type='time'
                                                       onChange={e => {
                                                           let time = e.target.value;
                                                           array[index] = {
                                                               ...(array[index]),
                                                               end: time
                                                           };
                                                           setSchedules([...array])
                                                       }}
                                                       value={item.end}/>
                                            </HStack>
                                        }
                                        {item.dayOff &&
                                            <HStack w='100%'>
                                                <Text fontWeight='extrabold'
                                                      w='100%'
                                                      textAlign='center'>
                                                    Выходной
                                                </Text>
                                            </HStack>
                                        }
                                        <Checkbox size='lg'
                                                  onChange={e => {
                                                      array[index] = {
                                                          ...(array[index]),
                                                          dayOff: e.target.checked
                                                      };
                                                      setSchedules([...array])
                                                  }}
                                                  colorScheme='brand'
                                                  isChecked={item.dayOff}/>
                                    </HStack>
                                </FormControl>
                            )}
                        </Stack>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant='ghost' onClick={onClose}>
                            Отмена
                        </Button>
                        <Button colorScheme='brand' mr={3} onClick={saveChanges}>
                            Готово
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

function ModificationStatusBlock({inventory, isOpen, onClose, onUpdate}) {
    const [state, setState] = useState(inventory.status);
    const [loading, setLoading] = useState(false);

    let toast = useToast();

    async function updateStatus() {
        try {
            setLoading(true);
            let updated = await equipmentService.update(inventory.id, {status: state}, 'status');
            onUpdate(updated);
            onClose();
            toast({
                status: 'success',
                title: 'Изменения сохранены',
                description: `Статус - "${inventoryStatus[updated.status]}"`
            })
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        } finally {
            setLoading(false)
        }
    }

    return (
        <AlertDialog
            isOpen={isOpen}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Редактирование статуса
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        <Select value={state}
                                placeholder='test'
                                isDisabled={loading}
                                onChange={e => setState(e.target.value)}>
                            {Object.keys(inventoryStatus).map(x => <option value={x}
                                                                           disabled={x === 'IN_WORK'}>{inventoryStatus[x]}</option>)}
                        </Select>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button onClick={onClose}
                                isDisabled={loading}>
                            Отмена
                        </Button>
                        <Button colorScheme='brand'
                                isDisabled={loading}
                                onClick={updateStatus}
                                ml={3}>
                            Сохранить
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}

function OfficeSchedules({value, onChange}) {
    return (
        <VStack>

        </VStack>
    )
}


function OfficeLocation({office}) {
    const record = office;

    if (record && record.lat && record.lng)
        return (
            <Stack h={300} w='100%' maxH='100vh'>
                <MapContainer center={[record.lat, record.lng]}
                              zoom={13}
                              scrollWheelZoom={true}
                              style={{width: '100%', height: '100%'}}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[record.lat, record.lng]} icon={INVENTORY_ICON}>
                        <Popup permanent>
                            Я тут
                        </Popup>
                    </Marker>
                </MapContainer>
            </Stack>
        )
    if (office.supportsTelemetry)
        return (
            <Center padding={4}>
                <Alert
                    status='warning'
                    variant='subtle'
                    flexDirection='column'
                    alignItems='center'
                    justifyContent='center'
                    textAlign='center'
                    height='200px'
                    rounded={10}
                >
                    <AlertIcon boxSize='40px' mr={0}/>
                    <AlertTitle mt={4} mb={1} fontSize='lg'>
                        Отсутствуют метрики с оборудования {office.alias}
                    </AlertTitle>
                    <AlertDescription maxWidth='md'>
                        <VStack>
                            <Text>
                                Возможно оборудование ещё не инициализировало модуль телеметрии
                            </Text>
                        </VStack>
                    </AlertDescription>
                </Alert>
            </Center>
        )
    return (
        <Center padding={4}>
            <Alert
                status='info'
                variant='subtle'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                textAlign='center'
                height='200px'
                rounded={10}
            >
                <AlertIcon boxSize='40px' mr={0}/>
                <AlertTitle mt={4} mb={1} fontSize='lg'>
                    Отсутствуют метрики с оборудования {office.alias}
                </AlertTitle>
                <AlertDescription maxWidth='md'>
                    <VStack>
                        <Text>
                            Оборудование не поддерживает сбор и отправку телеметрии
                        </Text>
                    </VStack>
                </AlertDescription>
            </Alert>
        </Center>
    )
}

import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
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
    Button,
    Center,
    Divider,
    FormControl,
    HStack,
    Select,
    SimpleGrid,
    Spinner,
    Stack,
    Table,
    TableContainer,
    Tag,
    Tbody,
    Text,
    useClipboard,
    useToast,
    VStack
} from "@chakra-ui/react";
import {equipmentService} from "../../service/EquipmentService.js";
import {errorConverter} from "../../error/ErrorConverter.js";
import {EquipmentLogo} from "./InventoryModel.js";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import moment from "moment";
import {INVENTORY_ICON} from "../icons.js";
import {inventoryStatus, toEventBlock} from "../../util.js";
import {MainHeader} from "../components.js";
import {TariffItem, TarriffSelection} from "../organization/TariffComponents.js";

export function InventoryOnePage() {
    let {id} = useParams();
    let [inventory, setInventory] = useState({});
    let [loading, setLoading] = useState(true);
    let toast = useToast();

    let [isOpenStatusChange, setOpenStatusChange] = useState(false);

    async function loadInventory() {
        try {
            setLoading(true)
            let loaded = await equipmentService.getOne(id);
            setInventory(loaded)
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
            <MainHeader fixed/>
            <HStack justifyContent='space-between'>
                <HStack>
                    <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                          w='max-content'
                          color='white'
                          rounded={20}
                          p={4}
                          fontSize="xl"
                          textAlign='center'
                          fontWeight="extrabold">
                        <EquipmentLogo type={inventory.model.type} size={72}/>
                    </Text>
                    <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                          bgClip='text'
                          p={2}
                          fontSize="6xl"
                          textAlign='center'
                          fontWeight="extrabold">
                        {inventory.alias}
                    </Text>
                </HStack>
            </HStack>
            <SimpleGrid columns={[null, 2, 3]} gap={4}>
                <Field name='Владелец'
                       copyValue={inventory.organization.inn}
                       copyText={`ИНН организации скопирован`}
                       fieldValue={`${inventory.organization.name}`}
                />
                <Field name='Модель'
                       fieldValue={`${inventory.model.name}`}
                />
                <Field name='Индентификатор'
                       fieldValue={`${inventory.id}`}
                />
                <Field name='Дата регистрации'
                       fieldValue={moment(inventory.createdAt).format('LLL')}
                />
                <TariffField value={inventory} onChange={setInventory}/>
                <Field name='Статус'
                       onClick={() => {
                           if (inventory.status === 'IN_WORK') {
                               toast({
                                   status: 'error',
                                   title: 'Данное оборудование в аренде',
                                   description: 'Повторите операцию после завершения аренды'
                               })
                           } else {
                               setOpenStatusChange(true)
                           }
                       }}
                       fieldValue={inventoryStatus[inventory.status]}
                />
                <ModificationStatusBlock inventory={inventory} isOpen={isOpenStatusChange}
                                         onClose={() => setOpenStatusChange(false)}
                                         onUpdate={updated => setInventory(updated)}/>
            </SimpleGrid>
            <Divider/>
            <InventoryLocation inventory={inventory}/>
            <Divider/>
            <InventoryEventBlock inventory={inventory}/>
        </Stack>
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

function InventoryEventBlock({inventory}) {
    const events = inventory.events;

    return (
        <TableContainer>
            <Stack>
                <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                      bgClip='text'
                      p={2}
                      fontSize="3xl"
                      textAlign='center'
                      fontWeight="extrabold">
                    События
                </Text>
            </Stack>
            <Table variant='simple' size='sm'>
                <Tbody>
                    {events.map(event => toEventBlock(event))}
                </Tbody>
            < /Table>
        </TableContainer>
    )
}


function Field({name, fieldValue, copyValue, onClick, copyText}) {

    const {onCopy, hasCopied, value, setValue} = useClipboard(copyValue ? copyValue : fieldValue);

    let toast = useToast();

    return (
        <FormControl>
            <Text fontSize="xl"
                  fontWeight="bolder">
                {name}
            </Text>
            <Tag bgGradient="linear(to-l, #7928CA,#FF0080)"
                 color='white'
                 cursor={'pointer'}
                 p={2}
                 fontSize="xl"
                 textAlign='center'
                 onClick={() => {
                     if (onClick)
                         onClick()
                     else {
                         onCopy()
                         toast({
                             status: 'success',
                             title: copyText ? copyText : 'Скопировано'
                         })
                     }
                 }}
                 fontWeight="extrabold">
                {fieldValue}
            </Tag>
        </FormControl>
    )
}

function TariffField({value, onChange}) {

    return (
        <>
            <FormControl>
                <Text fontSize="xl"
                      fontWeight="bolder">
                    Тарифы
                </Text>
                <HStack wrap='wrap' gap={1} spacing={0}>
                    {value.tariffs.map(v => <TariffItem tariff={v} onChange={onChange} value={value}/>)}
                    <TarriffSelection value={value} onChange={onChange}/>
                </HStack>
            </FormControl>
        </>
    )
}


function InventoryLocation({inventory}) {
    const record = inventory.lastMonitoringRecord;

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
    if (inventory.supportsTelemetry)
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
                        Отсутствуют метрики с оборудования {inventory.alias}
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
                    Отсутствуют метрики с оборудования {inventory.alias}
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

import React, {useEffect, useState} from "react";
import {
    Button,
    Divider,
    Grid,
    GridItem,
    Heading,
    HStack,
    Link,
    SimpleGrid,
    Skeleton,
    Stack,
    Stat,
    StatArrow,
    StatDownArrow,
    StatHelpText,
    StatLabel,
    StatNumber,
    StatUpArrow,
    Tag,
    Text,
    useToast
} from "@chakra-ui/react";
import {GridBlock, IconTextButton, MainHeader} from "./components";
import {IoMdBicycle, IoMdCash, IoMdCodeWorking, IoMdLocate, IoMdPeople} from "react-icons/io";
import {MapContainer, TileLayer} from "react-leaflet";
import moment from "moment";
import {useNavigate} from "react-router-dom";
import {errorConverter} from "../error/ErrorConverter.js";
import {rentService} from "../service/RentService.js";
import {routes} from "../routes.js";
import {userService} from "../service/UserService.js";

export function OrganizationAdminPanel() {
    return (
        <Stack>
            <header>
                <MainHeader fixed/>
            </header>
            <main style={{paddingTop: 100}}>
                <AdminPanel/>
            </main>
        </Stack>
    )
}

function AdminPanel() {
    let navigate = useNavigate();
    return (
        <Stack p={5} spacing={5} divider={<Divider/>}>
            <CheckTempPassword/>
            <CompanyInfoBlock/>
            <SimpleGrid minChildWidth={250} gap={4}>
                <IconTextButton
                    onClick={() => navigate(routes.inventories)}
                    icon={<IoMdBicycle size={64}/>}
                    text='Инвентарь'
                />
                <IconTextButton
                    onClick={() => navigate(routes.offices)}
                    icon={<IoMdLocate size={64}/>}
                    text='Пункты проката'
                />
                <IconTextButton
                    onClick={() => navigate(routes.financials)}
                    icon={<IoMdCash size={64}/>}
                    text='Финансы'
                />
                <IconTextButton
                    onClick={() => navigate(routes.clients)}
                    icon={<IoMdPeople size={64}/>}
                    text='Клиенты'
                />
                <IconTextButton
                    onClick={() => navigate(routes.employees)}
                    icon={<IoMdCodeWorking size={64}/>}
                    text='Сотрудники'
                />
            </SimpleGrid>
            <SimpleGrid minChildWidth={250} gap={4}>
                <GridBlock
                    header='Статус обордования'
                    body={<EquipmentStatusBlock/>}
                />

                <GridBlock
                    header='Показатели'
                    body={<FinanceBlock/>}
                />
            </SimpleGrid>
            <MapPreviewBlock/>
            <EventBlock/>
        </Stack>
    )
}

function CheckTempPassword() {
    let [user, setUser] = useState({})
    let [loading, setLoading] = useState(true)


    let toast = useToast();

    async function loadCurrentUser() {
        try {
            setLoading(true)
            let currentUser = await userService.me();
            setUser(currentUser)
        } catch (e) {
            toast({
                status: 'error',
                title: errorConverter.convert(e)
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCurrentUser()
    }, [])

    return <></>
}

function CompanyInfoBlock() {
    let [employee, setEmployee] = useState({})
    let [loading, setLoading] = useState(true)


    let toast = useToast();

    async function loadCurrentCompany() {

    }

    useEffect(() => {
        loadCurrentCompany()
    }, [])


    return (
        <Skeleton isLoaded={!loading}>
            <Stack>
                <HStack>
                    <Heading size='lg'>{employee?.organization?.name}</Heading>
                    <Tag colorScheme='yellow'>Ожидает верификации</Tag>
                </HStack>
                <Text color='gray'>ИНН: {employee?.organization?.inn}</Text>
            </Stack>
        </Skeleton>
    )
}

function EquipmentStatusBlock() {
    return (
        <SimpleGrid columns={[6,4,2,null]} w='100%' spacing={2}>
            <Stat>
                <StatLabel>
                    В простое
                </StatLabel>
                <StatNumber>
                    10 шт
                </StatNumber>
            </Stat>
            <Stat>
                <StatLabel>
                    В аренде
                </StatLabel>
                <StatNumber>
                    10 шт
                </StatNumber>
            </Stat>
            <Stat>
                <StatLabel>
                    В ремонте
                </StatLabel>
                <StatNumber>
                    2 шт
                </StatNumber>
            </Stat>
            <Stat color='red'>
                <StatLabel>
                    Тревога
                </StatLabel>
                <StatNumber>
                    2 шт
                </StatNumber>
            </Stat>
        </SimpleGrid>
    )
}

function FinanceBlock() {
    let [stat, setStat] = useState({});
    let [loading, setLoading] = useState(true);


    let toast = useToast();

    async function loadStat() {
        try {
            setLoading(true);
            let loadedStat = await rentService.getStatMyOrganization();
            setStat(loadedStat);
        } catch (e) {
            toast({
                status: 'error',
                title: errorConverter.convert(e)
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadStat()
    }, [])


    return (
       <Skeleton isLoaded={!loading}>
           <SimpleGrid columns={[6,4,2,null]} w='100%' spacing={2}>
               <Stat>
                   <StatLabel>
                       Поездок
                   </StatLabel>
                   <StatNumber>
                       {stat?.travels?.value}
                   </StatNumber>
                   <StatHelpText>
                       <StatUpArrow/>
                       {stat?.travels?.diff}
                   </StatHelpText>
               </Stat>
               <Stat>
                   <StatLabel>
                       Выручка
                   </StatLabel>
                   <StatNumber>
                       0
                   </StatNumber>
                   <StatHelpText>
                       <StatUpArrow/>
                       0.00%
                   </StatHelpText>
               </Stat>
               <Stat>
                   <StatLabel>
                       Средняя продолжительность аренды
                   </StatLabel>
                   <StatNumber>
                       {stat?.averageDuration?.value}
                   </StatNumber>
                   <StatHelpText>
                       <StatDownArrow/>
                       {stat?.averageDuration?.diff}
                   </StatHelpText>
               </Stat>
               <Stat>
                   <StatLabel>
                       Среднее кол-во аренд
                   </StatLabel>
                   <StatNumber>
                       1
                   </StatNumber>
                   <StatHelpText>
                       <StatArrow direction='u'/>
                       0.00%
                   </StatHelpText>
               </Stat>
           </SimpleGrid>
       </Skeleton>
    )
}

function MapPreviewBlock({center, zoom}) {

    const DEFAULT_LOC = [51.533366, 46.034124]

    return (
        <Stack spacing={0}>
            <Button rounded={0} >
                Перейти к карте
            </Button>
            <Stack w='100%' h={200} maxH='100vh' rounded={5} zIndex={2}>
                <MapContainer
                    zIndex={1}
                    zoomControl={true}
                    center={center ? center : DEFAULT_LOC}
                    zoom={zoom ? zoom : 11}
                    scrollWheelZoom={true}
                    style={{width: '100%', height: '100%'}}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </MapContainer>
            </Stack>
        </Stack>
    )
}

function EventBlock() {
    let [events, setEvents] = useState([{
        id: 135,
        time: new Date(),
        message: 'Состояние оборудования неизвестно более 30 минут',
        aggrId: 1
    }]);

    return (
        <Stack>
            <HStack>
                <Heading size='md'>События</Heading>
            </HStack>
            {events.map(event => <EventRecord key={event.id} event={event}/>)}
        </Stack>
    )
}

function EventRecord({event}) {
    return (
        <Grid templateColumns='repeat(5, 1fr)'>
            <GridItem>
                {moment(event.time).format('lll')}
            </GridItem>
            <GridItem colSpan={3}>
                {event.message}
            </GridItem>
            <GridItem>
                <Link>Перейти к оборудованию</Link>
            </GridItem>
        </Grid>
    )
}

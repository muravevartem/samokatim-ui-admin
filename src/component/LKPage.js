import React, {useState} from "react";
import {
    Button, Divider, Grid,
    GridItem,
    Heading,
    HStack, Link,
    SimpleGrid,
    Stack,
    Stat, StatArrow, StatDownArrow, StatHelpText,
    StatLabel,
    StatNumber, StatUpArrow, Tag,
    Text, VStack
} from "@chakra-ui/react";
import {GridBlock, IconTextButton, MainHeader} from "./components";
import {IoMdBicycle, IoMdCash, IoMdCodeWorking, IoMdLocate, IoMdPeople, IoMdPerson} from "react-icons/io";
import {MapContainer, TileLayer} from "react-leaflet";
import moment from "moment";
import {useNavigate} from "react-router-dom";

export function LKPage() {
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
            <CompanyInfoBlock/>
            <SimpleGrid minChildWidth={250} gap={4}>
                <IconTextButton
                    icon={<IoMdBicycle size={64}/>}
                    text='Инвентарь'
                />
                <IconTextButton
                    icon={<IoMdLocate size={64}/>}
                    text='Пункты проката'
                />
                <IconTextButton
                    icon={<IoMdCash size={64}/>}
                    text='Финансы'
                />
                <IconTextButton
                    icon={<IoMdPeople size={64}/>}
                    text='Клиенты'
                />
                <IconTextButton
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

function CompanyInfoBlock() {
    return (
        <Stack>
            <HStack>
                <Heading size='lg'>ИП "ПРОКАТОФФ"</Heading>
                <Tag colorScheme='yellow'>Ожидает верификации</Tag>
            </HStack>
            <Text color='gray'>ИНН: 123456789012</Text>
        </Stack>
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
    return (
        <SimpleGrid columns={[6,4,2,null]} w='100%' spacing={2}>
            <Stat>
                <StatLabel>
                    Поездок
                </StatLabel>
                <StatNumber>
                    10
                </StatNumber>
                <StatHelpText>
                    <StatUpArrow/>
                    14.00%
                </StatHelpText>
            </Stat>
            <Stat>
                <StatLabel>
                    Выручка
                </StatLabel>
                <StatNumber>
                    10
                </StatNumber>
                <StatHelpText>
                    <StatUpArrow/>
                    14.00%
                </StatHelpText>
            </Stat>
            <Stat>
                <StatLabel>
                    Средняя продолжительность аренды
                </StatLabel>
                <StatNumber>
                    89 мин
                </StatNumber>
                <StatHelpText>
                    <StatDownArrow/>
                    3.02%
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
        time: new Date(),
        message: 'Состояние оборудования неизвестно более 30 минут',
        aggrId: 1
    }]);

    return (
        <Stack>
            <HStack>
                <Heading size='md'>События</Heading>
            </HStack>
            {events.map(event => <EventRecord event={event}/>)}
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
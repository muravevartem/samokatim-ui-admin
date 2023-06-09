import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Center,
    CircularProgress,
    HStack,
    Image,
    Stack,
    Tag,
    Text,
    useToast,
    VStack
} from "@chakra-ui/react";
import {MapContainer, TileLayer} from "react-leaflet";
import {errorConverter} from "../../error/ErrorConverter.js";
import {organizationService} from "../../service/OrganizationService.js";
import {TariffAddButton, TariffItemInfo} from "./TariffComponents.js";
import {InputImage} from "../file/FileComponents.js";
import {AppEvents, eventBus} from "../../service/EventBus.js";
import {fileService} from "../../service/FileService.js";
import {RemoteImage} from "../icons.js";
import {useNavigate} from "react-router-dom";
import {MyStatComponent} from "../StatComponents.js";
import {rentStatService} from "../../service/RentStatService.js";
import moment from "moment";

export function OrganizationPage() {
    const [state, setState] = useState();
    const [loading, setLoading] = useState(true);

    let toast = useToast();
    let navigate = useNavigate();

    async function loadOrg() {
        try {
            setLoading(true)
            let loaded = await organizationService.getMyOrg();
            setState(loaded);
        } catch (e) {
            toast(errorConverter.convertToToastBody(e));
        } finally {
            setLoading(false);
        }
    }

    async function changeAvatar(file) {
        try {
            let loaded = await organizationService.changeLogo(file)
            setState(loaded);
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        }
    }

    useEffect(() => {
        loadOrg()
        let onLogoUpdated = eventBus.on(AppEvents.LogoUploaded, changeAvatar);
        return () => {
            onLogoUpdated()
        }
    }, [])

    if (loading)
        return (
            <Center w='100%' h='100vh'>
                <CircularProgress isIndeterminate/>
            </Center>
        )

    return (
        <Stack p={4}>
            <BaseInfo org={state}/>
            <BillingInfo/>
            <TariffInfo org={state} setOrg={setState}/>
            <StatInfo org={state}/>
        </Stack>
    )
}

function BaseInfo({org}) {
    return (
        <HStack>
            <Box boxSize='100px'>
                <InputImage onUpload={file => eventBus.raise(AppEvents.LogoUploaded, file)}>
                    {org?.logo &&
                        <RemoteImage src={fileService.url(org.logo)} size='100'/>
                    }
                    {!org?.logo &&
                        <Box p={4} boxSize={100}>
                            <Image src='/picture-icon.png'/>
                        </Box>
                    }
                </InputImage>
            </Box>
            <VStack alignItems='start'>
                <Text color='brand.600'
                      fontSize="4xl"
                      textAlign='start'
                      fontWeight="extrabold">
                    {org.name}
                </Text>
                <Text bgColor='brand.600'
                      w='max-content'
                      color='white'
                      rounded={20}
                      p={2}
                      fontSize="xl"
                      textAlign='center'
                      fontWeight="extrabold">
                    {org.inn}
                </Text>
            </VStack>
        </HStack>
    )
}

function BillingInfo() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState();

    async function load() {
        try {
            setLoading(true);
            let revenue = await rentStatService.loadStat(moment().startOf('day'), moment().endOf('day'));
            setData(revenue[0]);
        } catch (e) {

        }finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load()
    },[])


    return (
        <HStack w='100%' justifyContent='center' p={2} spacing={3}>
            <Stack spacing={1} w={160} bgColor='white' p={3} rounded={10}>
                <Text fontSize='xl' color='brand.600' fontWeight='bolder'>
                    Выручка
                </Text>
                <Text fontSize='3xl' fontWeight='extrabold'>
                    {data?.moneySum??'-'} ₽
                </Text>
                <Tag colorScheme='brand' size='sm' w='max-content'>На {moment(data?.date).format('LL')}</Tag>
            </Stack>
            <Stack spacing={1} w={160} bgColor='white' p={3} rounded={10}>
                <Text fontSize='xl' color='brand.600' fontWeight='bolder'>
                    Кол-во аренд
                </Text>
                <Text fontSize='3xl' fontWeight='extrabold'>
                    {data?.amount??'-'} Шт.
                </Text>
                <Tag colorScheme='brand' size='sm' w='max-content'>На {moment(data?.date).format('LL')}</Tag>
            </Stack>
        </HStack>
    )
}

function TariffInfo({org, setOrg}) {
    return (
        <VStack>
            <Text color='brand.600'
                  fontSize="xl"
                  textAlign='start'
                  fontWeight="extrabold">
                Тарифы
            </Text>
            <HStack wrap='wrap' spacing={0} gap={3} w='100%' justifyContent='center'>
                {(org.tariffs ?? []).map(tariff => <TariffItemInfo key={tariff.id} tariff={tariff} onChange={setOrg}/>)}
                <TariffAddButton value={org} onChange={setOrg}/>
            </HStack>
        </VStack>
    )
}

function StatInfo({org}) {
    return (
        <VStack>
            <Text color='brand.600'
                  fontSize="xl"
                  textAlign='center'
                  fontWeight="extrabold">
                Статистика
            </Text>
            <div style={{height: 200, width: '80%'}}>
                <MyStatComponent
                    legendX='Дата'
                    legendY='Количество аренд'
                    loader={() => rentStatService.loadAmountStat(moment().subtract(10, 'days'), moment())}/>
            </div>
            <div style={{height: 200, width: '80%'}}>
                <MyStatComponent
                    legendX='Дата'
                    legendY='Выручка'
                    loader={() => rentStatService.loadMoneySumStat(moment().subtract(10, 'days'), moment())}/>
            </div>
        </VStack>
    )
}


function MapPreviewBlock({center, zoom}) {

    const DEFAULT_LOC = [51.533366, 46.034124]

    return (
        <Stack spacing={0}>
            <Button rounded={0}>
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

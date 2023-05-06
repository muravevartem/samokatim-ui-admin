import React, {useEffect, useState} from "react";
import {
    Button,
    ButtonGroup,
    Center,
    FormControl,
    HStack,
    Input,
    InputGroup,
    Spinner,
    Stack,
    Text,
    useToast,
    VStack
} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {routes} from "../../routes.js";
import {errorConverter} from "../../error/ErrorConverter.js";
import {MapContainer, Marker, TileLayer, useMapEvents} from "react-leaflet";
import {INVENTORY_ICON} from "../icons.js";
import {officeService} from "../../service/OfficeService.js";
import {OfficeScheduleComponent} from "./OfficeComponents.js";
import {DaysOfWeek, toOffsetTime} from "../util.js";


export function OfficeRegistrationPage() {
    const [step, setStep] = useState(0)
    const [office, setOffice] = useState({
        alias: '',
        capacity: 20,
        schedules: Object.keys(DaysOfWeek).map(day => (
            {
                day: day,
                start: toOffsetTime('08:00'),
                end: toOffsetTime('22:00')
            }
        ))
    })
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    function onPrev() {
        setStep(step - 1)
    }

    function onNext() {
        setStep(step + 1)
    }

    function onCancel() {
        navigate(routes.offices)
    }

    async function onCreate() {
        try {
            setLoading(true)
            let created = await officeService.create(office);
            toast({
                status: 'success',
                title: 'Офис проката зарегистрирован',
                description: created.address
            })
            navigate(routes.offices)
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log(office)
    }, [office])

    const steps = [
        (<StartStep onPrev={onCancel} onNext={onNext}/>),
        (<GeolocationStep onPrev={onPrev} onNext={onNext} value={office} onChange={setOffice}/>),
        (<ScheduleStep onPrev={onPrev} onNext={onNext} value={office} onChange={setOffice}/>),
        (<NameStep onPrev={onPrev} onNext={onCreate} value={office} onChange={setOffice}/>)
    ]

    return (
        <Center minH='100vh' w='100%'>
            {loading &&
                <Spinner/>
            }
            {!loading &&
                steps[step]
            }
        </Center>
    )
}

function StartStep({onPrev, onNext}) {
    return (
        <VStack spacing={10}>
            <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                  bgClip="text"
                  fontSize="3xl"
                  textAlign='center'
                  fontWeight="extrabold">
                Регистрация пункта проката
            </Text>
            <ButtonGroup>
                <Button size='lg'
                        onClick={onPrev}>
                    Отмена
                </Button>
                <Button size='lg'
                        colorScheme='brand'
                        onClick={onNext}>
                    Начать
                </Button>
            </ButtonGroup>
        </VStack>
    )
}

function GeolocationStep({onPrev, onNext, value, onChange}) {

    return (
        <VStack p={2} w='100%' h='100vh'>
            <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                  bgClip="text"
                  fontSize="3xl"
                  textAlign='center'
                  fontWeight="extrabold">
                Расположение
            </Text>
            <Stack height='70vh' w='100%'>
                <MapContainer center={value.location ? [value.location.lat, value.location.lng] : [46, 46]}
                              zoom={13}
                              scrollWheelZoom={true}
                              style={{width: '100%', height: '100%'}}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker location={value.location} onChange={v => onChange({...value, location: v})}/>
                </MapContainer>
            </Stack>
            <HStack justifyContent='center'>
                <Button onClick={onPrev}>
                    Назад
                </Button>
                <Button colorScheme='brand'
                        isDisabled={!value.location}
                        onClick={onNext}>
                    Далее
                </Button>
            </HStack>
        </VStack>
    )
}

function ScheduleStep({onPrev, onNext, value, onChange}) {

    return (
        <VStack p={10} spacing={5}>
            <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                  bgClip="text"
                  fontSize="3xl"
                  textAlign='center'
                  fontWeight="extrabold">
                Режим работы
            </Text>
            <Stack>
                {(value.schedules ?? []).map((item, index, array) =>
                    (<OfficeScheduleComponent
                        key={index}
                        value={item}
                        onChange={e => {
                            array[index] = e
                            console.log(e)
                            onChange({
                                ...value,
                                schedules: [...array]
                            })
                        }}
                    />))}
            </Stack>
            <HStack justifyContent='center'>
                <Button onClick={onPrev}>
                    Назад
                </Button>
                <Button colorScheme='brand'
                        onClick={onNext}>
                    Далее
                </Button>
            </HStack>
        </VStack>
    )
}

function NameStep({onPrev, onNext, value, onChange}) {
    return (
        <VStack p={10} spacing={5}>
            <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                  bgClip="text"
                  fontSize="3xl"
                  textAlign='center'
                  fontWeight="extrabold">
                Название
            </Text>
            <FormControl>
                <InputGroup>
                    <Input value={value.alias}
                           fontWeight='bolder'
                           w={400}
                           maxW='100%'
                           onChange={e => onChange({...value, alias: e.target.value})}/>
                </InputGroup>
            </FormControl>
            <HStack justifyContent='center'>
                <Button onClick={onPrev}>
                    Назад
                </Button>
                <Button colorScheme='brand'
                        onClick={onNext}>
                    Создать
                </Button>
            </HStack>
        </VStack>
    )
}


function beautifulInventoryClass(value) {
    if (value === 'STANDARD')
        return 'Стандартный'
    if (value === 'VANDAL_RESISTANT')
        return 'Вандалозащищенный'
    if (value === 'EXPENSIVE')
        return 'Дорогостоящий'
    return 'Неизвестно'
}

export function LocationMarker({show, location, onChange}) {

    const map = useMapEvents({
        click(e) {
            onChange(e.latlng)
        },
        locationfound(e) {
            if (!location) {
                let latlng = e.latlng;
                onChange(latlng)
                map.flyTo(latlng, map.getZoom())
            }
        },
    })

    useEffect(() => {
        map.locate();
    }, [])

    if (location)
        return (<Marker position={location} icon={INVENTORY_ICON}/>)

    return null;
}

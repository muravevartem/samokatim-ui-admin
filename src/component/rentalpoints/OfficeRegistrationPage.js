import React, {useEffect, useState} from "react";
import {
    Button,
    ButtonGroup,
    Center, Checkbox,
    FormControl, FormLabel,
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
                start: '08:00',
                end: '22:00'
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
        // console.log(office)
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
            <Text color="brand.600"
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
            <Text color="brand.600"
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

    function setSchedules(schedule) {
        onChange({
            ...value,
            schedule: schedule
        })
    }

    return (
        <VStack p={10} spacing={5}>
            <Text color="brand.600"
                  fontSize="3xl"
                  textAlign='center'
                  fontWeight="extrabold">
                Режим работы
            </Text>
            <Stack>
                {(value.schedules ?? []).map((item, index, array) =>
                    (
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
                    ))}
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
            <Text color="brand.600"
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
                map.flyTo(latlng, map.getZoom(), {animate: false})
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

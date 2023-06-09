import React, {useState} from "react";
import {
    Box,
    Button,
    ButtonGroup,
    Center,
    Divider,
    FormControl,
    FormHelperText,
    HStack,
    Select,
    Spinner,
    Switch,
    Tag,
    Text,
    useToast,
    VStack
} from "@chakra-ui/react";
import {ModelSelector} from "./InventoryModel.js";
import {useNavigate} from "react-router-dom";
import {routes} from "../../routes.js";
import {equipmentService} from "../../service/EquipmentService.js";
import {errorConverter} from "../../error/ErrorConverter.js";


export function InventoryRegistrationPage() {
    const [step, setStep] = useState(0)
    const [inventory, setInventory] = useState({
        inventoryClass: 'STANDARD',
        model: {}
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
        navigate(routes.inventories)
    }

    async function onCreate() {
        try {
            setLoading(true)
            let created = await equipmentService.create(inventory);
            navigate(routes.inventories)
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
            setLoading(false);
        }
    }

    const steps = [
        (<StartStep onPrev={onCancel} onNext={onNext}/>),
        (<ModelStep onPrev={onPrev} onNext={onNext} value={inventory.model}
                onChange={model => setInventory({...inventory, model: model})}/>),
        (<Step3 onPrev={onPrev} onNext={onNext}
                onChange={value => setInventory({...inventory, inventoryClass: value})}/>),
        (<SupportesTelemetry onPrev={onPrev} onNext={onNext} value={inventory.supportsTelemetry??false}
                             onChange={value => setInventory({...inventory, supportsTelemetry: value})}/>),
        (<ResultStep onPrev={onPrev} onNext={onCreate} value={inventory}/>)
    ]

    return (
        <Center minH='100vh'>
            <VStack>
                {loading &&
                    <Spinner/>
                }
                {!loading &&
                    <Box>
                        {steps[step]}
                    </Box>
                }
            </VStack>
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
                Регистрация инвентаря
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

function ModelStep({onPrev, onNext, value, onChange}) {

    return (
        <VStack p={10}>
            <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                  bgClip="text"
                  fontSize="3xl"
                  textAlign='center'
                  fontWeight="extrabold">
                Модель инвентаря
            </Text>
            <ModelSelector value={value} onSelect={onChange}/>
            <HStack justifyContent='center'>
                <Button onClick={onPrev}>
                    Назад
                </Button>
                <Button colorScheme='brand'
                        isDisabled={!value?.id}
                        onClick={onNext}>
                    Далее
                </Button>
            </HStack>
        </VStack>
    )
}

function Step3({onPrev, onNext, value, onChange}) {
    return (
        <VStack p={10} spacing={5}>
            <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                  bgClip="text"
                  fontSize="3xl"
                  textAlign='center'
                  fontWeight="extrabold">
                Класс инвентаря
            </Text>
            <Select value={value} onChange={e => onChange(e.target.value)}>
                <option value='STANDARD'>Стандартный</option>
                <option value='VANDAL_RESISTANT'>Вандалозащищенный</option>
                <option value='EXPENSIVE'>Дорогостоящий</option>
            </Select>
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

function SupportesTelemetry({onPrev, onNext, value, onChange}) {
    // console.log(value)
    return (
        <VStack p={10} spacing={5}>
            <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                  bgClip="text"
                  fontSize="3xl"
                  textAlign='center'
                  fontWeight="extrabold">
                {value ? 'Поддерживает сбор и отправку телеметрии' : 'Не поддерживает сбор и отправку телеметрии'}
            </Text>
            <FormControl>
                <VStack>
                    <Switch size='lg' colorScheme='brand' checked={value} onChange={e => onChange(e.target.checked)}/>
                    <FormHelperText textAlign='center'>
                        Отправка телеметрии посредством протокола MQTT
                    </FormHelperText>
                </VStack>
            </FormControl>
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

function ResultStep({onPrev, onNext, value}) {
    return (
        <VStack p={10} spacing={5}>
            <Text color="brand.500"
                  fontSize="3xl"
                  textAlign='center'
                  fontWeight="extrabold">
                Регистрация инвентаря
            </Text>
            <Divider/>
            <HStack alignItems='end'>
                <Text color='brand.500'
                      p={2}
                      fontSize="xl"
                      textAlign='center'
                      fontWeight="extrabold">
                    Модель
                </Text>
                <Tag bgGradient="linear(to-l, #7928CA,#FF0080)"
                     color='white'
                     p={2}
                     fontSize="xl"
                     textAlign='center'
                     fontWeight="extrabold">
                    {value.model.name}
                </Tag>
            </HStack>
            <HStack alignItems='end'>
                <Text color='brand.500'
                      p={2}
                      fontSize="xl"
                      textAlign='center'
                      fontWeight="extrabold">
                    Класс
                </Text>
                <Tag bgGradient="linear(to-l, #7928CA,#FF0080)"
                     color='white'
                     p={2}
                     fontSize="xl"
                     textAlign='center'
                     fontWeight="extrabold">
                    {beautifulInventoryClass(value.inventoryClass)}
                </Tag>
            </HStack>
            <HStack alignItems='end'>
                <Text color='brand.500'
                      p={2}
                      fontSize="xl"
                      textAlign='center'
                      fontWeight="extrabold">
                    Поддержка телеметрии
                </Text>
                <Tag bgGradient="linear(to-l, #7928CA,#FF0080)"
                     color='white'
                     p={2}
                     fontSize="xl"
                     textAlign='center'
                     fontWeight="extrabold">
                    {value.supportsTelemetry ? 'Да' : 'Нет'}
                </Tag>
            </HStack>
            <Divider/>
            <ButtonGroup>
                <Button onClick={onPrev}>
                    Назад
                </Button>
                <Button colorScheme='brand' onClick={onNext}>
                    Создать
                </Button>
            </ButtonGroup>
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

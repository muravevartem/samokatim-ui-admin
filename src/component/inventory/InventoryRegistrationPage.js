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
    Input,
    Select,
    Spinner,
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
        alias: '',
        inventoryClass: 'STANDART',
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
        (<Step1 onPrev={onCancel} onNext={onNext}/>),
        (<Step2 onPrev={onPrev} onNext={onNext} value={inventory.model} onChange={model => setInventory({...inventory, model: model})}/>),
        (<Step3 onPrev={onPrev} onNext={onNext} onChange={value => setInventory({...inventory, inventoryClass: value})}/>),
        (<Step4 onPrev={onPrev} onNext={onNext} value={inventory.alias} onChange={value => setInventory({...inventory, alias: value})}/>),
        (<Step5 onPrev={onPrev} onNext={onCreate} value={inventory}/>)
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

function Step1({onPrev, onNext}) {
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
                        colorScheme='pink'
                        onClick={onNext}>
                    Начать
                </Button>
            </ButtonGroup>
        </VStack>
    )
}

function Step2({onPrev, onNext, value, onChange}) {

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
                <Button colorScheme='pink'
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
                <option value='STANDART'>Стандартный</option>
                <option value='VANDAL_RESISTANT'>Вандалозащищенный</option>
                <option value='EXPENSIVE'>Дорогостоящий</option>
            </Select>
            <HStack justifyContent='center'>
                <Button onClick={onPrev}>
                    Назад
                </Button>
                <Button colorScheme='pink'
                        onClick={onNext}>
                    Далее
                </Button>
            </HStack>
        </VStack>
    )
}

function Step4({onPrev, onNext, value, onChange}) {
    return (
        <VStack p={10} spacing={5}>
            <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                  bgClip="text"
                  fontSize="3xl"
                  textAlign='center'
                  fontWeight="extrabold">
                Название инвентаря
            </Text>
            <FormControl>
                <Input value={value}
                       onChange={e => onChange(e.target.value)}/>
                <FormHelperText>
                    Минимум 4 символа
                </FormHelperText>
            </FormControl>
            <HStack justifyContent='center'>
                <Button onClick={onPrev}>
                    Назад
                </Button>
                <Button colorScheme='pink'
                        isDisabled={value.length < 4}
                        onClick={onNext}>
                    Далее
                </Button>
            </HStack>
        </VStack>
    )
}

function Step5({onPrev, onNext, value}) {
    return (
        <VStack p={10} spacing={5}>
            <Text color="pink.500"
                  fontSize="3xl"
                  textAlign='center'
                  fontWeight="extrabold">
                Регистрация инвентаря
            </Text>
            <Divider/>
            <HStack alignItems='end'>
                <Text color='pink.500'
                     p={2}
                     fontSize="xl"
                     textAlign='center'
                     fontWeight="extrabold">
                    Название
                </Text>
                <Tag bgGradient="linear(to-l, #7928CA,#FF0080)"
                      color='white'
                     p={2}
                      fontSize="xl"
                      textAlign='center'
                      fontWeight="extrabold">
                    {value.alias}
                </Tag>
            </HStack>
            <HStack alignItems='end'>
                <Text color='pink.500'
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
                <Text color='pink.500'
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
            <Divider/>
            <ButtonGroup>
                <Button onClick={onPrev}>
                    Назад
                </Button>
                <Button colorScheme='pink' onClick={onNext}>
                    Создать
                </Button>
            </ButtonGroup>
        </VStack>
    )
}


function beautifulInventoryClass(value) {
    if (value === 'STANDART')
        return 'Стандартный'
    if (value === 'VANDAL_RESISTANT')
        return 'Вандалозащищенный'
    if (value === 'EXPENSIVE')
        return 'Дорогостоящий'
    return 'Неизвестно'
}

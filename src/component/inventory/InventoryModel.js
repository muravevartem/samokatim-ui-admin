import React, {useEffect, useState} from "react";
import {
    Button,
    ButtonGroup,
    Center,
    Divider,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    InputGroup,
    InputLeftAddon,
    Select,
    Skeleton,
    Stack,
    Text,
    useToast
} from "@chakra-ui/react";
import {IoMdSearch} from "react-icons/io";
import {inventoryModelService} from "../../service/InventoryModelService.js";
import {errorConverter} from "../../error/ErrorConverter.js";
import {MdElectricBike, MdElectricScooter, MdPedalBike, MdTaxiAlert} from "react-icons/md";
import {BsScooter} from "react-icons/bs";

export function ModelSelector({value, onSelect}) {
    const [models, setModels] = useState([]);
    const [createMode, setCreateMode] = useState(false);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    let toast = useToast();

    async function onSearch() {
        try {
            setLoading(true)
            let loadedModels = await inventoryModelService.search(search);
            setModels(loadedModels.map(model => ({...model, selected: value?.id === model.id})))
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        onSearch()
    }, [search, value])

    if (createMode)
        return (
            <ModelCreateBlock onSearchMode={() => setCreateMode(false)}/>
        )

    return (
        <Stack>
            <InputGroup>
                <InputLeftAddon>
                    <IoMdSearch/>
                </InputLeftAddon>
                <Input placeholder='Samokat'
                       onChange={e => setSearch(e.target.value)}
                       value={search}/>
            </InputGroup>
            <Skeleton isLoaded={!loading}>
                <Stack>
                    {models.length === 0 &&
                        <ModelEmptyList onCreateMode={() => setCreateMode(true)}/>
                    }
                    {models.length !== 0 &&
                        <ModelList models={models} onSelect={onSelect}/>
                    }
                </Stack>
            </Skeleton>
        </Stack>
    )
}

function ModelEmptyList({onCreateMode}) {
    return (
        <Stack spacing={5}>
            <Text fontSize="xl"
                  textAlign='center'
                  fontWeight="extrabold">
                Не найдено
            </Text>
            <Button colorScheme='pink' onClick={onCreateMode}>
                Создать?
            </Button>
        </Stack>
    )
}

function ModelList({models, onSelect}) {
    return (
        <Stack divider={<Divider/>}>
            {models.map(model =>
                <ModelItem model={model}
                           onClick={() => onSelect(model)}
                           key={model.id}/>)}
        </Stack>
    )
}

function ModelItem({model, onClick}) {
    return (
        <HStack onClick={onClick}
                justifyContent='space-between'
                p={3}>
            <Heading size='md'
                     color={model.selected ? 'pink.500' : 'black'}
            >
                {model.name}
            </Heading>
            <EquipmentLogo type={model.type}/>
        </HStack>
    )
}

export function EquipmentLogo(props) {
    if (props.type === 'BICYCLE')
        return <MdPedalBike {...props}/>
    if (props.type === 'BICYCLE_EL')
        return <MdElectricBike {...props}/>
    if (props.type === 'SCOOTER_EL')
        return <MdElectricScooter {...props}/>
    if (props.type === 'SCOOTER')
        return <BsScooter {...props}/>
    return <MdTaxiAlert {...props}/>
}

function ModelCreateBlock({onSearchMode}) {
    let [state, setState] = useState({
        name: '',
        type: 'BICYCLE',
        manufacture: ''
    });
    let [loading, setLoading] = useState(false);

    let toast = useToast();

    async function onCreate() {
        try {
            setLoading(true);
            await inventoryModelService.create(state);
            onSearchMode();
        } catch (e) {
            toast(errorConverter.convertToToastBody(e));
            setLoading(false);
        }
    }


    return (
        <Stack spacing={5} p={5}>
            <FormControl isDisabled={loading}>
                <FormLabel>Название</FormLabel>
                <Input placeholder='Samokatim'
                       onChange={e => setState({...state, name: e.target.value})}
                       value={state.name}/>
            </FormControl>
            <FormControl isDisabled={loading}>
                <FormLabel>Тип</FormLabel>
                <Select value={state.type} onChange={event => setState({...state, type: event.target.value})}>
                    <option value='BICYCLE'>Велосипед</option>
                    <option value='BICYCLE_EL'>Электровелосипед</option>
                    <option value='SCOOTER'>Самокат</option>
                    <option value='SCOOTER_EL'>Электросамокат</option>
                </Select>
            </FormControl>
            <FormControl isDisabled={loading}>
                <FormLabel>Производитель</FormLabel>
                <Input placeholder='Самокатим'
                       onChange={e => setState({...state, manufacture: e.target.value})}
                       value={state.manufacture}/>
            </FormControl>
            <Center>
                <ButtonGroup isDisabled={loading}>
                    <Button onClick={onSearchMode} colorScheme='teal'>
                        Найти
                    </Button>
                    <Button colorScheme='pink'
                            onClick={onCreate}>
                        Создать
                    </Button>
                </ButtonGroup>
            </Center>
        </Stack>
    )
}

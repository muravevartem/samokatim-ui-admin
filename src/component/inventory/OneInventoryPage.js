import React, {useEffect, useState} from "react";
import {
    Editable,
    EditableInput,
    EditablePreview,
    Heading,
    HStack,
    IconButton,
    Select,
    SimpleGrid,
    Skeleton,
    Stack,
    Tag,
    useToast
} from "@chakra-ui/react";
import {EquipmentLogo, MainHeader} from "../components.js";
import {equipmentService} from "../../service/EquipmentService.js";
import {useNavigate, useParams} from "react-router-dom";
import {errorConverter} from "../../error/ErrorConverter.js";
import isNumeric from "validator/es/lib/isNumeric.js";
import {routes} from "../../routes.js";
import moment from "moment";
import {IoMdArrowBack, IoMdSave} from "react-icons/io";

export function OneInventoryPage() {
    const [data, setData] = useState({
        alias: '',
        type: 'SCOOTER'
    })
    const [loading, setLoading] = useState(true);

    let toast = useToast();
    let navigate = useNavigate();
    let {id} = useParams();

    const creation = id === 'new';

    async function loadEquipment() {
        try {
            if (creation) {
                setLoading(false);
                return;
            }
            if (!isNumeric(id))
                navigate(routes["404"])
            setLoading(true);
            let equipment = await equipmentService.getOne(id);
            setData(equipment);
        } catch (e) {
            toast({
                status: 'error',
                title: errorConverter.convert(e)
            });
        } finally {
            setLoading(false);
        }
    }

    async function createEquipment() {
        try {
            setLoading(true);
            let equipment = await equipmentService.create(data);
            navigate(`${routes.inventories}/${equipment.id}`)
            setLoading(false);
        } catch (e) {
            toast({
                status: 'error',
                title: errorConverter.convert(e)
            });
            setLoading(false);
        }
    }

    async function updateEquipment(value, fieldName) {
        if (!creation) {
            try {
                let equipment = await equipmentService.update(id, value, fieldName);
                setData(equipment)
                toast({
                    status: 'success',
                    title: 'Изменения применены'
                })
            } catch (e) {
                toast({
                    status: 'error',
                    title: errorConverter.convert(e)
                })
            }
        }
        setData({
            ...data,
            ...value
        })
    }


    useEffect(() => {
        loadEquipment()
    }, [])


    return (
        <Stack>
            <MainHeader fixed/>
            <Stack p={10} paddingTop={10}>
                <HStack justifyContent='end' py={10}>
                    <IconButton aria-label='back'
                                onClick={() => navigate(-1)}
                                icon={<IoMdArrowBack/>}/>
                    {creation &&
                        <IconButton aria-label='save'
                                    onClick={createEquipment}
                                    colorScheme='green'
                                    icon={<IoMdSave/>}/>}
                </HStack>


                <Skeleton isLoaded={!loading}>
                    <EquipmentLogo equipment={data} size={100}/>
                </Skeleton>
                <Skeleton isLoaded={!loading}>
                    <Editable defaultValue={data.alias}
                              placeholder='Псевдоним'
                              w='100%'
                              onSubmit={nextValue => updateEquipment({alias: nextValue}, 'alias')}
                              fontSize='4xl'
                              fontWeight='bold'>
                        <EditablePreview/>
                        <EditableInput/>
                    </Editable>
                </Skeleton>
                <SimpleGrid minChildWidth={250} alignItems='center'>
                    <Stack>
                        <Skeleton isLoaded={!loading}>
                            <HStack>
                                <Heading size='sm'>Дата регистации</Heading>
                                <Tag>{moment(data.createdAt).format('lll')}</Tag>
                            </HStack>
                        </Skeleton>
                        <Skeleton isLoaded={!loading}>
                            <HStack>
                                <Heading size='sm'>Тип</Heading>
                                <Select value={data.type}
                                        onChange={e => updateEquipment({type: e.target.value}, 'type')}
                                        w='max-content'>
                                    <option value='BICYCLE'>Велосипед</option>
                                    <option value='SCOOTER'>Самокат</option>
                                    <option value='BICYCLE_EL'>Электровелосипед</option>
                                    <option value='SCOOTER_EL'>Электросамокат</option>
                                </Select>
                            </HStack>
                        </Skeleton>
                    </Stack>
                    <Stack>
                        <Skeleton isLoaded={!loading}>
                            <HStack>
                                <Heading size='sm'>Статус</Heading>
                                <Tag></Tag>
                            </HStack>
                        </Skeleton>
                        <Skeleton isLoaded={!loading}>
                            <HStack>
                                <Heading size='sm'>Тип</Heading>
                                <Select value={data.type}
                                        onChange={e => updateEquipment({type: e.target.value}, 'type')}
                                        w='max-content'>
                                    <option value='BICYCLE'>Велосипед</option>
                                    <option value='SCOOTER'>Самокат</option>
                                    <option value='BICYCLE_EL'>Электровелосипед</option>
                                    <option value='SCOOTER_EL'>Электросамокат</option>
                                </Select>
                            </HStack>
                        </Skeleton>
                    </Stack>
                </SimpleGrid>
            </Stack>
        </Stack>
    )
}

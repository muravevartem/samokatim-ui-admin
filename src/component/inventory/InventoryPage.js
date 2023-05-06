import React, {useEffect, useState} from "react";
import {
    Button,
    HStack,
    IconButton,
    Skeleton,
    Stack,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useToast
} from "@chakra-ui/react";
import {equipmentService} from "../../service/EquipmentService.js";
import {errorConverter} from "../../error/ErrorConverter.js";
import moment from "moment";
import {IoMdArrowBack, IoMdArrowDown, IoMdArrowForward, IoMdArrowUp, IoMdEye} from "react-icons/io";
import {useNavigate} from "react-router-dom";
import {routes} from "../../routes.js";


function ButtonSort({fieldName, onClick, defaultDirection}) {
    const [direction, setDirection] = useState(defaultDirection??'none')

    useEffect(() => {
        onClick(fieldName, direction)
    }, [direction])

    switch (direction) {
        case 'asc': {
            return (
                <IconButton size='sm'
                            onClick={() => setDirection('desc')}
                            aria-label='sort'
                            icon={<IoMdArrowUp/>}/>
            )
        }
        case 'desc': {
            return (
                <IconButton size='sm'
                            onClick={() => setDirection('none')}
                            aria-label='sort'
                            icon={<IoMdArrowDown/>}/>
            )
        }
        default : {
            return (
                <IconButton size='sm'
                            onClick={() => setDirection('asc')}
                            aria-label='sort'
                            icon={<IoMdArrowBack/>}/>
            )
        }
    }


}

export function InventoryPage() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({number: 0})
    const [pageable, setPageable] = useState({page: 0, size: 5})
    const [sort, setSort] = useState({
        asc: ['id'],
        desc: []
    })

    let toast = useToast();
    let navigate = useNavigate();


    async function loadData() {
        try {
            setLoading(true);
            let joinedAsc = 'sort=' + sort.asc.join(',') + ',asc';
            let joinedDesc = 'sort=' + sort.desc.join(',') + ',desc';
            let loadedData = await equipmentService.getAllMy({
                page: pageable.page,
                size: pageable.size,
                sort: [joinedAsc, joinedDesc].join('&')
            });
            setData(loadedData)
        } catch (e) {
            toast({
                status: 'error',
                title: errorConverter.convert(e)
            })
        } finally {
            setLoading(false)
        }
    }

    function changeSort(fieldName, direction) {
        if (direction === 'asc')
            setSort({
                asc: [...sort.asc, fieldName],
                desc: sort.desc.filter(f => f !== fieldName)
            })
        if (direction === 'desc')
            setSort({
                asc: sort.asc.filter(f => f !== fieldName),
                desc: [...sort.desc, fieldName]
            })
        if (direction === 'none')
            setSort({
                asc: sort.asc.filter(f => f !== fieldName),
                desc: sort.desc.filter(f => f !== fieldName)
            })
    }



    useEffect(
        () => {
            loadData()
        },
        [pageable, sort]
    )

    return (
       <Stack>
           <Stack w='100%' p={4}>
               <Stack>
                   <HStack justifyContent='space-between'>
                       <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                             bgClip='text'
                             p={2}
                             fontSize="4xl"
                             textAlign='center'
                             fontWeight="extrabold">
                           Инвентарь
                       </Text>
                       <Button colorScheme='brand'
                               onClick={() => navigate(`${routes.inventories}/new`)}>
                           Добавить
                       </Button>
                   </HStack>
               </Stack>
               <TableContainer minH='75vh'>
                   <Table variant='unstyled'>
                       <Thead>
                           <Tr>
                               <Th textAlign='center'>
                                   ID
                                   <ButtonSort fieldName='id'
                                               defaultDirection='asc'
                                               onClick={changeSort}/>
                               </Th>
                               <Th textAlign='center'>
                                   Название
                                   <ButtonSort fieldName='alias'
                                               onClick={changeSort}/>
                               </Th>
                               <Th textAlign='center'>
                                   Дата регистрации
                                   <ButtonSort fieldName='createdAt'
                                               onClick={changeSort}/>
                               </Th>
                               <Th textAlign='center'>
                                   Действие
                               </Th>
                           </Tr>
                       </Thead>
                       <Tbody>
                           {data?.content?.map(item => (
                               <Tr key={item.id}>
                                   <Td textAlign='center'>{item.id}</Td>
                                   <Td textAlign='center'>{item.alias}</Td>
                                   <Td textAlign='center'>{moment(item.createdAt).format('lll')}</Td>
                                   <HStack justifyContent='center'>
                                       <IconButton aria-label='select'
                                                   colorScheme='brand'
                                                   onClick={() => navigate(`${routes.inventories}/${item.id}`)}
                                                   icon={<IoMdEye/>}
                                                   size='sm'/>
                                   </HStack>
                               </Tr>
                           ))}
                       </Tbody>
                   </Table>
               </TableContainer>
               <HStack justifyContent='center'>
                   <IconButton icon={<IoMdArrowBack/>}
                               onClick={() => setPageable({...pageable, page: pageable.page - 1})}
                               isDisabled={data.first}/>
                   <Button>
                       <Skeleton isLoaded={!loading && !isNaN(data.number + 1)}>
                           {data.number + 1}
                       </Skeleton>
                   </Button>
                   <IconButton icon={<IoMdArrowForward/>}
                               onClick={() => setPageable({...pageable, page: pageable.page + 1})}
                               isDisabled={data.last}/>
               </HStack>
           </Stack>
       </Stack>
    )
}
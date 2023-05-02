import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Center,
    Heading,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightElement,
    Link,
    Text,
    VStack
} from "@chakra-ui/react";
import {IoMdEye, IoMdEyeOff, IoMdKey} from "react-icons/io";
import React, {useState} from "react";
import {userService} from "../service/UserService.js";
import {routes} from "../routes.js";
import {MdDeviceUnknown, MdElectricBike, MdElectricScooter, MdPedalBike} from "react-icons/md";

export function MainHeader({fixed}) {
    return (
        <HStack p={4}
                justifyContent='space-between'
                position={fixed ? 'fixed' : 'relative'}
                bgColor='green.700'
                color='whitesmoke'
                zIndex={999}
                w='100%'>
            <Heading size='md'>
                Панель администратора
            </Heading>
            <Button colorScheme='white' onClick={() => userService.signout()}>
                Выйти
            </Button>
        </HStack>
    )
}

export function GridBlock({header, body, footer}) {
    return (
        <Card p={4} gap={4}>
            <CardHeader p={0}>
                <HStack justifyContent='center'>
                    <Text color='gray' fontWeight='bold' textAlign='center'>
                        {header}
                    </Text>
                </HStack>
            </CardHeader>
            <CardBody p={0}>
                {body}
            </CardBody>
            <CardFooter p={0}>
                <HStack justifyContent='center'>
                    {footer}
                </HStack>
            </CardFooter>
        </Card>
    )
}

export function IconTextButton({icon, text, color, w, onClick}) {
    return (
        <Button colorScheme={color}
                onClick={onClick}
                h='max-content'
                w={w}
                p={5}
                rounded={5}>
            <VStack>
                {icon}
                <Heading size='lg'>{text}</Heading>
            </VStack>
        </Button>
    )
}

export function EquipmentLogo({equipment, size, color}) {
    let type = equipment.type;

    switch (type) {
        case 'BICYCLE': {
            return (
                <MdPedalBike size={size} color={color}/>
            )
        }
        case 'BICYCLE_EL': {
            return (
                <MdElectricBike size={size} color={color}/>
            )
        }

        case 'SCOOTER': {
            return (
                <MdElectricScooter size={size} color={color}/>
            )
        }
        case 'SCOOTER_EL': {
            return (
                <MdElectricScooter size={size} color={color}/>
            )
        }
        default: {
            return (
                <MdDeviceUnknown size={size} color={color}/>
            )
        }
    }
}


export function RoutingBreadcrumb({partitions}) {
    return (
        <Breadcrumb>
            <BreadcrumbItem>
                <BreadcrumbLink href='/'>Домашняя страница</BreadcrumbLink>
            </BreadcrumbItem>
            {partitions.map(partition => (
                <BreadcrumbItem key={partition.path}>
                    <BreadcrumbLink href={partition.path}>{partition.name}</BreadcrumbLink>
                </BreadcrumbItem>

            ))}
        </Breadcrumb>
    )
}

export function NotFoundPage() {
    return (
        <Center minH='100vh'>
            <VStack>
                <Heading>
                    Страница не найдена
                </Heading>
                <Link href={routes.home}>
                    На главную
                </Link>
            </VStack>
        </Center>
    )
}


export function InputPassword(props) {
    let [isHidden, setHidden] = useState(true);

    function changeMode() {
        if (props.onlyHidden) {
            setHidden(true)
        } else {
            setHidden(!isHidden)
        }
    }

    return (
        <InputGroup>
            <InputLeftAddon>
                <IoMdKey/>
            </InputLeftAddon>
            <Input type={isHidden ? 'password' : 'text'}
                   isInvalid={props.isInvalid}
                   value={props.value}
                   onChange={props.onChange}
            />
            {!props.onlyHidden &&
                <InputRightElement>
                    <IconButton aria-label='show password'
                                size={32}
                                onClick={changeMode}
                                icon={isHidden ? <IoMdEyeOff/> : <IoMdEye/>}
                    />
                </InputRightElement>
            }
        </InputGroup>
    )
}

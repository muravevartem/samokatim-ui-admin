import {Button, Card, CardBody, CardFooter, CardHeader, Heading, HStack, Text, VStack} from "@chakra-ui/react";
import {IoMdBicycle} from "react-icons/io";
import React from "react";

export function MainHeader({fixed}) {
    return (
        <HStack p={4}
                justifyContent='space-between'
                position={fixed?'fixed':'relative'}
                bgColor='green.400'
                color='whitesmoke'
                zIndex={999}
                w='100%'>
            <Heading size='md'>
                Панель администратора
            </Heading>
            <Button colorScheme='white'>
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

export function IconTextButton({icon, text, link, color,w}) {
    return (
        <Button colorScheme={color}
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
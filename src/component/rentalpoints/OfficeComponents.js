import React from "react";
import {Badge, HStack, Input, Stack, Switch, Tag, Text} from "@chakra-ui/react";
import {ShortDaysOfWeek, toDayName, toLocalTime, toOffsetTime} from "../util.js";

export function OfficeScheduleComponent({value, onChange}) {
    return (
        <Stack>
            <HStack>
                <Text>
                    {ShortDaysOfWeek[value.day]}
                </Text>
                {!value.dayOff &&
                    <Badge colorScheme='brand'>
                        {toLocalTime(value.start)} - {toLocalTime(value.end)}
                    </Badge>
                }
                {value.dayOff &&
                    <Badge>
                        Выходной
                    </Badge>
                }
            </HStack>
        </Stack>
    )
}

/*
*
*   <Stack p={3} bgColor='white' rounded={5}>
            <HStack justifyContent='space-between'>
                <Text color={value.dayOff ? 'gray.500' : 'brand.500'}
                      fontSize="lg"
                      fontWeight="extrabold">
                    {toDayName(value.day)}
                </Text>
                <Switch isChecked={!value.dayOff}
                        onChange={e => onChange({...value, dayOff: !e.target.checked})}
                        colorScheme='brand'/>
            </HStack>
            <Stack minW={250} maxW='100%'>
                {value.dayOff &&
                    <HStack spacing={1} justifyContent='center'>
                        <Tag bgColor='gray.600'
                             color='white'>
                            <Text fontSize="md"
                                  textAlign='center'
                                  fontWeight="extrabold">
                                Выходной
                            </Text>
                        </Tag>
                    </HStack>
                }
                {!value.dayOff &&
                    <HStack spacing={1} justifyContent='center'>
                        <Tag bg='brand.500'
                             color='white'>
                            <Input type='time'
                                   border='none'
                                   value={toLocalTime(value.start)}
                                   onChange={e =>{
                                       onChange({...value, start: toOffsetTime(e.target.value)})}
                                   }
                                   p={0}
                                   fontSize="md"
                                   textAlign='center'
                                   fontWeight="extrabold"/>
                        </Tag>
                        <Text color='brand.500'
                              fontSize="lg"
                              textAlign='center'
                              fontWeight="extrabold">
                            -
                        </Text>
                        <Tag bg='brand.500'
                             color='white'>
                            <Input type='time'
                                   border='none'
                                   value={toLocalTime(value.end)}
                                   onChange={e => onChange({...value, end: toOffsetTime(e.target.value)})}
                                   fontSize="md"
                                   p={0}
                                   textAlign='center'
                                   fontWeight="extrabold"/>
                        </Tag>
                    </HStack>
                }
            </Stack>
        </Stack>
* */
import moment from "moment";
import {Avatar, HStack, Tag, Td, Text, Tr} from "@chakra-ui/react";

export const PasswordValidationOptions = {
    minLength: 8,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 0,
    minSymbols: 0,
    returnScore: false,
    pointsPerUnique: 0,
    pointsPerRepeat: 0,
    pointsForContainingLower: 0,
    pointsForContainingUpper: 0,
    pointsForContainingNumber: 0,
    pointsForContainingSymbol: 0
};


export const inventoryStatus = {
    PENDING: 'Простой',
    IN_WORK: 'В аренде',
    UNDER_REPAIR: 'На обслуживании',
    DECOMMISSIONED: 'Списан'
}


export const toEventBlock = (event) => {
    if (event.type === 'INVENTORY_STATUS_CHANGED')
        return (
            <Tr>
                <Td style={{fontWeight: 'bold'}}>
                    {moment(event.createdAt).format('LLL')}
                </Td>
                <Td>
                    <HStack alignItems='center'>
                        <Text>Статус оборудования изменен на</Text>
                        <Tag colorScheme='pink'>{inventoryStatus[event.body.newValue]}</Tag>
                    </HStack>
                </Td>
                <Td>
                    <HStack>
                        <Avatar size='sm' name={event.createdBy.email}/>
                        <Text>{event.createdBy.email}</Text>
                    </HStack>
                </Td>
            </Tr>
        )
}

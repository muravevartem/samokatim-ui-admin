import moment from "moment";
import {Avatar, HStack, Tag, Td, Text, Tr} from "@chakra-ui/react";
import L from 'leaflet';

export function toLastPoint(track) {
    if (track) {
        return track[track.length - 1];
    }
    return null;
}

export const Icons = {
    INVENTORY_ICON: new L.Icon({
        iconUrl: '/icons/inventory-icon.png',
        iconSize: new L.Point(24, 24)
    }),
    RENTED_INVENTORY_ICON: new L.Icon({
        iconUrl: '/icons/Rented-icon.png',
        iconSize: new L.Point(24, 24)
    }),
    ME_ICON: new L.Icon({
        iconUrl: '/icons/My-location.png',
        iconSize: new L.Point(24, 24)
    }),
    PARKING_ICON: new L.Icon({
        iconUrl: '/icons/Parking.png',
        iconSize: new L.Point(32, 32)
    })

}


export const inventoryStatus = {
    PENDING: 'Ожидает',
    IN_WORK: 'В аренде',
    UNDER_REPAIR: 'На обслуживании',
    DECOMMISSIONED: 'Списан'
}

export const inventoryColorStatus = {
    PENDING: 'yellow',
    IN_WORK: 'green',
    UNDER_REPAIR: 'blue',
    DECOMMISSIONED: 'red'
}

export const inventoryType = {
    BICYCLE: 'Велосипед',
    BICYCLE_EL: 'Электровелосипед',
    SCOOTER: 'Самокат',
    SCOOTER_EL: 'Электросамокат'
}

export const tariffType = {
    MINUTE_BY_MINUTE: 'Поминутный',
    LONG_TERM: 'Долгосрочный'
}

export const tariffUnit = {
    MINUTE_BY_MINUTE: '₽/мин',
    LONG_TERM: '₽/день',
    TRAVEL_CARD: '₽/мес'
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
                        <Avatar size='sm' name={event?.createdBy?.email}/>
                        <Text>{event?.createdBy?.email}</Text>
                    </HStack>
                </Td>
            </Tr>
        )
}

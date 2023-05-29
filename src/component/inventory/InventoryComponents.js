import React, {useState} from "react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button, HStack,
    Tag,
    useDisclosure,
    useToast,
    VStack
} from "@chakra-ui/react";
import {MapContainer, TileLayer} from "react-leaflet";
import {LocationMarker, OfficeMarkers} from "../map/MapComponents.js";
import {equipmentService} from "../../service/EquipmentService.js";
import {errorConverter} from "../../error/ErrorConverter.js";

export function OfficeSelecton({value, onChange}) {
    let {isOpen, onClose, onOpen, onToggle} = useDisclosure();
    let [loading, setLoading] = useState(false);

    let toast = useToast();

    async function setOffice(office) {
        try {
            setLoading(true);
            let changed = office
                ? await equipmentService.update(value.id, {officeId: office.id}, 'office')
                : await equipmentService.deleteOffice(value.id)
            onClose();
            onChange(changed)
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <HStack>
                <Tag colorScheme="brand"
                     cursor={'pointer'}
                     p={2}
                     fontSize="xl"
                     textAlign='center'
                     onClick={onToggle}
                     fontWeight="extrabold">
                    {value?.office?.alias}
                </Tag>
            </HStack>
            <AlertDialog
                isOpen={isOpen}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Добавление тарифа
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <VStack w={400} h={400}>
                                <MapContainer center={[46, 46]}
                                              zoom={localStorage.getItem('MyLastZoom') ?? 13}
                                              scrollWheelZoom={true}
                                              zoomControl={false}
                                              style={{width: '100%', height: '100%'}}>
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <OfficeMarkers onSelect={setOffice}/>
                                    <LocationMarker/>
                                </MapContainer>
                            </VStack>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button onClick={onClose}
                                    isDisabled={loading}>
                                Отмена
                            </Button>
                            <Button colorScheme='red'
                                    ml={3}
                                    onClick={() => setOffice()}
                                    isDisabled={loading}>
                                Сбросить
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

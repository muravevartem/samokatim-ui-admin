import React, {useEffect, useState} from "react";
import {Button, Center, CircularProgress, HStack, Stack, Text, useToast, VStack} from "@chakra-ui/react";
import {MapContainer, TileLayer} from "react-leaflet";
import {errorConverter} from "../../error/ErrorConverter.js";
import {organizationService} from "../../service/OrganizationService.js";
import {TariffAddButton, TariffItemInfo} from "./TariffComponents.js";

export function OrganizationPage() {
    const [state, setState] = useState();
    const [loading, setLoading] = useState(true);

    let toast = useToast();

    async function loadOrg() {
        try {
            setLoading(true)
            let loaded = await organizationService.getMyOrg();
            setState(loaded);
        } catch (e) {
            toast(errorConverter.convertToToastBody(e));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadOrg()
    }, [])

    if (loading)
        return (
            <Center w='100%' h='100vh'>
                <CircularProgress isIndeterminate/>
            </Center>
        )

    return (
        <Stack p={4}>
            <BaseInfo org={state}/>
            <TariffInfo org={state} setOrg={setState}/>
        </Stack>
    )
}

function BaseInfo({org}) {
    return (
        <VStack alignItems='start'>
            <Text color='brand.600'
                  fontSize="6xl"
                  textAlign='start'
                  fontWeight="extrabold">
                {org.name}
            </Text>
            <Text bgColor='brand.600'
                  w='max-content'
                  color='white'
                  rounded={20}
                  p={2}
                  fontSize="xl"
                  textAlign='center'
                  fontWeight="extrabold">
                {org.inn}
            </Text>
        </VStack>
    )
}

function TariffInfo({org, setOrg}) {
    return (
        <VStack>
            <Text color='brand.600'
                  fontSize="2xl"
                  textAlign='start'
                  fontWeight="extrabold">
                Тарифы
            </Text>
            <div style={{height: 20}}/>
            <HStack>
                {(org.tariffs??[]).map(tariff => <TariffItemInfo key={tariff.id} tariff={tariff} onChange={setOrg}/> )}
                <TariffAddButton value={org} onChange={setOrg}/>
            </HStack>
        </VStack>
    )
}


function MapPreviewBlock({center, zoom}) {

    const DEFAULT_LOC = [51.533366, 46.034124]

    return (
        <Stack spacing={0}>
            <Button rounded={0}>
                Перейти к карте
            </Button>
            <Stack w='100%' h={200} maxH='100vh' rounded={5} zIndex={2}>
                <MapContainer
                    zIndex={1}
                    zoomControl={true}
                    center={center ? center : DEFAULT_LOC}
                    zoom={zoom ? zoom : 11}
                    scrollWheelZoom={true}
                    style={{width: '100%', height: '100%'}}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </MapContainer>
            </Stack>
        </Stack>
    )
}

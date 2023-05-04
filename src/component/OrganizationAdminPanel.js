import React from "react";
import {Button, Stack} from "@chakra-ui/react";
import {MainHeader} from "./components";
import {MapContainer, TileLayer} from "react-leaflet";

export function OrganizationAdminPanel() {
    return (
        <Stack>
            <header>
                <MainHeader fixed/>
            </header>
            <main style={{paddingTop: 100}}>
            </main>
        </Stack>
    )
}


function MapPreviewBlock({center, zoom}) {

    const DEFAULT_LOC = [51.533366, 46.034124]

    return (
        <Stack spacing={0}>
            <Button rounded={0} >
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

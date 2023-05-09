import React, {useEffect, useState} from "react";
import {Marker, Tooltip, useMap} from "react-leaflet";
import {useToast} from "@chakra-ui/react";
import {errorConverter} from "../../error/ErrorConverter.js";
import {mapService} from "../../service/MapService.js";
import {Icons} from "../../util.js";


export function LocationMarker() {
    let [location, setLocation] = useState();
    const map = useMap();

    useEffect(() => {
        map.locate()
        map.on('locationfound', event => {
            if (!location) {
                let latlng = event.latlng;
                setLocation([latlng.lat, latlng.lng])
                map.flyTo(latlng, map.getZoom(), {
                    animate: false
                })
            }
        })
    }, [])

    if (location)
        return (<Marker position={location} icon={Icons.ME_ICON}/>)

    return null;
}

export function OfficeMarkers({onSelect}) {
    let [state, setState] = useState({});
    let [loading, setLoading] = useState(false);

    let map = useMap();

    let toast = useToast();

    async function loadMapInfo() {
        try {
            setLoading(true);
            let loadedState = await mapService.getMyOfficesMap({
                northEast: map.getBounds().getNorthEast(),
                southWest: map.getBounds().getSouthWest()
            });
            setState(loadedState);
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadMapInfo()
        map.on('moveend', event => {
            loadMapInfo()
        })
    }, [])

    return (
        <>
            {(state.offices ?? []).map(office =>
                <Marker icon={Icons.PARKING_ICON}
                        key={'office' + office.id}
                        eventHandlers={{
                            click() {
                                onSelect(office)
                            }
                        }}
                        position={[office.lat, office.lng]}>
                    <Tooltip direction="top" opacity={1} permanent>
                        {office.alias}
                    </Tooltip>
                </Marker>
            )}
        </>
    )


}

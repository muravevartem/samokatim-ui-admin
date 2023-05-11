import L from 'leaflet';
import {useState} from "react";
import {Image, SkeletonCircle} from "@chakra-ui/react";

export const INVENTORY_ICON = new L.Icon({
    iconUrl: '/icons/inventory-icon.png',
    iconSize: new L.Point(24, 24)
});


export function RemoteImage({size, src}) {
    let [loading, setLoading] = useState(true);

    return (
        <SkeletonCircle isLoaded={!loading}
                        startColor='brand.100'
                        endColor='brand.500'
                        w={size}
                        h={size}>
            <Image boxSize={size}
                   borderRadius='full'
                   onLoad={() => setLoading(false)}
                   src={src}/>
        </SkeletonCircle>
    )
}

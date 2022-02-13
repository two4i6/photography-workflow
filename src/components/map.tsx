import { Text, Container, Box} from '@chakra-ui/react'
import GoogleMapReact from 'google-map-react';
import { CollectionContainer } from "./collectioncard";
import { Image } from '@chakra-ui/react';
import type { hit } from '../../lib/redis.js/redis';

interface MapContainerProps {
    children: JSX.Element[];
    center: {
        lat: number,
        lng: number,
    };
    zoom: number;
}

const MapComponent = ({children, center, zoom}:MapContainerProps):JSX.Element => {
    return (
        <CollectionContainer>
            <Box height={'22vh'}  >
                <GoogleMapReact
                yesIWantToUseGoogleMapApiInternals={true}
                bootstrapURLKeys={{ key: process.env.GOOGLE_MAP_KEY as string}}
                defaultCenter={center}
                defaultZoom={zoom}
                >
                    {children}
                </GoogleMapReact>
            </Box>
        </CollectionContainer>
    )
}

export const PhotoOnMapComponent = ({hits}:{hits:hit[]}) => {
    const photos = hits.map(hit => ({
        src: hit.img_url, 
        width: hit.img_width, 
        height: hit.img_height,
        alt: hit.img_key,
        cid: hit.event_id,
        pid: hit.img_key,
        DateTime: hit.DateTime,
        location: hit.location,
        location_lat: hit.location_lat,
        location_lng: hit.location_lng,
    }))
    // todo 算法
    const center = {lat: photos[0].location_lat, lng: photos[0].location_lng};
    const zoom = 20;
    
    return (
        <>
            <MapComponent center={center} zoom={zoom}>
                    {photos.map(({src, location_lat, location_lng, pid}) => 
                        <Image position={'absolute'} border={'1px black solid'} lat={location_lat} lng={location_lng} src={src} alt={`${pid}'s photo`} boxSize={'7em'} key={location_lat + location_lng + pid}/>
                    )}
            </MapComponent>
        </>
    )
}



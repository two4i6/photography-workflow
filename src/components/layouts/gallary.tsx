import Gallery from "react-photo-gallery"
import dynamic from "next/dynamic";
import { useCallback } from "react";
import { PostWrapper } from "../draggable/postinfo";
import Image from "next/image";
import { 
    Box, 
    Center, 
    List, 
    ListItem, 
    ListIcon, 
    Container, 
    useColorMode, 
    Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import type { hit } from "../../../lib/redis.js/redis";
import { motion } from "framer-motion";
import { 
    Camera, 
    Aperture, 
    FilmStrip, 
    Calendar, 
    Cylinder, 
    MapTrifold,
} from 'phosphor-react'
import { useState } from "react";

const SimpleReactLightbox = dynamic(() => import("simple-react-lightbox"));
import { SRLWrapper } from "simple-react-lightbox";


import { BasicLocation } from '../draggable/locationinfo'
import { BasicEquipment } from '../draggable/equipment';
import { BasicDate } from '../draggable/dateinfo'

interface GalleryProps {
    hits: Array<hit>,
    defaultOnClick?: boolean,
}

const IMAGE_QUALITY = "90";
const GALLERY_IMAGE_QUALITY = "40";

// Pixel GIF code adapted from https://stackoverflow.com/a/33919020/266535
const keyStr =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

const triplet = (e1:number, e2:number, e3:number) =>
    keyStr.charAt(e1 >> 2) +
    keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
    keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
    keyStr.charAt(e3 & 63)

const rgbDataURL = (r:number, g:number, b:number) =>
    `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
    }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`

export const GalleryComponent = ({hits, defaultOnClick = true}:GalleryProps) => {
    const router = useRouter();
    const uid = hits[0].user;
    const imageRenderer = useCallback(
        ({ index, left, top, key, photo}) => (
            <PostWrapper uid={uid} pid={photo.alt}>
                <motion.div 
                    initial={{opacity: 0.2}} 
                    animate={{opacity: 1}} 
                    transition={{duration: 0.15}} 
                    onDragStart={(e) => e.preventDefault()}
                    >
                    {defaultOnClick ?
                        <Box m={'0.13em'}>
                            <Image 
                            src={photo.src} 
                            key={key} 
                            placeholder={'blur'}
                            blurDataURL={rgbDataURL(208, 208, 208)}
                            height={photo.height} 
                            width={photo.width} 
                            onDrag={(e) => e.preventDefault()} 
                            onClick={() => router.push(`/post/${uid}?pid=${photo.alt}`)}
                            onContextMenu={(e) => e.preventDefault()}
                            draggable={false}
                            quality={IMAGE_QUALITY}/>
                        </Box>
                    :
                        <SimpleReactLightbox>
                            <SRLWrapper>
                                <Box m={'0.13em'}>
                                    <Image src = {photo.src} key={key} height={photo.height} width={photo.width} 
                                    onDrag={(e) => e.preventDefault()} 
                                    onContextMenu={(e) => e.preventDefault()}
                                    draggable={false}
                                    quality={GALLERY_IMAGE_QUALITY}
                                    />
                                </Box>
                            </SRLWrapper>
                        </SimpleReactLightbox>
                    }
                </motion.div>
            </PostWrapper>
        ),[]
    );
    const photos = hits.map(hit => ({
        src: hit.img_url, 
        width: hit.img_width, 
        height: hit.img_height,
        alt: hit.img_key,
    }))
    return (
        <Gallery photos={photos} renderImage={imageRenderer}/>
    )
}

export const SinglePhotoComponent = ({hit}:{hit:hit}) => {
    const [isContentMenuOpen, setIsContentMenuOpen] = useState(false);
    const [ContentMenuPos, setContentMenuPos] = useState({x:0, y:0});

    const setContentMenuClose = () => {
        setIsContentMenuOpen(prev => false);
    }

    const ratio = (hit.img_width / hit.img_height)*55+'em';
    return (
        <Center>
            <motion.div 
            initial={{opacity: 0.2}} 
            animate={{opacity: 1}} 
            transition={{duration: 0.15}} 
            style={{border: '1px solid black' , boxShadow: "10px 10px 0px 0px #000000", width: ratio}}
            onDragStart={(e) => e.preventDefault()}
            >
                <Image 
                src={hit.img_url}
                alt={`photo by ${hit.user} with ${hit.CameraMake} ${hit.CameraModel}`}
                placeholder={'blur'}
                blurDataURL={rgbDataURL(188, 188, 188)}
                width={hit.img_width} 
                height={hit.img_height} 
                layout='responsive'
                quality={IMAGE_QUALITY}
                draggable={false}
                onContextMenu={(e) => {
                    e.preventDefault();
                    setContentMenuPos({x:e.clientX, y:e.clientY});
                    setIsContentMenuOpen((prev) => prev=true);
                }}
                onClick={() => setIsContentMenuOpen((prev) => prev=false)}
                />
            </motion.div>
            {isContentMenuOpen && <ContextMenu top={ContentMenuPos.y} left={ContentMenuPos.x} setContentMenuClose={setContentMenuClose}/>}
        </Center>
    )
}

export const PhotoPropertyComponent = ({hit}:{hit:hit}):JSX.Element => {
    const { colorMode } = useColorMode();
    const {DateTime, CameraMake, CameraModel, Lens, ISOSpeedRatings, 
        FNumber, ExposureTimeDenominator, ExposureTimeNumerator, 
        location, location_lat, location_lng}:hit = hit;
    return (
            <Container 
            display={'flex'} 
            justifyContent={'flex-start'} 
            p={'1rem'} 
            mt={'2rem'} 
            maxW={'container.md'} 
            bg={colorMode === 'light' ? 'white' : 'gray.800'} 
            textAlign={'left'} 
            borderRadius={'2'}
            border={'2px black solid'}
            fontFamily={'monospace'} 
            fontSize={'2xl'} 
            onContextMenu={(e) => e.preventDefault()}
        >
            
            <List pl={'1rem'}>
                <ListItem>
                    <ListIcon as={Calendar} color='green.500' />
                    Date:
                </ListItem>
                <ListItem>
                    <ListIcon as={Camera} color={'cyan.500'} />
                    Camera:
                </ListItem>
                <ListItem>
                    <ListIcon as={Cylinder} color='yellow.500' />
                    Lens:
                </ListItem>
                <ListItem>
                    <ListIcon as={FilmStrip} color='red.500' />
                    ISO/Film:
                </ListItem>
                <ListItem>
                    <ListIcon as={Aperture} color='blue.500' />
                    Aperture:
                </ListItem>
                <ListItem>
                    <ListIcon as={Aperture} color={'purple.500'} />
                    Shutter:
                </ListItem>
                <ListItem>
                    <ListIcon as={MapTrifold} color='black.500' />
                    Location:
                </ListItem>
            </List>

            <List pl={'2rem'}>
                <ListItem><BasicDate date={DateTime} size={'20'} weight='normal'/></ListItem>
                <ListItem><BasicEquipment type='camera' equipment={(CameraMake && CameraModel) ? `${CameraMake} ${CameraModel}` : CameraMake ? `${CameraMake}` : `${CameraModel}` } /></ListItem>
                <ListItem><BasicEquipment type='lens' equipment={Lens}/></ListItem>
                <ListItem><BasicEquipment type='other' equipment={String(`${ISOSpeedRatings} ASA`)}/></ListItem>
                <ListItem>{FNumber}F</ListItem>
                <ListItem>{ExposureTimeNumerator}/{ExposureTimeDenominator}</ListItem>
                <ListItem><BasicLocation location={location} location_lat={location_lat} location_lng={location_lng}/> </ListItem>
            </List>
        </Container>
    )
}

// TODO - add a way to add a photo to a list or edit photo
const ContextMenu = ({top, left, setContentMenuClose}: {top:number, left:number, setContentMenuClose:()=>void}):JSX.Element => {

    const MenuItem = ({label}:{label:string}):JSX.Element => {
        return(
            <ListItem borderTop={'1px black solid'} display={'flex'} justifyContent={'flex-start'} pl={'1em'} >
                <Text onClick={setContentMenuClose}>{label}</Text>
            </ListItem>
        )
    }

    return (
        <List position={'fixed'} top={top} left={left} bg={'white'} width={'8em'} border={'1px black solid'} color={'black'} onContextMenu={e=>e.preventDefault()}>
            <MenuItem label={'Add to List'}/>
            <MenuItem label={'Edit'}/>
        </List>
    )
}
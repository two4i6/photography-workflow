import { NextRouter, Router, useRouter } from 'next/router'

import { 
    Box, 
    Text, 
    Center, 
    IconButton,
    Breadcrumb, 
    BreadcrumbItem,
    BreadcrumbLink,
} from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { List as ListI, SquaresFour, Export} from 'phosphor-react' 
import type { hit } from '../../lib/redis.js/redis'

// components
import { CollectionComponents, CollectionContainer } from '../../components/layouts/collectioncard';
import { NotFoundComponent } from '../../components/notfound';
import { LoadingComponent } from '../../components/loading';
import { PhotoOnMapComponent } from '../../components/map';

//draggable component
import { BasicUser } from '../../components/info/userinfo'
import { BasicPostIcon, PostWrapper } from '../../components/info/postinfo'
import { GalleryComponent, SinglePhotoComponent, PhotoPropertyComponent } from '../../components/layouts/gallary';
import Link from 'next/link';

const Post = ():JSX.Element => {
    const router = useRouter();
    
    const { uid, pid, cid } = router.query;
    const [hits, setHits] = useState<Array<hit>>([]);
    const [isList, setIsList] = useState(true);
    
    const isUserNotFind = useRef(false);
    const prevPathIsCollection = useRef(false);

    useEffect(() => {
        if(!router.isReady) return; 
            const search = async () => {
            const res = await fetch(`/api/search?q=${uid}`);
            const result =  await res.json();
            setHits(result.imgInfo);
            hits.length === 0 ? isUserNotFind.current = true : isUserNotFind.current = false;
        }
        search();
    },[router.isReady])
    

    if(hits.length > 0){
        // single photo page
        if(pid){
            const selectPhoto:hit = hits.filter(hit => hit.img_key === pid)[0];
            return(
                <> 
                    <Box display={'flex'} justifyContent={'space-between'} pr={'3rem'} fontSize={'1.1em'}>
                        <BreadcrumbeComponent uid={uid as string} pid={pid as string} cid={selectPhoto.event_id} prev={prevPathIsCollection.current}/>
                        <IconButton aria-label={'Show as List'} icon={<Export size={'2em'}/>} variant={'unstyled'} />
                    </Box>
                    <TopBar uid={uid as string} />
                    <PostWrapper uid={uid as string} pid={pid as string} p='2.2em'>
                        <>
                            <BasicPostIcon h={'1em'} p='2rem'/>
                            <SinglePhotoComponent
                                hit={selectPhoto}
                        />
                        </>
                    </PostWrapper>
                    <PhotoPropertyComponent hit={selectPhoto}/>
                    <PhotoOnMapComponent hits={[...hits.filter(hit => hit.img_key === pid)]}/>
                </>
            )
        }

        // single collection page
        if(cid){
            prevPathIsCollection.current = true;
            return(
                <> 
                    <Box display={'flex'} justifyContent={'space-between'} pr={'3rem'} fontSize={'1.1em'}>
                        <BreadcrumbeComponent uid={uid as string} cid={cid as string} prev={prevPathIsCollection.current}/>
                        <IconButton aria-label={'Show as List'} icon={<Export size={'2em'}/>} variant={'unstyled'} />
                    </Box>
                    <TopBar uid={uid as string} />
                    <CollectionComponents
                    hits={[...hits.filter(hit => hit.event_id === cid)]}/>
                    <Box pos={'relative'} top={'1em'}>
                        <PhotoOnMapComponent hits={[...hits.filter(hit => hit.event_id === cid)]}/>
                    </Box>
                </>
            )
        }
        // user page
        if(uid){
            prevPathIsCollection.current = false;
            // list all photos
            if(isList){
                return(
                    <>
                        <Box display={'flex'} justifyContent={'space-between'} pr={'3rem'} fontSize={'1.1em'}>
                            <BreadcrumbeComponent uid={uid as string} cid={cid}/>
                            <IconButton aria-label={'Show as List'} icon={<ListI size={'2em'}/>} variant={'unstyled'}  onClick={()=> setIsList((prev)=>prev = !prev)} />
                        </Box>
                        <TopBar uid={uid as string} />
                        <CollectionContainer>
                            <PostWrapper uid={uid as string}>
                                <>
                                    <BasicPostIcon h='0.1em' p='1.2em'/>
                                    <Center
                                        fontFamily={'monospace'} 
                                        fontSize={'1.5rem'}
                                        fontWeight={'bold'}
                                        mb={'0.3em'}
                                        textAlign={'center'}
                                    >
                                        <Text>All Posts</Text>
                                    </Center>
                                </>
                            </PostWrapper>
                            <GalleryComponent hits={hits}/>
                        </CollectionContainer>
                        <PhotoOnMapComponent hits={hits}/>
                    </>
                )
            }else{ // display as collection
                prevPathIsCollection.current = true;
                return (
                    <>
                        <Box display={'flex'} justifyContent={'space-between'} pr={'3rem'} fontSize={'1.1em'}>
                            <BreadcrumbeComponent uid={uid as string}/>
                            <IconButton aria-label={'Show as Collections'} icon={<SquaresFour size={'34'}/>} variant={'unstyled'} onClick={()=> setIsList((prev)=>prev = !prev)} />
                        </Box>
                        <TopBar uid={uid as string} />
                        <CollectionComponents hits={hits} />
                    </>
                )
            }
        }
    }

    // if loading or not found user
    return (
        isUserNotFind.current 
        ? <NotFoundComponent children={<>User <b>{uid}</b></>} /> 
        : <Box p={'2rem'}>
            <LoadingComponent/> 
        </Box>
    )
}


const TopBar = ( {uid}:{uid:string} ):JSX.Element => {
    return (
        <Center>
            <BasicUser uid={uid} fontSize='2rem' />
        </Center>
    )
}
interface BreadcrumbeProps {
    uid:string,
    cid?:string,
    pid?:string
    isList?:boolean,
    prev?:boolean
}

const BreadcrumbeComponent = ({uid,  cid, pid, isList, prev}:BreadcrumbeProps):JSX.Element => {
    return(
            <Breadcrumb pt={'0.6em'} separator='/'>
                <BreadcrumbItem>
                    <Link href='/'>
                        <BreadcrumbLink>Home</BreadcrumbLink>
                    </Link>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <Link href={`/post/${uid}`}>
                        <BreadcrumbLink>{uid}</BreadcrumbLink>
                    </Link>
                </BreadcrumbItem>
                {( cid && prev ) &&   
                <BreadcrumbItem>
                    <Link href={`/post/${uid}?cid=${cid}`}>
                        <BreadcrumbLink >{cid}</BreadcrumbLink>
                    </Link>
                </BreadcrumbItem>}
                { pid &&
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink>Contact</BreadcrumbLink>
                </BreadcrumbItem>}
            </Breadcrumb>
    )
}

export default Post;
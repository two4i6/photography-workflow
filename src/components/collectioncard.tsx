import { 
    Container, 
    Center, 
    Button, 
    useColorMode, 
    Text, 
    Box, 
    Editable, 
    EditableInput, 
    EditablePreview 
} from '@chakra-ui/react'
import { GalleryComponent } from './layouts/gallary';

import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react';
import Link from 'next/link'

// drageabble components
import { BasicLocation } from './draggable/locationinfo'
import { BasicDate } from './draggable/dateinfo'
import { AvatarUser} from './draggable/userinfo'
import { BasicPostIcon, PostWrapper } from './draggable/postinfo'

import type { hit } from '../../lib/redis.js/redis'

interface collectionCardProp {
    hits: hit[],
    isEditable?: boolean,
    children?: JSX.Element,
}

const CollectionCardComponent = ({hits}:collectionCardProp) => {
    const hit = hits[0];
    const collectionLocation = hit ? hit.location : 'unknown';
    const collectionDate = hit ? hit.DateTime : 'unknown date';
    return (
        <CollectionContainer>
            <PostWrapper uid={hit.user} cid={hit.event_id}>
                <>
                    <BasicPostIcon h='0.1em'/>
                    <InfoBar uid={hit.user} date={collectionDate}>
                        <BasicLocation location={collectionLocation} />
                    </InfoBar>
                    <GalleryComponent hits={hits} defaultOnClick={false} />
                    <MoreLink uid={hit.user} cid={hit.event_id}/>
                </>
            </PostWrapper>
        </CollectionContainer>
    )
}

const CollectionComponment = ({hits, isEditable = false}:collectionCardProp) => {
    const hit = hits[0];
    const { status } = useSession();
    const router = useRouter();
    const collectionLocation = hit ? hit.location : 'unknown';
    const collectionDate = hit ? hit.DateTime : 'unknown date';

    return(
        <CollectionContainer>
            <PostWrapper uid={hit.user} cid={hit.event_id}>
                <>
                    <BasicPostIcon h='0.1em' p='1.2em'/>
                    <Center 
                        fontFamily={'monospace'} 
                        fontWeight={'bold'}
                        mb={'0.3em'}
                        textAlign={'center'}
                    >
                        { (status === 'authenticated' && isEditable) ?
                        <Editable defaultValue={hit.event_id} fontSize={'1.5rem'}>
                            <EditablePreview/>
                            <EditableInput type={'text'}/>
                        </Editable>
                        :
                        <Link href={`/post/${hit.user}?cid=${hit.event_id}`}>
                            <Button variant={'unstyled'}>
                                <Text fontSize={'1.5rem'}>{hit.event_id}</Text>
                            </Button>  
                        </Link> }
                    </Center>
                </>
            </PostWrapper>
            <GalleryComponent hits={hits}/>
            <Box 
                pt='1.5rem' 
                pl={'0.5rem'}
                fontFamily={'monospace'}
            >
                <BasicDate date={collectionDate} size='1rem'/>
                <BasicLocation location={collectionLocation}/>
            </Box>
        </CollectionContainer>
    )
}

const MultipleCollectionComponents = ({hits, variant}:{hits:hit[], variant:string}) => {
    let collectionList:collectionCardProp[] = [];
    const collectionIDList:string[] = Array.from(new Set(hits.map(({ event_id, DateTime, }: hit) => event_id)));

    for(let i = 0; i < collectionIDList.length; i++){
        const tmp = hits.filter((hit:hit) => hit.event_id === collectionIDList[i])[0];
        const hitList:hit[] = hits.filter((hit:hit) => hit.event_id === collectionIDList[i]);

        collectionList.unshift({ hits: hitList});
    }

    if(variant === 'card'){
        return (
            <> 
            { collectionList.map(({hits}, index) => 
                <CollectionCardComponent
                    hits={hits}
                    key={hits[index].img_url}
                />
            )}
            </>
        )
    }else{
        return (
            <>
            { collectionList.map(({hits}, index) => 
                <CollectionComponment
                    hits={hits}
                    key={hits[index].img_url}
                />
            )}
            </>
        )
    }
}
export const CollectionCardComponents = ({hits}:{hits:hit[]}) => MultipleCollectionComponents({hits, variant: 'card'});
export const CollectionComponents = ({hits}:{hits:hit[]}) => MultipleCollectionComponents({hits, variant: ''});

export const CollectionContainer = ({children, maxW='container.md'} : {children:JSX.Element[]|JSX.Element, maxW?:string}):JSX.Element => {
    const { colorMode } = useColorMode();
    return(
        <Container                
            variant={colorMode === 'light' ? 'with-shadow' : 'with-shadow-dark'}
            p={'0.2rem'}
            mt={['1rem','1.5rem']}
            mb={['2rem','3rem']}
            maxW={maxW}
            border='2px' 
            borderColor='black' 
            borderRadius={'0.2rem'}
        >
            {children}
        </Container>
    )
}

const InfoBar = ({uid, date, children}:{ uid:string, date:string, children:JSX.Element}):JSX.Element => {
    return(
        <Center 
            alignContent={'center'} 
            justifyContent={'space-between'} 
            p='0.3em' 
            fontFamily={'monospace'}
        >
            <AvatarUser uid={uid}>
                <BasicDate date={date} />
            </AvatarUser>
            {children}
        </Center>
    )
}

const MoreLink = ({uid, cid}:{uid:string, cid:string}):JSX.Element => {
    return(
        <Center>
            <Link href={`/post/${uid}?cid=${cid}`}>
                <Button variant={'unstyled'} fontSize={'0.9rem'} m={'auto'} height={'2rem'}>
                    View More
                </Button>  
            </Link>  
        </Center>
    )
}
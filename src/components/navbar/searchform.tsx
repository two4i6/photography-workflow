import { Input, 
    Box, 
    Text, 
    SimpleGrid, 
    Container,
    Button,
    Center,
    useColorMode,
} from "@chakra-ui/react"
import { useState } from "react";
import { motion } from 'framer-motion';
import Link from 'next/link'
import Image from 'next/image'

import type { hit } from '../../../lib/redis.js/redis'

// draggable components
import { BasicUser } from "../draggable/userinfo";
import { BasicEquipment } from "../draggable/equipment";
import { PostWrapper } from "../draggable/postinfo";

// Use in navbar
const SearchFormComponent = ():JSX.Element => {
    const { colorMode } = useColorMode();
    return (
        <motion.div 
        initial={{opacity: 0}} 
        animate={{opacity: 1}} 
        transition={{duration: 0.3}}
        style={{position: 'fixed', top: '5rem', right: '0.55rem',}}
        >
            <Container 
            variant={colorMode === 'light' ? 'with-shadow' : 'with-shadow-dark'}
            position={'fixed'} 
            top={'5rem'} 
            right={['0','0.55rem']} 
            p={'0.5rem'} 
            bg={colorMode === 'light' ? 'white' : 'gray.800'} 
            border={'2px black solid'} 
            borderRadius={'0.2rem'} 
            maxH={'container.md'}
            maxW={['container.sm','30%']}
            overflow={'auto'}
            >
                <SearchForm />
            </Container>
        </motion.div>
    )
}

export function SearchForm():JSX.Element {
    const [hits, setHits] = useState<Array<hit>>([]);

    const search = async (e:React.ChangeEvent<HTMLInputElement>) => {
        const q = e.target.value
        if(q.length > 2){
            const params = new URLSearchParams({q});
            const res = await fetch(`/api/search?${params}`);
            const result =  await res.json();
            setHits(() => result.imgInfo);
        }else{
            setHits([]);
        }
    }

    return (
        <>
            <Input 
                fontFamily={'monospace'}
                variant={"unstyled"} 
                textAlign="center"
                placeholder="Search" 
                fontWeight={500}
                fontSize={'2xl'}
                onChange={search}
            />
                {hits && hits.length > 0 &&
                <>
                    {ShowUserResult(hits)}
                    <hr />
                    {ShowPhotoResult(hits)}
                    <ViewMoreButton />
                </>}
        </>
    )
}

const ShowUserResult = (hits: hit[]):JSX.Element[] => {
    // filter out the unique user ids
    const userList:string[] = Array.from(new Set(hits.map(({ user }: hit) => user)));
    return userList.map((user:string) => 
        <BasicUser uid={user} key={user}/>
    )
}

// todo add this function
const ShowEquipmentResult = (hits: hit[]):JSX.Element => {
    return (
        <>
        </>
    )
}

const ShowPhotoResult = (hits: hit[]):JSX.Element => {
    const { colorMode } = useColorMode();
    return (
        <SimpleGrid 
            minChildWidth={125} 
            spacing={30} 
            p={'1rem'}
            bg={colorMode === 'light' ? 'white' : 'gray.800'} 
        >
            {hits.map(({img_url, img_key, user, CameraModel, CameraMake, img_height, img_width}: hit) => 
            <Link href={`/post/${user}?pid=${img_key}`} key={img_key}> 
                <Box margin={'auto'} key={img_key}  > 
                    <motion.div 
                        initial={{opacity: 0}} 
                        animate={{opacity: 1}} 
                        transition={{duration: 1}} 
                        style={{border: '1px solid black', boxShadow: "10px 10px 0px 0px #000000"}}
                        >
                            <PostWrapper uid={user} pid={img_key}>
                                <>
                                    <Center>
                                        <Image 
                                            src={img_url} 
                                            alt={`photo by ${user} with ${CameraMake} ${CameraModel}`}
                                            width={img_width} 
                                            height={img_height} 
                                            layout={'intrinsic'}
                                            quality={'10'}
                                        />
                                    </Center>
                                    <Box 
                                        display={'flex'} 
                                        flexDir={'column'} 
                                        alignItems={'left'} 
                                        justifyContent={'space-around'} 
                                        bg={colorMode === 'light' ? 'white' : 'gray.600'}  
                                        fontFamily={'monospace'}
                                        pl={'0.5rem'}
                                    >
                                        <Text fontSize={'12'}>@{user}</Text>
                                        <Text fontSize={'12'}>{CameraMake} {CameraModel}</Text>
                                    </Box>
                                </>
                            </PostWrapper>
                    </motion.div>
                </Box>
            </Link>
            )}
        </SimpleGrid>
    )
}

const ViewMoreButton = ():JSX.Element => {
    return (
        <Center pt={'0.5em'}>
            <Button variant={'unstyle'}>
                View More
            </Button>
        </Center>
    )
}

export default SearchFormComponent;
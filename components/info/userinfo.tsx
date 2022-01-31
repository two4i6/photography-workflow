import { Box, Center, Text, Avatar, Button, Link,  useColorMode } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'


interface UserProp{
    uid : string,
    children?: JSX.Element,
    fontSize?: string,
}

const onDragStart = (e:any, uid:string) => {
    e.dataTransfer.setData("uid", uid);
}

export const AvatarUser = ({uid, children, fontSize}:UserProp): JSX.Element => {
    const router = useRouter();
    const openUserPage = () => router.push(`/post/${uid}`);

    return(
        <Button variant={'unstyled'} onClick={(e)=>e.preventDefault()}>
            <Center 
                draggable={true} 
                onClick={()=> openUserPage()}
                onDragStart={(e) => onDragStart(e, uid)}
            >
                <Avatar size={'sm'} name={uid}></Avatar>
                <Box textAlign={'left'} pl={'0.5em'}>
                    <Text 
                        fontSize={fontSize}
                        ontWeight={'bold'} 
                        fontFamily={'monospace'}
                    >
                        {uid}
                    </Text>
                    {children}
                </Box>
            </Center>
        </Button>
    )
}

export const BasicUser = ({uid, children, fontSize}:UserProp): JSX.Element => {
    return(
        <NextLink href={`/post/${uid}`}>
            <Link 
                colorScheme='black' 
                value={'test'}
                variant='ghost' 
                fontFamily={'monospace'} 
                draggable={true}
                fontSize={fontSize}
                onDragStart={(e) => onDragStart(e, uid)}
            >
                @{uid}
            {children}
            </Link>
        </NextLink>
        
    )
}
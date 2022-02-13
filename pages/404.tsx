import type { NextPage } from 'next'
import { Box, Container, Text, Button, DarkMode } from '@chakra-ui/react'
import { NotFoundComponent } from '../components/notfound'
import { IndexPage } from '../components/test'

import { useTheme, useThemeUpdate } from '../components/TestContect'


const Page: NextPage = () => {

    const darkTheme = useTheme();
    const toggleTheme = useThemeUpdate();


    return (
        <>  
            <Text 
            as={'h1'}
            textAlign={'center'} 
            p={3} 
            mt={6} 
            fontSize={[48, 72]} 
            fontWeight={'bold'}
            >
                404
            </Text>
            <NotFoundComponent children={<>The <b>Page</b></>} />
        </>
    )
}
export default Page
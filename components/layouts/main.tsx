import Head from "next/head"
import { 
    Box, 
    Container, 
    Breadcrumb, 
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
} from "@chakra-ui/react"
import React, { useState} from 'react'

import NavBar from "../fixed/navbar"
import { FileDropComponent }  from '../uploadbox';


interface LayoutProps {
    children: JSX.Element,
    router: any
}

const Main = ({ children, router }: LayoutProps) => {
    const [isDrag, setIsDrag] = useState(false);

    return (
        <Box 
            minH={'100vh'}
            onDragOver={e=> {e.preventDefault(); setIsDrag(true);}}
        >
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="author" content="@terry_w" />
                <title>Some App</title>
            </Head>

            <Container 
                maxW={"container.lg"} 
                pt={['1rem', '5.5rem']} 
            >
                {children}
            </Container>

            <NavBar path={router.pathname}/>
            
            {isDrag && 
                <FileDropComponent tmpFunc={setIsDrag}/>
            } 
        </Box>
    )
}

export default Main


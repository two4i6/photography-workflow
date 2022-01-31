import { 
    useColorMode, 
    Text,
    Center,
    Container
} from "@chakra-ui/react";
import { SearchForm } from "./fixed/searchform";

export const NotFoundComponent = ( {children}:{children:JSX.Element} ):JSX.Element => {
    const { colorMode } = useColorMode();
    return(
        <Center pt={'3rem'} display={'flex'} flexDir={'column'}>
            <Text 
                fontSize={['3xl','5xl']} 
                fontFamily={'monospace'} 
                pb={'5rem'}
            >
                We Can't Find {children}
            </Text>
            <Container
            maxW={'container.md'} 
            bg={colorMode === 'light' ? 'white' : 'gray.800'}  
            p={'0.5rem'} 
            border='2px black solid' 
            borderRadius={'0.2em'} 
            variant={colorMode === 'light' ? 'with-shadow' : 'with-shadow-dark'}
            >
                <SearchForm/>
            </Container>
        </Center>

    )
}
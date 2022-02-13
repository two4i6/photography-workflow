import type { NextPage } from 'next'
import { Text } from '@chakra-ui/react'
import { NotFoundComponent } from '../components/notfound'
const Page: NextPage = () => {
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
            <NotFoundComponent>
                <>The <b>Page</b></>
            </NotFoundComponent>
        </>
    )
}
export default Page
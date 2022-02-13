import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'
import Layout from '../components/layouts/main'
import theme from '../../lib/theme'


const MyApp = ({ Component, pageProps, router }: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      <SessionProvider>
        <Layout router={router} >
              {<Component {...pageProps} key={router.route}/>}
        </Layout>
      </SessionProvider>
    </ChakraProvider>
  )
}

export default MyApp

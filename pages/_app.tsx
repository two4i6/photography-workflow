import type { AppProps } from 'next/app'
import { ChakraProvider, layout } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'
import SimpleReactLightbox from 'simple-react-lightbox'
import Layout from '../components/layouts/main'
import theme from '../lib/theme'
import { ThemeProvider } from '../components/TestContect'


const MyApp = ({ Component, pageProps, router }: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      <SessionProvider>
      <Layout  router={router} >
        <SimpleReactLightbox>
          <ThemeProvider>
            {<Component {...pageProps} key={router.route}/>}
          </ThemeProvider>
        </SimpleReactLightbox>
      </Layout>
      </SessionProvider>
    </ChakraProvider>
  )
}

export default MyApp

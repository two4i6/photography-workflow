import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const styles = {
    global: (props:any) => ({
        body: {
            bg: mode('#ffefe5', 'gray.700')(props)
        }
    })
};

const components = {
    Container: {
        variants: {
            'with-shadow': {
                bg: 'white',
                boxShadow: '-20px 25px 3px 0px rgba(106, 47, 47, 0.2)',
                borderRadius: '2px'        
            },
            'with-shadow-dark': {
                bg: 'gray.800',
                boxShadow: '25px 20px 3px 0px rgba(0, 0, 0, 0.1)',
                borderRadius: '2px'        
            },
            'with-dot': {
                bg: 'radial-gradient(#000 1px, transparent 1px)',
                backgroundSize : '15px 15px',
            },
            'with-dot-dark': {
                bg: 'radial-gradient(#ffefe5 1px, transparent 1px)',
                backgroundSize : '15px 15px',
            },
        }
    }
}

const config = {
    initialColorMode: "light",
    useSystemColorMode: true,
}

const theme = extendTheme({styles, config, components});

export default theme;





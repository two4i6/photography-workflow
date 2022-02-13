import { Center, useColorMode } from "@chakra-ui/react"
import { motion, useTransform, useViewportScroll, useSpring } from "framer-motion"

const loadingContainerVariants = {
    start: {
        transition: {
        staggerChildren: 0.2,
        },
    },
    end: {
        transition: {
        staggerChildren: 0.2,
        },
    },
}

const loadingCircleVariants = {
    start: {
        y: "0%",
    },
    end: {
        y: "100%",
    },
}

const loadingCircleTransition = {
    duration: 0.5,
    yoyo: Infinity,
    ease: "easeInOut",
}

const loadingContainer = {
    width: '9rem',
    height: '4rem',
    display: 'flex',
    justifyContent: 'space-around',
}

export const LoadingComponent =( ):JSX.Element => {
    const { colorMode } = useColorMode();
    
    const loadingCircle = {
        display: 'block',
        width: '1em',
        height: '3em',
        borderRadius: '1em',
        backgroundColor: colorMode === 'light' ? 'black' : 'white',
    }

    return(
        <Center mt={'5em'}>
            <motion.div
            style={loadingContainer}
            variants={loadingContainerVariants}
            initial="start"
            animate="end"
            >
            <motion.span
                style={loadingCircle}
                variants={loadingCircleVariants}
                transition={loadingCircleTransition}
            />
            <motion.span
                style={loadingCircle}
                variants={loadingCircleVariants}
                transition={loadingCircleTransition}
            />
            <motion.span
                style={loadingCircle}
                variants={loadingCircleVariants}
                transition={loadingCircleTransition}
            />
            </motion.div>
        </Center>
    )
}
import { Box, Container, Text, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";


const Logo = () => {
    const logo = useColorModeValue("/logo.png", "/logo-dark.png");

    return(
        <Link href="/">
            <a>
            </a>
        </Link>
    );
}

export default Logo;

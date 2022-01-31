import { Box, Container, Text, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import styled from "@emotion/styled";

const LogoBox = styled.span`

`;

const Logo = () => {
    const logo = useColorModeValue("/logo.png", "/logo-dark.png");

    return(
        <Link href="/">
            <a>
                <LogoBox>
                </LogoBox>
            </a>
        </Link>
    );
}

export default Logo;

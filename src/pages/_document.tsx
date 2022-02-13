import { ColorModeScript } from "@chakra-ui/react";
import NextDoucment, {Html, Head, Main, NextScript} from "next/document";
import theme from "../../lib/theme";

export default class MyDocument extends NextDoucment {
    render(): any{
        return (
            <Html lang="zh">
                <Head />
                <body>
                    <ColorModeScript initialColorMode={theme.config.initalColorMode}  />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}
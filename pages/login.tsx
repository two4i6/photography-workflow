import { useSession, signIn, signOut } from "next-auth/react"
import { Image } from "@chakra-ui/react";
import { ImageLoader } from "next/image";

export default function Component() {
    const { data: session } = useSession();

    //console.log(session);

    if (session) {
    return (
        <>
        Signed in as {session.user?.name} <br />
        Email verified: {session.user?.email ? "Yes" : "No"} <br /> 
        <Image src={session.user?.image as string}/>
        <button onClick={() => signOut()}>Sign out</button>
        </>
    )
    }
    return (
    <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
    </>
    )
}
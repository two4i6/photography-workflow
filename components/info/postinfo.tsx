import { DotsThree } from "phosphor-react"
import {Box, Center, Text} from "@chakra-ui/react"
import { motion } from "framer-motion"

interface eventProp {
    uid?: string,
    cid?: string,
    pid?: string,
    h?: string,
    p?: string,
    children?: JSX.Element,
}


const onDragStart = (e:any, data:eventProp) => {
    
    const postData = {
        title: data.pid ? `${data.uid}'s photo` : data.cid ? `${data.uid}'s collection#${data.cid}` : `${data.uid}'s post`,
        url: data.pid ? `/post/${data.uid}?pid=${data.pid}` : data.cid? `/post/${data.uid}?cid=${data.cid}` : `/post/${data.uid}` ,
        type: data.pid ? 'photo' : data.cid ? 'collection' : 'post',
    };
    e.dataTransfer.setData("post", JSON.stringify(postData));
}

export const BasicPostIcon = ({h='2rem' , p='0rem'}:eventProp ): JSX.Element => {
    return(
        <Center 
            display={['none','flex']}
            flexDir={'column'}
            h={h}
            pb={p}
        >   
            <motion.div 
                whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.1 },
                }}
                style={{height: h }}
            >
                <DotsThree size={33}/>
            </motion.div>
        </Center>
    )
}

export const PostWrapper = ({uid, cid, pid, children, p}:eventProp): JSX.Element => {
    return(
        <Box 
            display={ children && 'flex'}
            flexDir={ children && 'column'}
            draggable={true}
            onDragStart={(e)=> onDragStart(e, {uid:uid, cid:cid, pid:pid})}
            pt={p}
        >   
            {children}
        </Box>
    )
}
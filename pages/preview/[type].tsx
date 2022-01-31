
import { NextRouter, Router, useRouter } from 'next/router'
import { motion } from "framer-motion"

const ImageHolder = ({src}:{src:string}):JSX.Element => {
    return (
        <motion.img 
        initial={{opacity: 0}} 
        animate={{opacity: 1}} 
        transition={{duration: 0.3}} 
        style={{border: '1px solid black' , boxShadow: "10px 10px 0px 0px #000000", margin: 'auto', maxHeight: '55vw'}}
        src={src}
        />
    )
}

const PreviewComponent = ():JSX.Element => {
    const router:NextRouter = useRouter();
    const { type, src } = router.query;
    console.log(src);

    return (
        <div>
            <ImageHolder src={src as string} />
        </div>
    )
}

export default PreviewComponent;
import React, { useRef, useState, useEffect } from 'react';
import { 
    Input,
    Box,
    Text,
    Container,
    SimpleGrid,
    IconButton,
    Progress,
    Center,
    useColorMode,
} from '@chakra-ui/react';
import { 
    X, 
    Upload, 
    Check, 
    CloudArrowUp, 
    CircleNotch,
    CaretDown
} from 'phosphor-react';
import { motion } from 'framer-motion';
import { useS3Upload } from 'next-s3-upload';
import EXIF from 'exif-js';
import { IsImage } from '../lib/filechecker';
import { useSession, signIn, signOut } from "next-auth/react"
import Link from 'next/link';
import type { hit } from '../lib/redis.js/redis';

interface UploadFileState {
    file: File ;
    objurl: string;
    uploading: boolean;
    uploaded: boolean;
    error: string | null;
    hit:hit;
}

const hitTemplate:hit = {
    user: '',
    event_id: '',
    img_url: '',
    img_key: '',
    img_width: 0,
    img_height: 0,
    DateTime: '',
    CameraMake: '',
    CameraModel: '',
    Lens: '',
    ISOSpeedRatings: 0,
    ExposureTimeDenominator: 0,
    ExposureTimeNumerator: 0,
    FNumber: 0,
    description: '',
    location: '',
    location_lat: 0,
    location_lng: 0,
}

// todo: 无文件时提示
const DropFileInput = () => {
    const { colorMode } = useColorMode();

    //DEBUG RENDER COUNTER
    const renderCounter = useRef(0);
    useEffect (() => {
        renderCounter.current = renderCounter.current + 1;
        console.log('dropBox:', renderCounter);
    })

    const {data: session} = useSession();
    let user = session ? session.user : null;
    let uid = user ? user.name as string : 'Guest'; 

    const [fileList, setFileList] = useState<Array<UploadFileState>>([]);
    const { FileInput, openFileDialog, uploadToS3 } = useS3Upload();
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const mainBody = useRef<HTMLDivElement|null>();
    const eventIDRef = useRef<string>(Date.now().toString());

    // 当拖动到此元素时，但还没有释放
    const dragOverHandler = (e: React.DragEvent<HTMLDivElement>):void => {
        e.preventDefault();
        if(mainBody.current){
            mainBody.current.style.backgroundColor = 'rgba(255, 209, 71, 0.6)';
        }
    }

    // 当拖离开此元素时
    const dragLeaveHandler = (e: React.DragEvent<HTMLDivElement>):void => {
        if(mainBody.current){
            mainBody.current.style.backgroundColor = '';
        }
    }

    // 当拖动到此元素时，并且释放
    const drogHandler = (e: any):void => {
        dragEndHandler(e);
        e.preventDefault(); // 阻止默认事件


        // upload through normal file drop
        if(e.dataTransfer.files.length > 0){
            imageChecker(e.dataTransfer.files);
            return;
        }

        // TODO upload through todo item drop
        if(e.dataTransfer.getData('image')){

        }
        /*
        const todoItem = e.dataTransfer.getData('todoItem');
            if(JSON.parse(todoItem)){
                const todoObj = JSON.parse(todoItem);
                console.log(typeof(todoObj.file.blob));
                let blob = fetch(todoObj.file.blob).then(r => r.blob());
                console.log(blob);
                //imageChecker(new File([file.blob], file.fileName));
            }
        */
        
    }

    // 当拖动结束时
    const dragEndHandler = (e: React.DragEvent<HTMLDivElement>):void => {
        e.preventDefault();
        dragLeaveHandler(e);
    }

    // 处理INOUT 事件
    const imageHandler = (e: React.ChangeEvent<HTMLInputElement> ) => {
        if(e.target.files){
            imageChecker(e.target.files);
        }
    }

    // 检查文件格式并加入STATE
    const imageChecker = (files:any) => {
        const fileList = Array.from(files)
            .filter((file:any) => 
                (IsImage(file)) ? file : alert('Please drop valid image file'))
            .map((file:any) => ({src: URL.createObjectURL(file), file: file, size: file.size, hit: {...hitTemplate}}));
        setFileList((prevList: any) => (prevList.concat(fileList)));
        Array.from(files).map((file: any):void => URL.revokeObjectURL(file)); //释放一个之前已经存在的、通过调
    }

    // 获取图片信息
    const getImageInfo = (e:React.SyntheticEvent<HTMLImageElement, Event>) => {
        const tmpImg = new Image();
        tmpImg.src = e.currentTarget.src;

        const tmpFileList = [...fileList];
        const index = tmpFileList.findIndex((item: any) => item.src === e.currentTarget.src);
        const tmpFileObj:UploadFileState = tmpFileList[index]
        const tmpFile:File = tmpFileObj['file'];
        const tmpFileProp:hit = tmpFileObj['hit'];

        // Set the image width and height to the state property
        tmpFileProp.img_width = tmpImg.width;
        tmpFileProp.img_height = tmpImg.height;

        // Set the image exif data to the state property
        EXIF.getData(tmpImg, function() {
            if (EXIF.pretty(this)) {
                const exifData = EXIF.getAllTags(this);
                tmpFileProp.DateTime = exifData.DateTime;
                tmpFileProp.CameraMake = exifData.Make;
                tmpFileProp.CameraModel = exifData.Model;
                tmpFileProp.Lens = exifData.undefined;
                tmpFileProp.ISOSpeedRatings = exifData.ISOSpeedRatings;
                tmpFileProp.ExposureTimeDenominator = exifData.ExposureTime.denominator;
                tmpFileProp.ExposureTimeNumerator = exifData.ExposureTime.numerator;
                tmpFileProp.FNumber = exifData.FNumber.numerator / exifData.FNumber.denominator;
                // TODO 测试
                tmpFileProp.description = 'test file description';
                tmpFileProp.location = 'Chalottetown, Canada';
                tmpFileProp.location_lat = 46.238888 + Math.random() * 0.1
                tmpFileProp.location_lng = -63.129166 + Math.random() * 0.1;;
                console.log("EXIF data found in image '" + tmpFile.name + "'.");
            } else {
                console.log("No EXIF data found in image '" + tmpFile.name + "'.");
            }
        });
        tmpFileObj.hit = tmpFileProp;

        // write to original list
        setFileList((prevFileList: any) => {
            const NewList = [...prevFileList];
            NewList[index] = tmpFileObj;
            return NewList;
        });
        console.log(fileList);
    }

    // 上传图片
    const handleFileChange = async (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setUploadProgress(1);
        for(let i = 0; i < fileList.length; i++){
            // 上传中
            console.log('uploading..., current:', i, 'total:', fileList.length, fileList[i].file.name);
            fileList[i].uploading = true; 
            let upload = await uploadToS3(fileList[i]['file']);

            // save keys to database
            const res = await fetch('/api/update', {
                body: JSON.stringify({
                    user: uid, 
                    event_id: eventIDRef.current,
                    img_url: upload.url,
                    img_key: upload.key, 
                    img_width: fileList[i].hit.img_width,
                    img_height: fileList[i].hit.img_height,
                    DateTime: fileList[i].hit.DateTime,
                    CameraMake: fileList[i].hit.CameraMake,
                    CameraModel: fileList[i].hit.CameraModel,
                    Lens: fileList[i].hit.Lens,
                    ISOSpeedRatings: fileList[i].hit.ISOSpeedRatings,
                    ExposureTimeDenominator: fileList[i].hit.ExposureTimeDenominator,
                    ExposureTimeNumerator: fileList[i].hit.ExposureTimeNumerator,
                    FNumber: fileList[i].hit.FNumber,
                    location: fileList[i].hit.location,
                    location_lat: fileList[i].hit.location_lat,
                    location_lng: fileList[i].hit.location_lng,
                    description: fileList[i].hit.description,
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });
            const result = await res.json();
            
            fileList[i].uploading = false;
            fileList[i].uploaded = true;
            setUploadProgress((prev) => prev + 100/fileList.length);
        }
    }

    // 移出图片
    const triggerDelete = (source:any) => {
        //if(window.confirm("Are you sure you want to remove this image?")){
            setFileList((prevList)=>
                [...prevList].filter((item: any) => item.src !== source)
            );
    }

    const renderImages = (source: any):JSX.Element => {
        const iconSize:number = 25;
        return source.map(({src, size, uploaded, uploading}:any) =>(
            <Box  margin={'auto'} key={src}> 
                <motion.div 
                initial={{opacity: 0}} 
                animate={{opacity: 1}} 
                transition={{duration: 2}} 
                style={{border: '1px solid black' ,maxWidth: '100%', maxHeight: '100%' , boxShadow: "10px 10px 0px 0px #000000"}}
                >
                    <img src={src} alt='uploading image' onDragStart={(e) => e.preventDefault()} onLoad={getImageInfo}/> 
                    {uploading 
                    ?   <Box display={'flex'} alignItems={'center'} justifyContent={'space-around'} bg={colorMode === 'light' ? 'white' : 'blue.600'}>
                            <Text fontSize={'21'}>{(size/1000000).toFixed(1)} MB</Text>
                            <CloudArrowUp size={iconSize} />
                        </Box>
                    : !uploaded 
                    ?   <Box display={'flex'} alignItems={'center'} justifyContent={'space-around'} bg={colorMode === 'light' ? 'white' : 'gray.600'}>
                            <Text fontSize={'21'}>{(size/1000000).toFixed(1)} MB</Text>
                            <X size={iconSize} onClick={() => triggerDelete(src)}/> 
                        </Box>
                    :   <Box display={'flex'} alignItems={'center'} justifyContent={'space-around'} bg={colorMode === 'light' ? 'white' : 'green.600'}>
                            <Text fontSize={'21'}>{(size/1000000).toFixed(1)} MB</Text>
                            <Check size={iconSize} />       
                        </Box>}
                </motion.div>
            </Box>
        ))
    }
    const variant:string = colorMode === 'light' ? 'with-dot' : 'with-dot-dark';
    return (
        <Box>
            {/* photo holder */}
            <Container
                ref={mainBody}
                onDrop={drogHandler}  
                onDragOver={dragOverHandler}
                onDragLeave={dragLeaveHandler}
                onDragEnd={dragEndHandler}
                variant={variant}
                minH={['0vh','9vh']}
                p={'1.2em'}
            >
                { uploadProgress >= 99
                ? <Text fontSize={'5xl'}>All Files Uploaded</Text> 
                : uploadProgress === 0
                ? <></>
                : <Progress value={uploadProgress} size={'lg'} />}
                <SimpleGrid minChildWidth='125px' spacing='30px'>
                    {renderImages(fileList)}
                </SimpleGrid>
            </Container>
            
            <Input 
                opacity={[1,0]}
                type={'file'} multiple 
                onChange={imageHandler} 
                variant={'unstyled'}
                width={'100%'} 
                height={'9vh'}
                display={['block', 'none']}
            />

            {/* Submit Button */}
            {uploadProgress >= 90
            ? <Link href={`/post/${uid}?cid=${eventIDRef.current}`}><IconButton aria-label='upload done' variant='outline' size='lg' border={'none'} onClick={()=>{setFileList([]); setUploadProgress(0)}} icon={<Check size={'35'}/>}/></Link>
            : uploadProgress === 0 
            ? <IconButton aria-label='upload image' variant='outline' size='lg' border={'none'} onClick={handleFileChange} icon={<Upload size={'35'}/>} />  
            : <motion.div 
                animate={{rotate: 360}} 
                transition={{duration: 1.5, repeat: Infinity}} >
                <Center>
                    {<CircleNotch size={'35'}/>}
                </Center>
            </motion.div>}
        </Box>
    );
}

export const FileDropComponent = ({tmpFunc}:{tmpFunc:Function}):JSX.Element => {
    const { colorMode } = useColorMode();
    const { status } = useSession();
    if (status === 'authenticated') {
        return (
            <motion.div 
            initial={{opacity: 0}} 
            animate={{opacity: 1}} 
            transition={{duration: 0.5}}
            style={{position: 'fixed', top: '5rem', right: '0.55rem'}}
            >
                <Container 
                    bg={colorMode === 'light' ? 'white' : 'gray.800'}
                    maxW={["container.sm" ,'20rem' ,"30rem"]}
                    maxH={["container.sm" , "container.lg"]} 
                    position={'fixed'} 
                    right={['0','0.2rem']} 
                    bottom={['0','0.2rem']}            
                    textAlign={'center'}
                    border='2px black solid' 
                    borderRadius={'0.2rem'} 
                    variant={colorMode === 'light' ? 'with-shadow' : 'with-shadow-dark'}
                >
                    <IconButton 
                        aria-label='drop-box-switch' 
                        variant='outline'
                        onClick={()=>tmpFunc((prevState:boolean) => prevState = !prevState)}
                        width={'100%'}
                        size={'lg'}
                        h={'1.5rem'}
                        borderStyle={'none'}
                        icon={ <CaretDown size={35}/> }
                    />
                    <DropFileInput  />
                    </Container>
                </motion.div>
        );
    }
    return <></>;
}

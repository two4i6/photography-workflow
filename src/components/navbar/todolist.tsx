// todo: todolist组件
import { 
    Center, 
    Text, 
    IconButton, 
    List, 
    ListItem, 
    Box, 
    Checkbox, 
    Input, 
    Editable, 
    EditableInput, 
    EditablePreview, 
    Flex,
    Link,
    Tooltip,
    Container,
    useColorMode,
} from '@chakra-ui/react';
import { 
    Plus, 
    Trash, 
    File, 
    Image, 
    Calendar, 
    MapPin, 
    GlobeHemisphereWest, 
    BookmarkSimple, 
    Question, 
    Camera,
    Cylinder,
    Lightning,
    Minus,
} from 'phosphor-react';
import React, { useRef, useState } from 'react';
import { FileTypeChecker } from '../../../lib/filechecker'
import NextLink from 'next/link'
import { BasicUser } from '../draggable/userinfo'

// todo: turn todolist to a text editer
interface TodoItem {
    id: number,
    title: string,
    completed: boolean,
    note?: {
        date?: string,
        location?: string,
        user?: string,
    },
    file?: {
        type: string,
        file: File,
        fileName: string,
        blob: string,
    },
    post?: {
        title: string,
        type: string,
        url: string,
    },
    equipment?: {
        camera: string,
        lens: string,
        other: string,
    }
}
interface IconGroupProps {
    note?: {
        date?: string,
        location?: string,
        user?: string,
    },
    file?: {
        type: string,
        file: File,
        fileName: string,
        blob: string,
    },
    post?: {
        title: string,
        type: string,
        url: string,
    },
    equipment?: {
        camera: string,
        lens: string,
        other: string,
    }
}
interface TodoListProp {
    uid?: string,
    id? : number,
}

const TodoList = ({id = Date.now(), uid = 'guest'}:TodoListProp):JSX.Element => {
    const { colorMode } = useColorMode();
    // template
    const demoTodos: TodoItem[] = [
        {id: Date.now()-10, title: 'Grab something', completed: true, note: {location: 'Charlottetown, PE', user: uid, date: new Date().toLocaleDateString()}},
        {id: Date.now()-20, title: 'New', completed: false,},
    ]

    // state
    const [todos, setTodos] = useState<Array<TodoItem>>(demoTodos); // data

    // if drag item is todo item
    const dragedTodoItem = useRef<boolean>(false); 
    //todo need fix
    const getDragedTodoItemRef = () => dragedTodoItem.current;

    const handleEmptyText = (e:React.FormEvent<HTMLInputElement>, id: number):void => {
        if(e.currentTarget.value === '') {
            e.currentTarget.value = ' ';
        }
    }

    // when item is drop to list Item
    const handleDropToListItem = (e:React.DragEvent<HTMLElement>, id:number):void => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.preventDefault();

        // if the item is file
        if(e.dataTransfer.files.length > 0) {
            let fileType:string = FileTypeChecker(e.dataTransfer.files[0]);
            let fileName:string = e.dataTransfer.files[0].name;
            setTodos((prevState:TodoItem[]) => {
                const NewTodos:TodoItem[] = [...prevState];
                const index = NewTodos.findIndex((item:TodoItem) => item.id === id);
                NewTodos[index].file = {type: fileType, file: e.dataTransfer.files[0], fileName: fileName, blob: URL.createObjectURL(e.dataTransfer.files[0])};
                console.log('file added',index, NewTodos[index].file);
                return NewTodos;
            });
            return;
        }

        const editNote = (
            index:number, 
            date=todos[index].note?.date, 
            location=todos[index].note?.location, 
            user=todos[index].note?.user 
            ) => {
            setTodos((prevState:TodoItem[]) => {
                const NewTodos:TodoItem[] = [...prevState];
                NewTodos[index].note = {date: date, location: location, user: user,};
                return NewTodos;
            });
        }

        // find item index by its id
        const findItemIndexByID = (id:number) => {
            return todos.findIndex((item:TodoItem) => item.id === id);
        }

        // if the item is user
        if(e.dataTransfer.getData("uid")) {
            editNote(findItemIndexByID(id), undefined, undefined, e.dataTransfer.getData("uid"));
            console.log('user added', e.dataTransfer.getData("uid"));
            return;
        } 
        
        // if the item is location
        if (e.dataTransfer.getData("location")) {
            editNote(findItemIndexByID(id), undefined, e.dataTransfer.getData("location"), undefined);
            console.log('location added', e.dataTransfer.getData("location"));
            return;
        }

        // if the item is date
        if (e.dataTransfer.getData("date")) {
            editNote(findItemIndexByID(id), e.dataTransfer.getData("date"), undefined, undefined);
            console.log('location date', e.dataTransfer.getData("date"));
            return;
        }

        // if the item is post
        if (e.dataTransfer.getData("post")) {
            setTodos((prevState:TodoItem[]) => {
                const NewTodos:TodoItem[] = [...prevState];
                const index = NewTodos.findIndex((item:TodoItem) => item.id === id);
                const post = JSON.parse(e.dataTransfer.getData("post"));
                NewTodos[index].post = {title: post.title, url: post.url, type: post.type};
                return NewTodos;
            });
            console.log('post added', e.dataTransfer.getData("post"));
        }

        // if the item is equipment
        if(e.dataTransfer.getData("equipment")) {
            setTodos((prevState:TodoItem[]) => {
                const NewTodos:TodoItem[] = [...prevState];
                const index = NewTodos.findIndex((item:TodoItem) => item.id === id);
                const equipment = JSON.parse(e.dataTransfer.getData("equipment"));
                NewTodos[index].equipment = {camera: equipment.camera ? equipment.camera : NewTodos[index].equipment?.camera, 
                    lens: equipment.lens ? equipment.lens : NewTodos[index].equipment?.lens,
                    other: equipment.other ? equipment.other : NewTodos[index].equipment?.other, 
                };
                return NewTodos;
            });
            console.log('equipment added', e.dataTransfer.getData("equipment"));
        }

        // check if item is todo item
        if(e.currentTarget.id === e.dataTransfer.getData('id')) {
            return;
        }
    }

    return (
        <Box fontFamily={'monospace'} pt={'0.8rem'} pb={'0.4rem'}>
            {/* function bar */}
            <ButtonBar setTodos={setTodos} getDragedTodoItemRef={getDragedTodoItemRef}/>

            {/* TODO list title */}
            <Editable 
                defaultValue={'Simple TODO List'}  
                fontSize={'1.4rem'}
                fontWeight={500}
                p={'0.5rem'}
            >
                <EditablePreview/>
                <EditableInput type={'text'}/>
            </Editable>


            {/* TODO list */}
            <List pl={'0.5rem'} pb={'1rem'} pt={'1rem'} >

                {/* TODO list items */}
                {todos.map(({id, title, completed, file, note, post, equipment}:TodoItem, index:number) => 
                    <ListItem 
                        key={id} 
                        display={'flex'} 
                        alignItems={'center'}
                        p={'0.1rem'}
                        draggable='true'
                        onDragStart={(e)=>e.dataTransfer.setData('todoItem', JSON.stringify(todos[index]))}
                        onDrag={e => {
                            e.currentTarget.style.opacity = '0.1';
                            e.currentTarget.style.backgroundColor = 'transparent';
                            dragedTodoItem.current = true;
                        }} 
                        onDragEnd={e => {e.currentTarget.style.opacity = '1'; dragedTodoItem.current = false;}}
                        onDragOver={(e) => {        
                            e.preventDefault() 
                            e.currentTarget.style.backgroundColor = 'green';
                        }}
                        onDragLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        onDrop={(e) => handleDropToListItem(e, id)}
                    >  

                        {/* checkbox */}
                        <Checkbox 
                            pr={'0.5rem'}
                            colorScheme={'cyan'}
                            isChecked={completed} 
                            onChange={(() => {
                                setTodos((prevState:TodoItem[]) => {
                                    const NewTodos:TodoItem[] = [...prevState];
                                    const index = NewTodos.findIndex((item:TodoItem) => item.id === id);
                                    NewTodos[index].completed = !NewTodos[index].completed;
                                    return NewTodos;
                                });
                            })}
                        />

                        {/* user tab */}
                        { note?.user && <Box mr={'0.4em'} borderRadius={'sm'} fontWeight={'bold'} bg={ colorMode === 'light' ? 'yellow.100' : 'gray.600' } ><BasicUser uid={note.user} /></Box>}

                        {/* text */}
                        <Editable 
                            defaultValue={title}  
                            width={'1000rem'}
                            minH={'2.5em'}
                            display={'flex'}
                            fontSize={'1rem'}
                            alignItems={'center'}
                            onSubmit={()=>{
                                if((todos.length - 1)){  
                                    //addEmptyItem()
                                };
                            }}
                        >
                            <EditablePreview />
                            <EditableInput onChange={(e) => handleEmptyText(e, id)} />
                        </Editable>

                        {/* icon group */}
                        <IconGroup note={note} post={post} file={file} equipment={equipment} />
    
                    </ListItem>
                )}
            </List>
        </Box>
    )
}

interface ButtonBarProps {
    getDragedTodoItemRef: Function,
    setTodos: Function,
};
const ButtonBar = ({setTodos, getDragedTodoItemRef}:ButtonBarProps):JSX.Element => {
    const {colorMode} = useColorMode();
    const calOrLocRef = useRef<boolean>(false); // true: calendar, false: location
    const dateRef = useRef<string>(''); // date of the calendar
    const locationRef = useRef<string>(''); // location of the location window

    // control open and close of calender and location windows
    const [subWindowIsOpen, setSubWindowIsOpen] = useState<boolean>(false); // true: sub window is open, false: sub window is closed
    // add new empty item
    const addEmptyItem = ():void => {
        // new user with unique id generated by date.now()
        setTodos((prevState:TodoItem[]) =>
            [...prevState, {id: Date.now(), title: 'New', completed: false}] 
        );
    }
    // when item is drag over
    const handleDragOverDelete = (e:React.DragEvent<HTMLDivElement>):void => {
        e.preventDefault();        
        e.currentTarget.style.backgroundColor = 'red';
        (e.currentTarget.children[0] as HTMLDivElement).style.color = 'red';
        (e.currentTarget.children[1] as HTMLDivElement).style.color = 'white';
        (e.currentTarget.children[2] as HTMLDivElement).style.color = 'red';
        (e.currentTarget.children[3] as HTMLDivElement).style.color = 'red';
    }
    // when item is drag out
    const handleDragLeaveDelete = (e:React.DragEvent<HTMLDivElement>):void => {
        let color = colorMode === 'light' ? 'black' : 'white';
        e.currentTarget.style.backgroundColor = 'transparent';
        (e.currentTarget.children[0] as HTMLDivElement).style.color = color;
        (e.currentTarget.children[1] as HTMLDivElement).style.color = color;
        (e.currentTarget.children[2] as HTMLDivElement).style.color = color;
        (e.currentTarget.children[3] as HTMLDivElement).style.color = color;
    }
    // When item is dropped to delete box
    const handleDropDelete = (e:React.DragEvent<HTMLDivElement>):void => {
        handleDragLeaveDelete(e);
        e.preventDefault();
        if(e.dataTransfer.getData('todoItem')){
            const id = (JSON.parse(e.dataTransfer.getData('todoItem'))).id;
            setTodos((prevState:TodoItem[]) => 
                prevState.filter((item:TodoItem) => item.id !== Number(id))
            );
        }
    }
    
    return(
        <>
        <Flex
        alignContent={'center'} 
        justifyContent={'space-around'} 
        onDragOver={e => getDragedTodoItemRef && handleDragOverDelete(e)}
        onDragLeave={e => handleDragLeaveDelete(e)}
        onDrop={e => handleDropDelete(e)}
        >
            
            {/* Add new empty item to list */}
            <IconButton aria-label='new' icon={<Plus size={32}/>} variant={'unstyled'} 
                onClick={()=>addEmptyItem()}
            />

            {/* Remove all items in the list */}
            <IconButton aria-label='clear' icon={<Trash size={32}/>} variant={'unstyled'} 
                onClick={()=>setTodos([])}
            />
            
            {/* A draggable calender Icon, which used to set date by drag,  */}
            <IconButton draggable='true' aria-label='calender' icon={<Calendar size={32}/>} variant={'unstyled'} 
                onClick={()=>{setSubWindowIsOpen((previous)=> !previous); calOrLocRef.current = true }} 
                onDragStart={(e)=>{dateRef.current ? e.dataTransfer.setData('date', dateRef.current) : e.dataTransfer.setData('date', new Date().toLocaleDateString());}}
            />

            {/* A draggable location Icon, which used to set date by drag */}
            <IconButton draggable='true' aria-label='location' icon={<MapPin size={32}/>} variant={'unstyled'} 
                onClick={()=>{setSubWindowIsOpen((previous)=> !previous); calOrLocRef.current = false }} 
                onDragStart={(e)=>{(locationRef.current && subWindowIsOpen) && e.dataTransfer.setData('location', locationRef.current)}}
            />
        </Flex>
        {/* Display specific input element according to the ref  */}
        {(subWindowIsOpen && calOrLocRef.current) 
            && <Input type={'date'} 
            onChange={ (e) => dateRef.current = e.currentTarget.value }/>}
        {(subWindowIsOpen && !calOrLocRef.current)
            && <Input type={'text'}
            onChange={ (e) => locationRef.current = e.currentTarget.value}/>}
        </>
    )
}
interface IconItemProps {
    label: string,
    href?: string,
    fileType?: string,
    children?: JSX.Element
}
const IconItem = ( {children, label, href, fileType}:IconItemProps ):JSX.Element => {
    return (
        <Tooltip label={label} aria-label={label}>
            {(fileType === 'image' ) ? <Link> <NextLink href={`/preview/image?src=${href}`}>{children}</NextLink> </Link>
            : (fileType === 'link' ) ? <Link> <NextLink href={href as string}>{children}</NextLink> </Link>
            : href ? <Link href={href} target={'_blank'}>{children}</Link>  
            : children}
        </Tooltip>
    )
}
const IconGroup = ({note, post, file, equipment}:IconGroupProps):JSX.Element => {
    return(
        <Center>  
            { note && note.date && 
            <IconItem label={note.date} > 
                <Calendar size={27}/> 
            </IconItem>}

            { note && note.location && 
            <IconItem label={note.location}>
            <MapPin size={27}/>
            </IconItem>}

            { file && file.type === 'image' && 
            <IconItem label={'preview iamge'} fileType={file.type} href={file.blob}> 
                <Image size={27}/>
            </IconItem>}
            { file && file.type === 'file' && 
            <IconItem label={'download file'} fileType={file.type} href={file.blob}> 
                <File size={27}/>
            </IconItem>}
            
            { post && (
                post.type === 'post' 
                ? 
                <IconItem label={post.title} href={post.url} fileType={'link'}>
                    <GlobeHemisphereWest size={27}/>
                </IconItem>
                : 
                post.type === 'photo' ? 
                <IconItem label={post.title} href={post.url} fileType={'link'}>
                    <Image size={27}/>
                </IconItem>
                : post.type === 'collection' ? 
                <IconItem label={post.title} href={post.url} fileType={'link'}>
                    <BookmarkSimple size={27}/>
                </IconItem>
                : 
                <IconItem label={'unknown'}>
                    <Question size={27}/>
                </IconItem>
            )}

            {equipment && equipment.camera && 
            <IconItem label={equipment.camera}>
                <Camera size={27}/>
            </IconItem>}

            {equipment && equipment.lens && 
            <IconItem label={equipment.lens}>
                <Cylinder size={27}/>
            </IconItem>}
            {equipment && equipment.other && 
            <IconItem label={equipment.other}>
                <Lightning size={27}/>
            </IconItem>}
        </Center>
    )
}

const TodolistComponent = ({uid}:{uid:string}):JSX.Element => {
    const [todoListsNum, SetTodoListsNum] = useState<Array<number>>([Date.now()*10]);
    return (
        <FixedItem
        extensionFunc={()=> SetTodoListsNum((prev) => [...prev, Date.now()*10])}
        callableFunc={()=> SetTodoListsNum((prev) => {const newArr = [...prev]; newArr.pop(); return newArr})}
        >
            <>
                {todoListsNum.map((value) => 
                    <>
                        <TodoList key={value} uid={uid}/>
                        <hr />
                    </>
                )}
            </>
        </FixedItem>
    )
}

interface DialogProp{
    children:JSX.Element,
    extensionFunc?: Function,
    callableFunc?: Function,
}

const FixedItem = ({ children,  extensionFunc, callableFunc}:DialogProp):JSX.Element => {
    const { colorMode } = useColorMode()
    return (
        <Container 
            position={'fixed'} 
            top={['4rem', '5rem']}
            left={['0', '0.55rem']}
            pb={['0', '0.2rem']} 
            maxW={"25rem"} 
            maxH={'container.lg'} 
            textAlign={'center'}
            border='2px black solid' 
            borderRadius={'0.2rem'} 
            variant={colorMode === 'light' ? 'with-shadow' : 'with-shadow-dark'}
        >
            {children}
            { extensionFunc &&
                <IconButton 
                    aria-label="plus" 
                    size={'sm'}
                    icon={<Plus size={20}/>}
                    colorScheme={'blackAlpha'}
                    borderStyle={'none'}
                    variant='outline'
                    onClick={()=>extensionFunc()}
                />
            }
            { callableFunc && 
                <IconButton 
                    aria-label="plus" 
                    size={'sm'}
                    icon={<Minus size={20}/>}
                    colorScheme={'blackAlpha'}
                    borderStyle={'none'}
                    variant='outline'
                    onClick={()=>callableFunc()}
                />
            }
        </Container>
    )
}

export default TodolistComponent;
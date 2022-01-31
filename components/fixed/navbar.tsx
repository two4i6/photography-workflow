import NextLink from 'next/link'
import {
    Box,
    Link,
    Text,
    Flex,
    Center,
    Avatar,
    AvatarBadge,
    Button,
    useColorMode,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuGroup,
    MenuDivider,
} from '@chakra-ui/react'
import { Moon, Sun,  Heart, Book, MagnifyingGlass, ListChecks, Upload } from 'phosphor-react' 
import { useState } from 'react';
import { motion } from 'framer-motion';
import { BasicUser } from '../info/userinfo'

import { useSession, signIn, signOut } from "next-auth/react"
import TodoListComponent from './todolist'
import SearchFormComponent from './searchform'

interface NavBarProps {
  path: string, 
}
  
const Navbar = ({path}: NavBarProps):JSX.Element => {
  const { colorMode, toggleColorMode } = useColorMode()
  const { data: session, status } = useSession();

  const user = session ? session.user : null;
  const uid = user ? user.name as string : 'Guest';  
  const userImage = user ? user.image as string : '';


  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTodoListOpen, setIsTodoListOpen] = useState(false);
  const IconSize = 30;

  const handleSearchOpen = ():void => {
    setIsSearchOpen((prevState) => !prevState);
  }

  const handleTodoListOpen = ():void => {
    setIsTodoListOpen((prevState) => !prevState);
  }

  return (
    <Box
      bg={ colorMode === 'light' ? 'white' : 'gray.800' }
      position={'fixed'} 
      top={0} 
      left={0} 
      right={0}
      display={'flex'} 
      alignItems={"center"} 
      maxH={'4rem'}
      justifyContent={'space-between'} 
      borderBottom={'2px solid black'}
      >
        <Flex>
          <LinkItem label={'TodoList'} path={path}>
              <ListChecks size={IconSize} onClick={handleTodoListOpen}/>
          </LinkItem>
          <UserComponent uid={uid} userImage={userImage} status={status} />
        </Flex>
        <Flex>
          <Center display={['contents', 'none']}>
            <LinkItem label={'Upload'} path={path}>
              <Upload size={IconSize} />
            </LinkItem>
          </Center>
          <LinkItem href={'/'} label={'Stroy'} path={path}>
            <Book size={IconSize} />
          </LinkItem>
          <LinkItem href={'/'} label={'Like'} path={path}>
            <Heart size={IconSize} />
          </LinkItem>
          <LinkItem label={'Drakmode switch'}>
            {colorMode === 'light' 
            ? <Moon size={IconSize} onClick={toggleColorMode} />
            : <Sun size={IconSize} onClick={toggleColorMode} />}
          </LinkItem>
          <LinkItem label={'Search'}>
            <MagnifyingGlass size={IconSize} onClick={handleSearchOpen}/>
          </LinkItem>
        </Flex>
        { isTodoListOpen && <TodoListComponent uid={uid} /> }
        { isSearchOpen && <SearchFormComponent/> }
    </Box>
  );
}

interface LinkItemProps {
  href?: string,
  label?: string,
  path?: string,
  children: JSX.Element
  display?: string,
}

const LinkItem = ({href, label, path, children, display='block'}:LinkItemProps):JSX.Element => {
  const active = path === href; //check if the current path is the same as the href
  if(href){
    return ( 
      <NextLink href={href}>       
        <Link p={[0, 4]} pt={[3 , '']} pb={[3, '']} pl={[3, '']} display={display}>
          {children}
        </Link>
      </NextLink>
    )
  }else{     
    return (
      <Link p={[0, 4]} pt={[3 , '']} pb={[3, '']} pl={[3, '']} display={display}>
        {children}
      </Link>
    )
  }
}

const UserComponent = ({uid, userImage, status}:{uid:string, userImage:string, status:string}):JSX.Element => {

  if(status === 'loading'){
    return(
      <Center>
        <Box pl={'2em'}>
          <Text>Loading...</Text>
        </Box> 
      </Center>
    )
  } 
  else if(status === 'authenticated'){
    return(
      <Center ml={['0.8em','1.5em']}>
        <Menu>
          <MenuButton> 
            <Avatar size={'sm'} bg={'green'} name={uid} src={userImage}>
              <AvatarBadge boxSize='1.25em' bg='green.500' onSelect={(e)=>e.preventDefault()}/> 
            </Avatar>
          </MenuButton>
            <MenuList>  
            <MenuGroup title="Profile">
              <MenuItem>
                <p>My Account</p>
              </MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuItem onClick={() => signOut()}>
              Sing out
            </MenuItem>
          </MenuList>  
        </Menu>
        <Box ml={'0.6em'} display={['none','block']} > 
          <BasicUser uid={uid} fontSize='1.25rem'/>
        </Box> 
      </Center>
    )
  } 
  else{
    return(
      <Center>
        <Box pl={['0.5em','2em']}>
          <Button onClick={() => signIn()} variant={'outline'} > Sing In</Button>
        </Box> 
      </Center>
    )
  }
}

export default Navbar
import { Text } from "@chakra-ui/react"

interface DateProp {
    date: string,
    size?: string,
    color?: string,
    weight?: string,
    children?: JSX.Element,
}

const onDragStart = (e:any, date:string) => {
    e.dataTransfer.setData("date", date);
}

export const BasicDate = ({date='recently', size='10', weight='light', color='gray', children}:DateProp):JSX.Element => {

    return(
        <Text 
            fontSize={size} 
            fontWeight={weight} 
            color={color}
            fontFamily={'monospace'}
            draggable={true}
            onDragStart={(e)=> onDragStart(e, date)}
        >
            {date}
        </Text>
    )
}
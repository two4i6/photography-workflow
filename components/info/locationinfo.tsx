import { Text, Tooltip} from "@chakra-ui/react"

interface LocationProp {
    location: string,
    location_lat?: number;
    location_lng?: number;
    weight?: string,
    children?: JSX.Element,
}

const onDragStart = (e:any, location:string) => {
    e.dataTransfer.setData("location", location);
}

export const BasicLocation = ({location, weight='normal', children, location_lat, location_lng}:LocationProp):JSX.Element => {
    if(location_lat && location_lng){
        return(
            <Tooltip label={`${location_lat}, ${location_lng}`} aria-label={`${location_lat}, ${location_lng}`} >
                <Text
                    fontSize={['0.85em', '1em']}
                    fontWeight={weight}
                    draggable={true} 
                    onDragStart={(e)=> onDragStart(e, location)}
                    >
                    {location}
                </Text>
            </Tooltip>
        )
    }
    
    return(
        <>
            <Text
                fontSize={['0.85em', '1em']}
                fontWeight={weight}
                draggable={true} 
                onDragStart={(e)=> onDragStart(e, location)}
                >
                {location}
            </Text>
            {children}
        </>
    )
}
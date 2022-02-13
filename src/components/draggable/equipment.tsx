import { Text } from "@chakra-ui/react"

interface EquipmentProp {
    equipment:string,
    type:string,
    children?:JSX.Element,
}

interface Equipment {
    camera:string | undefined,
    lens:string | undefined,
    other:string | undefined,
}

const onDragStart = (e:any, equipment:string, type:string) => {
    let eqt:Equipment = {
        camera: undefined,
        lens: undefined,
        other: undefined, 
    };

    switch (type) {
        case 'camera': eqt.camera = equipment; break; 
        case 'lens': eqt.lens = equipment; break;
        default: 'other'; eqt.other = equipment; 
    }

    e.dataTransfer.setData("equipment", JSON.stringify(eqt));
}

export const BasicEquipment = ({equipment, type, children}:EquipmentProp):JSX.Element => {

    return(
        <Text 
            fontFamily={'monospace'}
            draggable={true}
            onDragStart={(e)=> onDragStart(e, equipment, type)}
        >
            {equipment}
        </Text>
    )
}
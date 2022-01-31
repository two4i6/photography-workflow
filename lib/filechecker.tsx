
export const FileTypeChecker = (file:File):string => {
    if(file.type === 'image/png' 
    || file.type === 'image/jpeg' 
    || file.type === 'image/jpg' 
    || file.type === 'image/gif' 
    || file.type === 'image/tiff'
    ){ 
        return 'image';;
    }else{
        return 'file';
    }
}

export const IsImage = (file:File):boolean => {
    if(file.type === 'image/png' 
    || file.type === 'image/jpeg' 
    || file.type === 'image/jpg' 
    || file.type === 'image/gif' 
    || file.type === 'image/tiff'
    ){ 
        return true;
    }
    return false;
}
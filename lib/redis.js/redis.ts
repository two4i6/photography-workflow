import { Client, Entity, Schema, Repository } from "redis-om";

export interface hit {
    user: string;
    event_id: string;
    description: string;

    img_url: string;
    img_key: string;

    img_width: number;
    img_height: number;
    DateTime: string;
    CameraMake: string;
    CameraModel: string;
    Lens: string;
    ISOSpeedRatings: number;
    ExposureTimeDenominator: number;
    ExposureTimeNumerator: number;
    FNumber: number;
    location: string;
    location_lat: number;
    location_lng: number;
}

const client = new Client();

const conect = async () => {
    if(!client.isOpen()){
        await client.open(process.env.REDIS_URL);
        console.log("Redis connected");
    }
}

// like database table in mysql
class Image extends Entity {}

// data model
const schema = new Schema(
    Image, 
    {
        img_url: {type: 'string'},
        img_key: {type: 'string'},
        img_width: {type: 'number'},
        img_height: {type: 'number'},
        description: {type: 'string', textSearch: true},
        
        DateTime: {type: 'string'},
        CameraMake: {type: 'string'}, // camera make
        CameraModel: {type: 'string'}, // camera model
        Lens: {type: 'string'}, // lens model
        ISOSpeedRatings: {type: 'number'}, // ISO
        ExposureTimeDenominator: {type: 'number'}, // 快门速度
        ExposureTimeNumerator: {type: 'number'}, 
        FNumber: {type: 'number'}, // F值

        event_id: {type: 'string'}, // event name
        user: {type: 'string'}, // belong to user
        location: {type: 'string'}, // location
        location_lat: {type: 'number'}, // location latitude
        location_lng: {type: 'number'}, // location longitude
    },
    {
        dataStructure: 'JSON',
    }
);

// handle write data to redis
export async function saveImg(data: any) {
    await conect(); //connect to redis

    const repository = new Repository(schema, client);
    const image = repository.createEntity(data); //create entity
    const id = await repository.save(image); //commit to redis

    return id;
}

export async function createIndex() {
    await conect(); //connect to redis

    const repository = new Repository(schema, client);
    await repository.createIndex();
    client.close();

}

export async function searchImg(query: any) {
    await conect(); //connect to redis
    
    const repository = new Repository(schema, client);
    const result = await repository.search()
        .where('user').eq(query)
        .or('img_key').eq(query)
        .or('event_id').eq(query)
        .or('description').matches(query)
        .return.all();

    //client.close();
    console.log('get result for:', query);
    return result;
}


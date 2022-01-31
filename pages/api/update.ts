import { saveImg } from "../../lib/redis.js/redis";
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler ( req: NextApiRequest, res: NextApiResponse) {
    if(req.body.img_key){
        const id = await saveImg(req.body);
        res.status(200).json({ id });
    }else{
        res.status(400).json({error: "bad request"});
    }
}


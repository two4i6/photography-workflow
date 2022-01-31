import type { NextApiRequest, NextApiResponse } from 'next'
import { searchImg } from "../../lib/redis.js/redis";

export default async function handler ( req: NextApiRequest, res: NextApiResponse) {
    if(req.query.q){
        const imgInfo = await searchImg(req.query.q);
        res.status(200).json({ imgInfo });
    }else{
        res.status(400).json({error: "bad request"});
    }
}
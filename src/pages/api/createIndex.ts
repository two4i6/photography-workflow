import type { NextApiRequest, NextApiResponse } from 'next'
import { createIndex } from "../../../lib/redis.js/redis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try{
        await createIndex();
        res.status(200).json({ message: 'create index success' });
    }catch(error){
        res.status(500).json({error: error});
    }
}


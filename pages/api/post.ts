import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import prisma from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
    const session = await getServerSession(req as any, res as any, authOptions as any);
    if (!session) {
        res.status(401).json({msg: 'You must be logged in.'});
        return;
    }
    try{
        if(req.method == "POST"){
            const post = await prisma.post.create({
                data: req.body
            })
            res.status(200).json({msg: "done", post})
            return
        }
        if(req.method == "GET"){
            const post = await prisma.post.findMany({
                orderBy:{
                    createdAt: "desc"
                }
            })
            let userData = []
            for(let i = 0; i< posts.length; i++){
                const user = await prisma.user.findUnique({
                    where:{
                        email: posts[i].userEmail
                    }
                })
                userData.push(user)
            }
            res.status(200).json({posts, userData})
            return
        }
        res.status(200).json({ msg: "incorrect request"})
    } catch (error){
        console.log(error)
        res.status(201).json({msg:"error"})
    }
}
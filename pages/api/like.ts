import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/lib/prisma"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req as any, res as any, authOptions as any)
    if (!session) {
         res.status(401).json({ msg: "You must be logged in." })
    }
    if (req.method == "POST") {
        const post = await prisma.post.update({
            where: {
                id: req.body.id
            },
            data: {
                likedUserEmails: req.body.likedUserEmails
            }
        })
        res.status(200).json({ msg: "done", post })
        return;
    }
    res.status(201).json({ msg: "incorrect request" })
}
import { ArrowPathRoundedSquareIcon, BookmarkIcon, ChatBubbleLeftEllipsisIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid, BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import { Post, User } from "@prisma/client";
import Image from "next/image";
import {useEffect, useState} from "react";
import {ActiveButton} from "@/components/ActiveButton";

export default function TweetBox({ onClick, userData, post, userEmail}: {
    onClick: () => void,
    userData: User,
    post: Post,
    userEmail: string
}) {
    const [likedEmails, setLikedEmails] = useState<Array<string>>(post.likedUserEmails)
    const [bookmarkedEmails, setBookmarkedEmails] = useState<Array<string>>(post.bookmarkedUserEmails)
    const [isLiked, setIsLiked]= useState(false)
    const [isBookmarked, setIsBookmarked]= useState(false)
    const [replyUserData, setReplyUserData] = useState<Array<User>>([])




    useEffect(()=>{
        if(bookmarkedEmails.includes(userEmail)){
            setIsBookmarked(true)
        } else{
            setIsBookmarked(false)
        }
    }, [bookmarkedEmails])

    async function getReplies() {
        const params = new URLSearchParams({
            tid: post.id as string
        })
        const response = await fetch("/api/comment?" + params)
        if (response.status == 200) {
            const data = await response.json()
            setReplyUserData(data.userData)
        }
    }


    async function bookmark() {
        let newBookmarkedUserEmails: string[] = []
        if(isBookmarked)  {
            post.bookmarkedUserEmails.filter(email => email != userEmail)
            setBookmarkedEmails(newBookmarkedUserEmails)
        } else{
            if (post.bookmarkedUserEmails.includes(userEmail)){
                newBookmarkedUserEmails = post.bookmarkedUserEmails.filter(email => email != userEmail)
                newBookmarkedUserEmails.push(userEmail)
            } else {
                newBookmarkedUserEmails = [...post.bookmarkedUserEmails, userEmail]

            }
            setBookmarkedEmails(newBookmarkedUserEmails)

        }
        const response = await fetch("/api/bookmark", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: post.id,
                bookmarkedUserEmails: newBookmarkedUserEmails
            })
        })

        if (response.status == 200) {
            const data = await response.json()
            setBookmarkedEmails(data.post.bookmarkedUserEmails)
        }
    }


    useEffect(() => {
        async function f() {
            await getReplies()
        }
        f()
    }, [post.id])



    return <div onClick={onClick} className="p-4 border-b border-neutral-600 flex">
        <div className="w-16 shrink-0 grow-0 mr-2 flex flex-col items-center">
            <Image
                className="rounded-full h-12 w-12"
                src={userData?.profileImage as string}
                height={1000}
                width={1000}
                alt="profile pic"
            />
        </div>
        <div className="flex-grow">
            <p className="font-bold">{userData?.name} <span className="font-normal text-neutral-400 ml-2">@{userData?.username}</span></p>
            <div className="mb-2" dangerouslySetInnerHTML={{ __html: post?.body }}></div>
            {post?.image != "" ? <Image
                className="w-full rounded-xl"
                src={post?.image as string}
                width={1000}
                height={1000}
                alt="tweet image"
            /> : null}
            <div className="flex gap-12 pt-4">
                {post.parentId === null && <button className="flex items-center gap-2 hover:text-blue-500"><ChatBubbleLeftEllipsisIcon
                    className="h-5 w-5"/>{replyUserData.length}</button>}
                <ActiveButton active={isLiked} setActive={setIsLiked} id={post.id} value={post.likedUserEmails} userEmail={userEmail} arr={likedEmails} setArr={setLikedEmails} Icon={HeartIconSolid} DisIcon={HeartIcon} />
                <button onClick={(e) => { e.stopPropagation();bookmark() }} className="flex items-center gap-2 hover:text-blue-500">{isBookmarked ? <BookmarkIconSolid className="h-5 w-5" /> : <BookmarkIcon className="h-5 w-5" />}{bookmarkedEmails.length}</button>
            </div>
        </div>
    </div>
}
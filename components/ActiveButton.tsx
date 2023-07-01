
import React, {useEffect} from "react";
import {Icon} from "next/dist/lib/metadata/types/metadata-types";

interface ActiveButtonProps{
    id: string
    value: string[];
    active: boolean
    setActive: (prev: boolean) => void;
    userEmail: string;
    arr: string[];
    setArr: (prev: string[])=> void;
    Icon: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {title?: string, titleId?: string} & React.RefAttributes<SVGSVGElement>>;
    DisIcon: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {title?: string, titleId?: string} & React.RefAttributes<SVGSVGElement>>;
    styles: string;
    route: string;
    objectValue: string;
}

export function ActiveButton({value, id, active, setActive, userEmail, arr, setArr, Icon, DisIcon, objectValue, route }: ActiveButtonProps){

    useEffect(()=>{
        if(arr.includes(userEmail)){
            setActive(true)
        } else{
            setActive(false)
        }
    }, [arr])


    async function like() {
        let newLikedUserEmails : string[] = []
        if (value.includes(userEmail)) {
            newLikedUserEmails = value.filter(email => email != userEmail)

        } else{
            newLikedUserEmails = [...value, userEmail]
        }
        setArr(newLikedUserEmails)


        const response = await fetch(`/api/like`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                likedUserEmails: newLikedUserEmails
            })
        })

        if (response.status == 200 ) {
            const data = await response.json()
            setArr(data.post.likedUserEmails)
        }
    }

    async function dislike(){
        let newLikedUserEmails = []
        value.filter(email => email != userEmail)
        setArr(newLikedUserEmails)
        const response = await fetch("/api/like", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                likedUserEmails: newLikedUserEmails
            })
        })

        if (response.status == 200 ) {
            const data = await response.json()
            setArr(data.post.likedUserEmails)
        }
    }

    return(
        <button onClick={(e) => { e.stopPropagation(); active? dislike(): like() }} className="flex items-center gap-2 hover:text-blue-500">{active ? <Icon className="h-5 w-5" /> : <DisIcon className="h-5 w-5" />}{arr.length}</button>
    )
}
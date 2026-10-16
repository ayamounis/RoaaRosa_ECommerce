'use server'

import { getMyUserToken } from "@/utils/utils";

export async function getAllAddress() {
    try {
        const token =await getMyUserToken()
        const res =await fetch('https://ecommerce.routemisr.com/api/v1/addresses',{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                token:token as string
            },
            cache:'no-store'
        })
            const finalRes =await res.json()
            return finalRes
    } catch (error) {
        console.log(error);
    }
}
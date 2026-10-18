'use server'

import { getMyUserToken } from "@/utils/utils";
import { API_BASE_URL } from "@/utils/apiConfig";

export async function getAllAddress() {
    try {
        const token =await getMyUserToken()
        const res =await fetch(`${API_BASE_URL}/addresses`,{
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
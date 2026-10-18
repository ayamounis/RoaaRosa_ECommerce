'use server'

import { getMyUserToken } from "@/utils/utils"
import { addAddress } from "./addAddress.types"
import { API_BASE_URL } from "@/utils/apiConfig"
export async function AddAddress(data:addAddress) {
    try {
        const token =await getMyUserToken()
        const res =await fetch(`${API_BASE_URL}/addresses`,{
            method:'POST',
            body:JSON.stringify(data),
            headers:{
                'Content-Type':'application/json',
                token:token as string
            }
        })
            const finalRes =await res.json()
            return finalRes
    } catch (error) {
        console.log(error);
    }
}
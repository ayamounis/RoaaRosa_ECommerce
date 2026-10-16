'use server'

import { getMyUserToken } from "@/utils/utils"
import { addAddress } from "./addAddress.types"
export async function AddAddress(data:addAddress) {
    try {
        const token =await getMyUserToken()
        const res =await fetch('https://ecommerce.routemisr.com/api/v1/addresses',{
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
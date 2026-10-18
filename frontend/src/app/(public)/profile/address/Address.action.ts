'use server'

import { getMyUserToken } from "@/utils/utils"
import { revalidatePath } from "next/cache"
import { API_BASE_URL } from "@/utils/apiConfig"
export async function deleteAddress(id:string) {
    try {
        const token =await getMyUserToken()
        const res =await fetch(`${API_BASE_URL}/addresses/${id}`,{
            method:'DELETE',
            headers:{
                'Content-Type':'application/json',
                token:token as string
            }
        })
            const finalRes =await res.json()
            revalidatePath('/profile/address')
            return finalRes
    } catch (error) {
        console.log(error);
    }
}
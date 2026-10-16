'use server'

import { getMyUserToken } from "@/utils/utils"
import { revalidatePath } from "next/cache"
export async function deleteAddress(id:string) {
    try {
        const token =await getMyUserToken()
        const res =await fetch(`https://ecommerce.routemisr.com/api/v1/addresses/${id}`,{
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
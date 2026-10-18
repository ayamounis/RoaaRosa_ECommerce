'use server'

import { getMyUserToken } from "@/utils/utils"
import { profileSchema } from "./profile.types"
import { API_BASE_URL } from "@/utils/apiConfig"
export async function UpdateProfileInfo(data:profileSchema) {
    try {
        const token =await getMyUserToken()
        const res =await fetch(`${API_BASE_URL}/users/updateMe`,{
            method:'PUT',
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
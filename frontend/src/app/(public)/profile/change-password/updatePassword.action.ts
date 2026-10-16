'use server'

import { getMyUserToken } from "@/utils/utils"
import { UpdatePasswordType } from "./updatePassword.types"
export async function UpdatePassword(data:UpdatePasswordType) {
    try {
        const token =await getMyUserToken()
        const res =await fetch('https://ecommerce.routemisr.com/api/v1/users/changeMyPassword',{
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
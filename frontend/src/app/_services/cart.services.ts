'use server'
import { getMyUserToken } from "@/utils/utils";

export async function getUserCart() {
    const token = await getMyUserToken()
    if (token) {
        try {
            const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart`, {
                headers: {
                    token: token as string
                }
            })
            const final = await res.json()
            return final
        } catch (error) {
            console.log(error);
        }
    }
}
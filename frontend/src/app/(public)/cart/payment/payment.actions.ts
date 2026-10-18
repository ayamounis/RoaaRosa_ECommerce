'use server'

import { getMyUserToken } from "@/utils/utils"
import { revalidatePath } from "next/cache"
import { API_BASE_URL } from "@/utils/apiConfig"

type CreateCashOrderBody = {
    details: string,
    phone: string,
    city: string
}
export async function CreateCashOrder(id: string, body: CreateCashOrderBody) {
    try {
        const token = await getMyUserToken()
        const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                token: token as string
            }
        })
        const final = await res.json()
        revalidatePath('/cart')
        return final
    } catch (error) {
        console.log(error);
    }
}
export async function CreateOnlineOrder(id: string, body: CreateCashOrderBody) {
    try {
        const token = await getMyUserToken()
        const res = await fetch(`${API_BASE_URL}/orders/checkout-session/${id}?url=http://localhost:3000`, {
            method: 'POST',
            body: JSON.stringify(body),
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
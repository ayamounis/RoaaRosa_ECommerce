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
                'Content-Type': 'application/json',
                token: token as string
            }
        })
        const final = await res.json()
        revalidatePath('/cart')
        revalidatePath('/allorders')
        return final
    } catch (error) {
        console.error('CreateCashOrder error:', error);
        return { status: 'error', message: 'Failed to create cash order' };
    }
}

export async function CreateOnlineOrder(id: string, body: CreateCashOrderBody) {
    try {
        const token = await getMyUserToken()
        const res = await fetch(`${API_BASE_URL}/orders/checkout-session/${id}?url=http://localhost:3000`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                token: token as string
            }
        })
        const final = await res.json()
        return final
    } catch (error) {
        console.error('CreateOnlineOrder error:', error);
        return { status: 'error', message: 'Failed to create online checkout session' };
    }
}

export async function verifyOnlinePayment(sessionId: string) {
    try {
        const res = await fetch(`${API_BASE_URL}/orders/verify-payment/${sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const final = await res.json()
        revalidatePath('/cart')
        revalidatePath('/allorders')
        return final
    } catch (error) {
        console.error('verifyOnlinePayment error:', error);
        return { status: 'error', message: 'Failed to verify online payment' };
    }
}
'use server'

import { getMyUserToken } from "@/utils/utils";
import { revalidatePath } from "next/cache";

export async function addProductToCart(productId: string) {
    const token = await getMyUserToken()
    if (token) {
        try {
            const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: token as string
                },
                body: JSON.stringify({
                    productId
                })
            })
            const finalResult = await res.json()
            revalidatePath('/cart')
            console.log('test',finalResult);
            return finalResult
        } catch (error) {
            console.log(error);
        }
    }
}
export async function removeProductFromCart(id: string) {
    try {
        const token = await getMyUserToken()
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${id}`,
            {
                method: 'DELETE',
                headers: {
                    token: token as string
                }
            }
        )
        const final = await res.json()
        revalidatePath('/cart')
        return final.numOfCartItems
    } catch (error) {
        console.log(error);
        return null
    }
}

export async function clearCart() {
    try {
        const token = await getMyUserToken()
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart`, {
            method: 'DELETE',
            headers: {
                token: token as string
            }
        })
        const finalResult = await res.json()
        revalidatePath('/cart')
        return finalResult
    } catch (error) {
        console.log(error);
        return null
    }
}

export async function updateProductQuantity(id: string, count: number) {
    try {
        const token = await getMyUserToken()
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${id}`,
            {
                method: 'PUT',
                headers: {
                    token: token as string,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    count
                })
            }
        )
        const final = await res.json()

        revalidatePath('/cart')
        return final.numOfCartItems
    } catch (error) {
        console.log(error);
        return null
    }
}
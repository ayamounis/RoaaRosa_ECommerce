'use server'
import { getMyUserToken } from "@/utils/utils";
import { revalidatePath } from "next/cache";

export async function removeProductWishlist(productId: string) {
    try {
        const token = await getMyUserToken()
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
            method: 'DELETE',
            headers: {
                token: token as string
            }
        });
        const data = await res.json();
        revalidatePath('/wishlist')
        return data;
    } catch (error) {
        console.log(error);
    }
}
export async function addProductToWishlist(productId: string) {
    try {
        const token = await getMyUserToken()
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
            method: 'POST',
            headers: {
                token: token as string,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId
            })
        });
        const data = await res.json();
        revalidatePath('/wishlist')  
        return data;
    } catch (error) {
        console.log(error);
    }
}

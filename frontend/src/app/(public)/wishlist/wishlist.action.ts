'use server'
import { getMyUserToken } from "@/utils/utils";
import { revalidatePath } from "next/cache";
import { API_BASE_URL } from "@/utils/apiConfig";

export async function removeProductWishlist(productId: string) {
    try {
        const token = await getMyUserToken()
        const res = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
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
        const res = await fetch(`${API_BASE_URL}/wishlist`, {
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

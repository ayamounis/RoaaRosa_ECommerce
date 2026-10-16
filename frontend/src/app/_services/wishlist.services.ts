'use server'
import { getMyUserToken } from "@/utils/utils";
import { IWishlistItem } from "../_interfaces/wishlist";

export async function getAllWishlistItems(): Promise<IWishlistItem> {
    try {
        const token = await getMyUserToken()
        const res = await fetch('https://ecommerce.routemisr.com/api/v1/wishlist', {
            headers: {
                token: token as string
            }
        });
        const data = await res.json();        
        return data;
    } catch (error) {
        console.log(error);
        throw error
    }
}
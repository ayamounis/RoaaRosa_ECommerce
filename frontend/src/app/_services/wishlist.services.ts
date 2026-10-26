'use server'
import { getMyUserToken } from "@/utils/utils";
import { IWishlistItem } from "../_interfaces/wishlist";
import { API_BASE_URL } from "@/utils/apiConfig";

export async function getAllWishlistItems(): Promise<IWishlistItem> {
    try {
        const token = await getMyUserToken()
        const res = await fetch(`${API_BASE_URL}/wishlist`, {
            headers: {
                token: token as string
            }
        });
        const data = await res.json();        
        return data;
    } catch (error) {
        console.warn('Wishlist fetch error:', error);
        return { status: 'fail', count: 0, data: [] };
    }
}
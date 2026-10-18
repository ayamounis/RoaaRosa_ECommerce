'use server'
import { getMyUserToken } from "@/utils/utils";
import { API_BASE_URL } from "@/utils/apiConfig";

export async function getUserCart() {
    const token = await getMyUserToken()
    if (token) {
        try {
            const res = await fetch(`${API_BASE_URL}/cart`, {
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
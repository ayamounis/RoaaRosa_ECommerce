import { getMyUserToken } from "@/utils/utils"
import { API_BASE_URL } from "@/utils/apiConfig"

export async function getAllUserOrders(id: string) {
    try {
        const token = await getMyUserToken()
        const res = await fetch(`${API_BASE_URL}/orders/user/${id}`,
            {
                cache: 'no-store',
                headers: {
                    token: token as string
                }
            }
        )
        const final = await res.json()
        return final
    } catch (error) {
        console.log(error);
    }
}
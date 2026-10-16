import { getMyUserToken } from "@/utils/utils"

export async function getAllUserOrders(id: string) {
    try {
        const token = await getMyUserToken()
        const res = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/user/${id}`,
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
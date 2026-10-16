import { useDispatch } from "react-redux"
import { removeProductFromCart } from "../(public)/cart/cart.actions"
import { AppDispatch } from "@/redux/store"
import { toast } from "sonner"
import { updateCartCountAsync } from "@/redux/slices/CartSlice"

export default function useRemoveFromCart({ id }: { id: string }) {
    const dispatch = useDispatch<AppDispatch>()
    const handleRemoveFromCart = async () => {
        const res = await removeProductFromCart(id)
        if (res === null) {
            toast.error('Failed to remove product from cart')
        }
        else {
            toast.success('Product removed from cart successfully')
            dispatch(updateCartCountAsync())
        }

    }
    return (
        { handleRemoveFromCart }
    )
}

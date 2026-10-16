import { updateCartCountAsync } from "@/redux/slices/CartSlice"
import { AppDispatch } from "@/redux/store"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import { addProductToCart } from "../(public)/cart/cart.actions"

export default function useAddtoCart({ id }: { id: string }) {
    const dispatch = useDispatch<AppDispatch>()

    const handleAddToCart = async () => {
        const res = await addProductToCart(id)
        if (res) {
            toast.success('Item added to cart')
            dispatch(updateCartCountAsync())
        } else {
            toast.error(res?.message || 'Failed to add item to cart')
        }
    }
    return (
        { handleAddToCart }
    )
}

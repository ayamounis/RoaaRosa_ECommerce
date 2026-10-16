import { updateCartCountAsync } from "@/redux/slices/CartSlice"
import { AppDispatch } from "@/redux/store"
import { FormEvent, useState } from "react"
import { useDispatch } from "react-redux"
import useAddtoCart from "./useAddtoCart"
import useRemoveFromCart from "./useRemoveFromCart"

export default function useToggleCart({ id, isActive }: { id: string, isActive?: boolean }) {
    const dispatch = useDispatch<AppDispatch>()
    const [active, setActive] = useState(isActive)
    const [loading, setLoading] = useState(false)
    const { handleRemoveFromCart } = useRemoveFromCart({ id })
    const {handleAddToCart}=useAddtoCart({id})

    const handleToggleCart = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        if (active) {
            await handleRemoveFromCart()
            dispatch(updateCartCountAsync())
        } else {
            await handleAddToCart()
            dispatch(updateCartCountAsync())
        }
        setLoading(false)
        setActive(!active)
    }
    return (
        { loading, active, handleToggleCart }
    )
}

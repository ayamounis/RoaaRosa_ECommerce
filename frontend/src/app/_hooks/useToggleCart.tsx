import { updateCartCountAsync } from "@/redux/slices/CartSlice"
import { AppDispatch } from "@/redux/store"
import { FormEvent, useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import useAddtoCart from "./useAddtoCart"
import useRemoveFromCart from "./useRemoveFromCart"

export default function useToggleCart({
    id,
    isActive,
    redirectToCart = true
}: {
    id: string
    isActive?: boolean
    redirectToCart?: boolean
}) {
    const dispatch = useDispatch<AppDispatch>()
    const [active, setActive] = useState(isActive)
    const [loading, setLoading] = useState(false)
    const { handleRemoveFromCart } = useRemoveFromCart({ id })
    const { handleAddToCart } = useAddtoCart({ id, redirectToCart })

    useEffect(() => {
        setActive(isActive)
    }, [isActive])

    const handleToggleCart = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        if (active) {
            await handleRemoveFromCart()
            dispatch(updateCartCountAsync())
            setActive(false)
        } else {
            const added = await handleAddToCart()
            if (added) {
                dispatch(updateCartCountAsync())
                setActive(true)
            }
        }
        setLoading(false)
    }
    return { loading, active, handleToggleCart }
}

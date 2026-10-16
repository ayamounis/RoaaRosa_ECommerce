'use client'
import { updateWishlistCountAsync } from "@/redux/slices/WishlistSlice"
import { AppDispatch } from "@/redux/store"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import { addProductToWishlist } from "../(public)/wishlist/wishlist.action"

export default function useAddWishlist({ productId }: { productId: string }) {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch<AppDispatch>()
    const handleAddToWishlist = async () => {
        setLoading(true)
        const res = await addProductToWishlist(productId)
        if (res.status == 'success') {
            toast.success(res.message)
            dispatch(updateWishlistCountAsync())
        } else {
            toast.error(res?.message || 'Failed to add item to wishlist')
        }
        setLoading(false)
    }
    return (
        { loading, handleAddToWishlist }
    )
}

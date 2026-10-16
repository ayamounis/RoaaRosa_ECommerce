import { updateWishlistCountAsync } from "@/redux/slices/WishlistSlice"
import { AppDispatch } from "@/redux/store"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import { removeProductWishlist } from "../(public)/wishlist/wishlist.action"

export default function useRemoveWishlist({ productId }: { productId: string }) {
    const dispatch = useDispatch<AppDispatch>()
    const [loading, setLoading] = useState(false)
    const handleRemoveFromWisList = async () => {
        setLoading(true)
        const res = await removeProductWishlist(productId)
        if (res.status == 'success') {
            toast.success('Product removed from wishlist')
            setLoading(false)
            dispatch(updateWishlistCountAsync())
        }
    }
    return {
        loading,
        handleRemoveFromWisList
    }
}

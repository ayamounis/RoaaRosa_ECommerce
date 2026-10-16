'use client'

import { FormEvent, useState } from "react"
import useAddWishlist from "./useAddWishlist"
import useRemoveWishlist from "./useRemoveWishlist"

export default function useToggleWishlist({ productId, isWishlisted }: { productId: string, isWishlisted: boolean }) {
    const [isActive, setIsActive] = useState(isWishlisted)
    const [loading, setLoading] = useState(false)
    const { handleRemoveFromWisList } = useRemoveWishlist({ productId })
    const { handleAddToWishlist } = useAddWishlist({ productId })

    const handleToggle = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        if (isActive) {
            await handleRemoveFromWisList()
            setIsActive(false)
        } else {
            await handleAddToWishlist()
            setIsActive(true)
        }
        setLoading(false)
    }
    return (
        { handleToggle, loading, isActive }
    )
}

'use client'

import { updateCartCountAsync } from "@/redux/slices/CartSlice"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import { clearCart } from "../cart/cart.actions"
import { AppDispatch } from "@/redux/store"

export default function AllOrdersClientWrapper() {
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        async function handleClearCart() {
            await clearCart()
        }
        const fromCheckout = sessionStorage.getItem('fromCheckout')
        
        if (fromCheckout === 'true') {
            dispatch(updateCartCountAsync())
            handleClearCart()
            toast.success('Payment successful!')
            sessionStorage.removeItem('fromCheckout')
        }
    }, [dispatch])


    return null
}

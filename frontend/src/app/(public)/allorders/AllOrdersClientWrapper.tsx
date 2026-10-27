'use client'

import { updateCartCountAsync } from "@/redux/slices/CartSlice"
import { useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import { clearCart } from "../cart/cart.actions"
import { AppDispatch } from "@/redux/store"
import { useSearchParams } from "next/navigation"
import { verifyOnlinePayment } from "../cart/payment/payment.actions"
import { useLanguage } from "@/context/LanguageContext"

export default function AllOrdersClientWrapper() {
    const dispatch = useDispatch<AppDispatch>()
    const searchParams = useSearchParams()
    const sessionId = searchParams.get('session_id')
    const { language } = useLanguage()
    const isAr = language === 'ar'
    const hasHandled = useRef(false)

    useEffect(() => {
        if (hasHandled.current) return
        hasHandled.current = true

        async function handlePaymentVerification() {
            try {
                if (sessionId) {
                    await verifyOnlinePayment(sessionId)
                }
                await clearCart()
                dispatch(updateCartCountAsync())

                const fromCheckout = sessionStorage.getItem('fromCheckout')
                if (fromCheckout === 'true' || sessionId) {
                    toast.success(
                        isAr
                            ? 'تم تأكيد وسداد الطلب بنجاح عبر كاشير! شكراً لتسوقكِ معنا 🎉'
                            : 'Order payment verified successfully via Kashier! 🎉'
                    )
                    sessionStorage.removeItem('fromCheckout')
                }
            } catch (err) {
                console.error('Payment wrapper error:', err)
            }
        }

        handlePaymentVerification()
    }, [sessionId, dispatch, isAr])

    return null
}

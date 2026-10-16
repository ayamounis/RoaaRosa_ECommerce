'use client'
import { Button } from "@/_Components/ui/button";
import { updateCartCountAsync } from "@/redux/slices/CartSlice";
import { AppDispatch } from "@/redux/store";
import { Trash } from "lucide-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { clearCart } from "./cart.actions";

export default function ClearCartBtn() {
    const dispatch = useDispatch<AppDispatch>()
    const handleClearCart = async () => {
        const res = await clearCart()
        if (res === null) {
            toast.error('Failed to clear cart')
        }
        else {
            toast.success('Cart cleared successfully')
            dispatch(updateCartCountAsync())
        }
    }
    useEffect(() => {
        const checkoutFlag = sessionStorage.getItem('fromCheckout')
        if (checkoutFlag === 'true') {
            toast.error('Payment is Canceled')
            sessionStorage.removeItem("fromCheckout")
        }
    }, [])

    return (
        <Button onClick={handleClearCart} className="button-primary w-full mt-2 !bg-black cursor-pointer flex items-center hover:!bg-secondary1 hover:!text-text2 border">Clear All Items<Trash /></Button>
    )
}

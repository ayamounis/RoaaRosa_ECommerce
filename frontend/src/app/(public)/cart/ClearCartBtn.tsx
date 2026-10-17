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
        <Button onClick={handleClearCart} variant='outline' className="w-full mt-2 py-2.5 rounded-full border border-[#EBDED6] dark:border-[#3D332E] bg-transparent text-[#988172] hover:text-[#C48D80] hover:border-[#C48D80] text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5 transition-colors">
            <span>Clear Bag</span>
            <Trash className='w-3.5 h-3.5' />
        </Button>
    );
}

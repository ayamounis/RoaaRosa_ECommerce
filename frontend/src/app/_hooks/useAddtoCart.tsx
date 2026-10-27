import { updateCartCountAsync } from "@/redux/slices/CartSlice"
import { AppDispatch } from "@/redux/store"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { addProductToCart } from "../(public)/cart/cart.actions"
import { useLanguage } from "@/context/LanguageContext"

export default function useAddtoCart({ id, redirectToCart = true }: { id: string; redirectToCart?: boolean }) {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const { language } = useLanguage()
    const isAr = language === 'ar'

    const handleAddToCart = async () => {
        try {
            const res = await addProductToCart(id)
            if (res && res.status !== 'error') {
                dispatch(updateCartCountAsync())
                toast.success(
                    isAr
                        ? 'تمت إضافة القطعة إلى حقيبة التسوق بنجاح! 🛍️ جاري الانتقال للحقيبة...'
                        : 'Item added to shopping bag! 🛍️ Redirecting to bag...'
                )
                if (redirectToCart) {
                    router.push('/cart')
                }
                return true
            } else {
                toast.error(
                    res?.message ||
                        (isAr ? 'تعذر إضافة القطعة إلى حقيبة التسوق' : 'Failed to add item to bag')
                )
                return false
            }
        } catch {
            toast.error(isAr ? 'حدث خطأ أثناء إضافة القطعة' : 'An error occurred while adding the item')
            return false
        }
    }
    return { handleAddToCart }
}

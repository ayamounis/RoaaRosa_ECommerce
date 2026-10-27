'use client';

import { Button } from "@/_Components/ui/button";
import useToggleCart from "@/app/_hooks/useToggleCart";
import { RootState } from "@/redux/store";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";

export default function AddToCartBtn({
    id,
    from
}: {
    id: string;
    from?: 'productDetails' | 'productCard'
}) {
    const { data: session } = useSession();
    const { language, isRtl } = useLanguage();
    const isAr = language === 'ar';
    const route = useRouter();
    const { cartIds } = useSelector((state: RootState) => state.cartCount);
    const isActive = cartIds.includes(id);

    const { active, handleToggleCart, loading } = useToggleCart({
        id,
        isActive,
        redirectToCart: true
    });

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!session) {
            e.preventDefault();
            route.push('/login');
            toast.error(
                <Link href="/login">
                    {isAr ? 'يرجى تسجيل الدخول أولاً لإضافة القطعة للحقيبة' : 'Please sign in to add to bag'}
                </Link>
            );
        } else if (active) {
            // Already in cart -> navigate directly to Cart
            e.preventDefault();
            route.push('/cart');
        } else {
            handleToggleCart(e);
        }
    };

    if (from === 'productDetails') {
        return (
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                <Button
                    onClick={handleClick}
                    className="flex-1 w-full py-6 rounded-full bg-[#C48D80] hover:bg-[#B27B6E] text-white font-medium text-sm transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                    {loading && <span className="miniLoader !border-white mr-2" />}
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                        {active
                            ? (isAr ? 'في الحقيبة • التوجه لإتمام الطلب' : 'In Bag • Proceed to Checkout')
                            : (isAr ? 'إضافة إلى حقيبة التسوق' : 'Add To Bag')}
                    </span>
                    {active && (isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />)}
                </Button>
                {active && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={(e) => handleToggleCart(e)}
                        className="text-xs text-[#988172] hover:text-rose-500 hover:bg-transparent underline underline-offset-4 py-2 px-3 cursor-pointer"
                    >
                        {isAr ? 'إزالة' : 'Remove'}
                    </Button>
                )}
            </div>
        );
    }

    return (
        <Button
            onClick={handleClick}
            className={`w-full py-2.5 rounded-none text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                active
                    ? 'bg-[#988172] hover:bg-[#7A6658] text-white'
                    : 'bg-[#2B2320] hover:bg-[#C48D80] text-white'
            }`}
        >
            {loading && <span className="miniLoader !border-white mr-2" />}
            {active
                ? (isAr ? 'في الحقيبة • عرض الحقيبة' : 'In Bag • View Bag')
                : (isAr ? 'إضافة سريعة للحقيبة' : 'Quick Add To Bag')}
        </Button>
    );
}

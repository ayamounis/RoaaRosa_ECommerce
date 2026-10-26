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

export default function AddToCartBtn({ id, from }: { id: string; from?: 'productDetails' | 'productCard' }) {
    const { data: session } = useSession();
    const { language } = useLanguage();
    const isAr = language === 'ar';
    const route = useRouter();
    const { cartIds } = useSelector((state: RootState) => state.cartCount);
    const isActive = cartIds.includes(id);

    const { active, handleToggleCart, loading } = useToggleCart({ id, isActive });
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!session) {
            e.preventDefault();
            route.push('/login');
            toast.error(
                <Link href="/login">
                    {isAr ? 'يرجى تسجيل الدخول أولاً لإضافة القطعة للحقيبة' : 'Please sign in to add to bag'}
                </Link>
            );
        } else {
            handleToggleCart(e);
        }
    };

    if (from === 'productDetails') {
        return (
            <Button
                onClick={handleClick}
                className='w-full py-6 rounded-full bg-[#C48D80] hover:bg-[#B27B6E] text-white font-medium text-sm transition-all shadow-sm active:scale-98 cursor-pointer'
            >
                {loading && <span className='miniLoader !border-white mr-2' />}
                {active
                    ? (isAr ? 'حذف من حقيبة التسوق' : 'Remove From Bag')
                    : (isAr ? 'إضافة إلى حقيبة التسوق' : 'Add To Bag')}
            </Button>
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
            {loading && <span className='miniLoader !border-white mr-2' />}
            {active
                ? (isAr ? 'في الحقيبة • حذف' : 'In Bag • Remove')
                : (isAr ? 'إضافة سريعة للحقيبة' : 'Quick Add To Bag')}
        </Button>
    );
}

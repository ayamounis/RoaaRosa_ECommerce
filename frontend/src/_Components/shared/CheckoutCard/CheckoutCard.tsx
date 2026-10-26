'use client';

import { IProductCart } from "@/app/_interfaces/Cart";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function CheckoutCard({ price, product }: { price: number; product: IProductCart['product'] }) {
    const { language } = useLanguage();
    const isAr = language === 'ar';
    const { title, imageCover } = product;

    return (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E]">
            <div className="flex items-center gap-3">
                <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shrink-0">
                    {imageCover && <Image src={imageCover} fill alt={title} className="object-cover object-top" sizes="48px" />}
                </div>
                <span className="text-xs sm:text-sm font-medium text-[#2B2320] dark:text-[#FAF6F0] line-clamp-1">{title}</span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#C48D80] shrink-0 ml-2 mr-2">
                {price} {isAr ? 'ج.م' : 'EGP'}
            </span>
        </div>
    );
}

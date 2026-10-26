'use client';

import { Button } from "@/_Components/ui/button";
import { updateProductQuantity } from "@/app/(public)/cart/cart.actions";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

export default function Incrementer({ id, count }: { id: string; count: number }) {
    const { language } = useLanguage();
    const isAr = language === 'ar';

    const handleUpdate = async (counts: number) => {
        const res = await updateProductQuantity(id, counts);
        if (res === null) {
            toast.error(isAr ? 'فشل تحديث كمية المنتج' : 'Failed to update quantity');
        } else {
            toast.success(isAr ? 'تم تحديث الكمية بنجاح' : 'Quantity updated');
            return counts;
        }
    };

    return (
        <div className="flex items-center justify-between border border-[#EBDED6] dark:border-[#3D332E] bg-[#FAF7F2] dark:bg-[#1F1917] rounded-xl overflow-hidden h-9 shadow-2xs">
            <Button
                variant='ghost'
                className="cursor-pointer h-full px-2.5 rounded-none text-[#2B2320] dark:text-[#FAF6F0] hover:bg-[#C48D80]/15 hover:text-[#C48D80] disabled:opacity-30"
                disabled={count <= 1}
                onClick={() => count > 1 && handleUpdate(count - 1)}
            >
                <Minus className='w-3 h-3' />
            </Button>
            <span className="w-8 font-semibold text-xs text-center text-[#2B2320] dark:text-[#FAF6F0]">
                {count}
            </span>
            <Button
                variant='ghost'
                className="cursor-pointer h-full px-2.5 rounded-none text-[#2B2320] dark:text-[#FAF6F0] hover:bg-[#C48D80]/15 hover:text-[#C48D80]"
                onClick={() => handleUpdate(count + 1)}
            >
                <Plus className='w-3 h-3' />
            </Button>
        </div>
    );
}

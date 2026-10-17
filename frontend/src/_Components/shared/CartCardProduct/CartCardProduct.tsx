import { Tooltip, TooltipContent, TooltipTrigger } from "@/_Components/ui/tooltip";
import { ItemType } from "@/app/(public)/cart/page";
import RemoveCartBtn from "@/app/(public)/cart/RemoveCartBtn";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Incrementer from "../Incrementer/Incrementer";

export default async function CartCardProduct({ product }: { product: ItemType }) {
    const { product: { imageCover, title, ratingsAverage, brand, category, _id }, count, price } = product;
    return (
        <div className='flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs gap-4 sm:gap-6'>
            <Link href={'/productDetails/' + _id} className='relative w-28 h-36 rounded-xl overflow-hidden bg-[#FAF7F2] dark:bg-[#1F1917] flex-shrink-0'>
                <Image src={imageCover} fill alt={title} className="object-cover object-top" sizes='112px' />
            </Link>
            <div className="flex-1 w-full flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#988172]">{category?.name || "ROAROSA Girls"}</span>
                    <Link href={'/productDetails/' + _id}>
                        <h2 className="text-sm sm:text-base font-medium text-[#2B2320] dark:text-[#FAF6F0] hover:text-[#C48D80] transition-colors">{title}</h2>
                    </Link>
                    {ratingsAverage !== undefined && (
                        <div className="text-xs text-[#988172] flex items-center gap-1">
                            <Star size={14} fill="#C48D80" color="#C48D80" />
                            <span>{ratingsAverage}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 pt-1">
                        <span className="text-xs font-bold text-[#C48D80]">{price} EGP</span>
                        {brand?.name && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-[#FAF7F2] dark:bg-[#1F1917] text-[#988172] border border-[#EBDED6] dark:border-[#3D332E]">
                                {brand.name}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex sm:flex-col justify-between items-end gap-3">
                    <div className="flex items-center gap-3">
                        <Incrementer count={count} id={_id} />
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <RemoveCartBtn id={_id} />
                            </TooltipTrigger>
                            <TooltipContent className="text-xs text-white bg-[#C48D80]">
                                <p>Remove From Bag</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-[#988172]">{price} EGP × {count}</p>
                        <p className="text-sm sm:text-base font-bold text-[#2B2320] dark:text-[#FAF6F0]">{price * count} EGP</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

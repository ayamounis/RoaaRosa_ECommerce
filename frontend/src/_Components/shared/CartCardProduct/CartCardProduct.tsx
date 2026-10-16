import { Badge } from "@/_Components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/_Components/ui/tooltip";
import { ItemType } from "@/app/(public)/cart/page";
import RemoveCartBtn from "@/app/(public)/cart/RemoveCartBtn";
import { Star, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Incrementer from "../Incrementer/Incrementer";

export default async function CartCardProduct({ product }: { product: ItemType }) {
    const { product: { imageCover, title, ratingsAverage, brand, category, _id, sold }, count } = product
    return (
        <div className={`justify-between  rounded-lg bg-text dark:bg-primary p-6 shadow-md sm:flex sm:justify-start`}>
            <Link href={'/productDetails/' + _id}>
                <Image src={imageCover} width={100} height={100} alt={title} className="w-full object-contain rounded-lg sm:w-40" />
            </Link>
            <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                <div className="mt-5 flex flex-col gap-4 sm:mt-0">
                    <h2 className="text-lg font-bold text-text2">{title}</h2>
                    <p className=" text-sm text-text1 flex items-center gap-2"><span className="underline font-medium">{ratingsAverage} </span><Star size={16} fill="currentColor" color="currentColor" className="text-yellow-400" /> Ratings</p>
                    {sold && <p className=" text-sm text-gray-700 flex items-center gap-2"><span className="underline font-medium">{sold} </span><User size={16} fill="currentColor" color="currentColor" className="text-secondary2" /> Sold</p>}
                    <Badge className=" text-sm text-secondary2 bg-secondary">{category.name} </Badge>
                    <Badge className=" text-sm text-secondary1 bg-secondary2">{brand.name} </Badge>
                </div>
                <div className="mt-4 flex justify-between items-center sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                    <Incrementer count={count} id={_id} />
                    <div className="flex justify-center gap-5 flex-col  space-x-4">
                        <div className="flex items-center gap-4">
                            <p className="text-md font-semibold text-nowrap">${product?.price} EGP</p>
                            <Tooltip>
                                <TooltipTrigger>
                                    <RemoveCartBtn id={_id} />
                                </TooltipTrigger>
                                <TooltipContent className="text-sm text-text bg-secondary2">
                                    <p>Remove From Cart</p>
                                </TooltipContent>
                            </Tooltip>

                        </div>
                        <div className="total product">
                            <p className="text-md font-medium "> ${product?.price} x {product?.count}</p>
                            <p className="text-lg font-semibold ">Total ${product?.price * product?.count} EGP</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

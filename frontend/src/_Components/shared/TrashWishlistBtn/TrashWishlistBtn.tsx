'use client'
import useRemoveWishlist from "@/app/_hooks/useRemoveWishlist";
import { Trash2 } from "lucide-react";
import { FormEvent } from "react";

export default function TrashWishlistBtn({ productId }: { productId: string }) {
    const { loading, handleRemoveFromWisList } = useRemoveWishlist({ productId })
    const handleRemove = (e:FormEvent) => {
        e.preventDefault()
        handleRemoveFromWisList()
    }
    return (
        <div className='absolute top-3 right-3 flex gap-2 flex-col text-xs'>
            {loading ?
                <div className="flex-center">
                    <span className="miniLoader"></span>
                </div>
                :
                <span onClick={handleRemove} className='bg-Bg size-[34] rounded-full flex-center cursor-pointer group-hover:scale-105 duration-200 hover:bg-red-500 hover:text-text'>
                    <Trash2 className='size-6 flex-center ' />
                </span>
            }
        </div>
    )
}

'use client'
import useToggleWishlist from "@/app/_hooks/useToggleWishlist";
import { RootState } from "@/redux/store";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function AddToWishlistBtn({ productId }: { productId: string }) {
    const { data: session } = useSession()
    const route = useRouter()
    const { wishlistIds } = useSelector((state: RootState) => state.wishlist);
    const isWishlisted = wishlistIds.includes(productId);
    const { handleToggle, loading, isActive } = useToggleWishlist({ productId, isWishlisted })
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!session) {
            e.preventDefault()
            toast.error(<Link href="/login">You must Login First </Link>)
            route.push('/login')
        } else
            handleToggle(e)
    }

    return (
        <>
            {

                loading ?
                    <div className="flex-center">
                        <div className="miniLoader"></div>
                    </div>
                    :
                    <span onClick={handleClick} className='bg-Bg size-[34] rounded-full flex-center cursor-pointer group-hover:scale-105 duration-200'>
                        <Heart className={`hover:scale-110 duration-200 hover:text-red-500 hover:fill-red-500 ${isActive ? 'fill-red-500 text-red-500' : ''}`} color="currentColor" strokeWidth={1.5} />
                    </span >
            }
        </>
    )
}

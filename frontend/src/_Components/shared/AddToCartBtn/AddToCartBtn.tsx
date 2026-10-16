'use client'
import { Button } from "@/_Components/ui/button";
import useToggleCart from "@/app/_hooks/useToggleCart";
import { RootState } from "@/redux/store";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function AddToCartBtn({ id, from }: { id: string, from?: 'productDetails' | 'productCard' }) {
    const { data: session } = useSession()
    const route = useRouter()
    const { cartIds } = useSelector((state: RootState) => state.cartCount)
    const isActive = cartIds.includes(id)

    const { active, handleToggleCart, loading } = useToggleCart({ id, isActive })
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!session) {
            e.preventDefault()
            route.push('/login')
            toast.error(<Link href="/login">You must Login First </Link>)
        } else
            handleToggleCart(e)
    }
    return (
        <Button onClick={handleClick} className={`${from === 'productDetails' ? 'button-primary rounded-xs px-12 w-10/12' : `w-full absolute cursor-pointer rounded-none bottom-0 ${active && 'md:!bottom-0 !bg-hover-button2 hover:!bg-secondary2'} md:-bottom-10  bg-button dark:bg-secondary2 text-text hover:text-text  hover:bg-text1  group-hover:bottom-0 duration-200`} `}>
            {loading &&
                <div className="flex-center ">
                    <span className={`miniLoader dark:!border-white`}></span>
                </div>
            }
            {
                active ? 'Remove From Cart' : 'Add To Cart'
            }
        </Button>
    )
}

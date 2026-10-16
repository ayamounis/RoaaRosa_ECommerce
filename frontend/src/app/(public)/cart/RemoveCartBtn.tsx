'use client'
import useRemoveFromCart from "@/app/_hooks/useRemoveFromCart";

export default function RemoveCartBtn({ id }: { id: string }) {
    const { handleRemoveFromCart } = useRemoveFromCart({ id })
    return (
        <span onClick={handleRemoveFromCart} className="cursor-pointer duration-200 text-text bg-button2 block p-1 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3.5" stroke="currentColor" className="h-5 w-5 cursor-pointer duration-200 hover:text-text2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </span>
    )
}

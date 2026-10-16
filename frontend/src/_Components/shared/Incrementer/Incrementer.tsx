'use client'

import { Button } from "@/_Components/ui/button"
import { updateProductQuantity } from "@/app/(public)/cart/cart.actions"
import { Minus, Plus } from "lucide-react"
import { toast } from "sonner"

export default function Incrementer({ id , count }: { id: string , count: number }) {
    const handleUpdate = async (counts: number) => {
        const res = await updateProductQuantity(id, counts)
        if (res === null) {
            toast.error('Failed to update product quantity')
        }
        else {
            toast.success('Product quantity updated successfully')
            return counts
        }
    }
    return (
        <div className="flex items-center justify-between border-text2 border rounded-2xl overflow-hidden">
            <Button className="cursor-pointer  bg-transparent hover:bg-hover-button1 border-text2  rounded-none text-text2 p-3 border-r-1 disabled:bg-accent-foreground disabled:text-text" disabled={count === 1} onClick={() => count > 0 && handleUpdate(count - 1)}><Minus /></Button>
            <span className="w-10 font-medium  text-center">{count}</span>
            <Button className="cursor-pointer -r bg-button2 hover:bg-hover-button2  rounded-none text-text p-3" onClick={() => handleUpdate(count + 1)}><Plus /></Button>
        </div>
    )
}

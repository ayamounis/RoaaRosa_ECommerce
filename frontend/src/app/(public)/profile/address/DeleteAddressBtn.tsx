'use client'

import { Trash2 } from "lucide-react"
import { deleteAddress } from "./Address.action"
import { toast } from "sonner"

export default function DeleteAddressBtn({ id }: { id: string }) {
    const handleDelete = async () => {
        const res = await deleteAddress(id)
        if (res.status === 'success') {
            toast.success(res.message)
        } else {
            toast.error(res.message)
        }
    }
    return (
        <span onClick={handleDelete} className="bg-red-500 text-white p-1 rounded-full absolute bottom-2 right-2 sm:-right-10  sm:group-hover:right-2 hover:scale-110 duration-200 cursor-pointer"><Trash2 /></span>
    )
}

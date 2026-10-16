'use client'
import { IAddress } from "@/app/_interfaces/address";
import { setAddress } from "@/redux/slices/Address";
import { useDispatch } from "react-redux";

export default function AddressCardPayment({ address }: { address: IAddress }) {
    const dispatch = useDispatch()
    const handleAddAdress = () => {
        dispatch(setAddress(address))
    }
    return (
        <div onClick={handleAddAdress} className="bg-primary border-1 border-secondary1 pt-6 p-4  rounded-md shadow-md relative group hover:scale-105 duration-200">
            <div className="space-y-2">
                <p className="text-text2 text-xs font-medium">Address Place: <span className="text-secondary2"> {address.name}</span></p>
                <p className="text-text2 text-xs">Phone: <span className="text-text1">{address.phone} </span></p>
                <p className="text-text2 text-xs">Details: <span className="text-text1"> {address.details}</span></p>
            </div>
        </div>
    )
}


import { IAddress } from "@/app/_interfaces/address";
import DeleteAddressBtn from "./DeleteAddressBtn";

export default function AddressCard({ address }: { address: IAddress }) {
    return (
        <div className="bg-primary pt-6 p-4 border-l-4 border-t-1 border-t-secondary border-l-secondary2 rounded-md shadow-md relative group hover:scale-105 duration-200 overflow-hidden">
            <span className="absolute top-0 right-0 p-1 rounded-bl-sm text-text bg-secondary2 text-xs ">{address.city}</span>
            <DeleteAddressBtn id={address._id} />
            <div className="space-y-2">
                <p className="text-text2 text-lg font-medium">Address Place: <span className="text-secondary2"> {address.name}</span></p>
                <p className="text-text2 text-md">Phone: <span className="text-text1">{address.phone} </span></p>
                <p className="text-text2 text-md">Details: <span className="text-text1"> {address.details}</span></p>
            </div>
        </div>
    )
}

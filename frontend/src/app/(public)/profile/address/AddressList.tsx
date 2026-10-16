import { IAddress } from "@/app/_interfaces/address";
import AddressCard from "./AddressCard";
import AddressCardPayment from "@/_Components/shared/AddressCardPayment/AddressCardPayment";

export default function AddressList({ address, from }: { address: IAddress[], from?: string }) {
    return (
        <div className="grid md:grid-cols-2 w-full gap-4" >
            {address.map((address) => (
                from === 'payment' ? (
                    <AddressCard key={address._id} address={address} />
                ):(
                    <AddressCardPayment key={address._id} address={address} />
                )
            ))}
        </div>
    )
}

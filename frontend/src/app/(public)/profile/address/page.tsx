export const dynamic = "force-dynamic";

import { getAllAddress } from "@/app/_services/address.services";
import AddressList from "./AddressList";

export default async function address() {
    const res = await getAllAddress()
    if (res.status !== 'success') {
        return null
    }
    const addresses = res.data
    return (
        <div className="p-10 shadow-shadow bg-primary">
            <h2 className="text-secondary2 font-medium text-xl">List of Address</h2>
            <div className="mt-6">
                {addresses && addresses.length > 0 ? (
                    <AddressList address={addresses} />
                ) : (
                    <p className="text-center text-secondary2 font-medium text-lg">No Address Found</p>
                )}
            </div>
        </div>
    )
}


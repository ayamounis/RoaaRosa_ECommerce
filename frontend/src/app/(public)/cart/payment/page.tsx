export const dynamic = "force-dynamic";

import PaymentForm from "./PaymentForm"
import { getAllAddress } from "@/app/_services/address.services"
import AddressList from "../../profile/address/AddressList"
import PaymentClientHeader from "./PaymentClientHeader"

export default async function Payment() {
    const res = await getAllAddress()
    const addresses = res?.data
    return (
        <div className="py-8 sm:py-12 bg-[#FBF9F3] dark:bg-[#1F1917] min-h-screen">
            <div className="container max-w-7xl">
                <PaymentClientHeader />
                {addresses && addresses.length > 0 && (
                    <div className="mb-6 w-full sm:w-100 flex flex-wrap">
                        <AddressList address={addresses} />
                    </div>
                )}
                <PaymentForm />
            </div>
        </div>
    )
}

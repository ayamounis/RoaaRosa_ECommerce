export const dynamic = "force-dynamic";

import { Inter } from "next/font/google"
import PaymentForm from "./PaymentForm"
import { getAllAddress } from "@/app/_services/address.services"
import AddressList from "../../profile/address/AddressList"

const inter = Inter({
    subsets: ['latin'],
    weight: '500'
})
export default async function Payment() {
    const res = await getAllAddress()
    const addresses = res?.data
    return (
        <div className="min-h-110  my-5 rounded-2xl py-10">
            <h1 className={`${inter.className} text-4xl text-text2`}>Billing Details</h1>
            <div className="mb-6 mt-2 w-full sm:w-100 flex flex-wrap">
                {addresses && addresses.length > 0 && (
                    <AddressList address={addresses} />
                )}
            </div>
            <PaymentForm />
        </div >
    )
}


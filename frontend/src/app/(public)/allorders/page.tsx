export const dynamic = "force-dynamic";

import { nextAuthConfig } from "@/next-auth/nextAuth.config";
import { getServerSession } from "next-auth";
import { IOrder } from "@/app/_interfaces/order";
import OrderCard from "@/_Components/shared/OrderCard/OrderCard";
import { ISession } from "@/app/_interfaces/session";
import { getAllUserOrders } from "@/app/_services/order.services";
import AllOrdersClientWrapper from "./page.client";

export default async function Allorders() {
    const session: ISession | null = await getServerSession(nextAuthConfig)
    const userId = session?.user?.id || ''
    const orders = await getAllUserOrders(userId)
    orders.sort((a: IOrder, b: IOrder) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return (
        <div className="min-h-110 bg-gradient-to-b from-secondary1 to-Bg my-5 rounded-2xl py-10">
            <AllOrdersClientWrapper />
            <h1 className="mb-10 text-center font-bold text-5xl text-">All <span className="text-secondary2">Orders</span></h1>
            <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
                <div className="rounded-lg w-full flex flex-col gap-4">
                    {
                        orders.length > 0 ? (
                            orders.map((order: IOrder) => (
                                <OrderCard key={order._id} order={order} />
                            ))
                        ) : (
                            <p className="text-center text-2xl text-secondary2">No Orders Found</p>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

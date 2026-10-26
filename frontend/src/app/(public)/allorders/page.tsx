export const dynamic = "force-dynamic";

import { nextAuthConfig } from "@/next-auth/nextAuth.config";
import { getServerSession } from "next-auth";
import { IOrder } from "@/app/_interfaces/order";
import { ISession } from "@/app/_interfaces/session";
import { getAllUserOrders } from "@/app/_services/order.services";
import AllOrdersClientWrapper from "./page.client";
import OrdersClientView from "./OrdersClientView";

export default async function Allorders() {
    const session: ISession | null = await getServerSession(nextAuthConfig);
    const userId = session?.user?.id || '';
    const orders = await getAllUserOrders(userId);
    orders.sort((a: IOrder, b: IOrder) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <>
            <AllOrdersClientWrapper />
            <OrdersClientView orders={orders} />
        </>
    );
}

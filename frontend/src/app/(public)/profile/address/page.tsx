export const dynamic = "force-dynamic";

import { getAllAddress } from "@/app/_services/address.services";
import AddressPageView from "./AddressPageView";

export default async function AddressPage() {
    const res = await getAllAddress();
    const addresses = res?.data || [];

    return <AddressPageView addresses={addresses} />;
}

export const dynamic = "force-dynamic";

import { getAllWishlistItems } from "@/app/_services/wishlist.services";
import WishlistView from "./WishlistView";
import { IProduct } from "@/app/_interfaces/products";

export default async function Wishlist() {
    const res = await getAllWishlistItems();
    const data: IProduct[] = res?.data ?? [];
    const count: number = res?.count ?? 0;

    return <WishlistView data={data} count={count} />;
}

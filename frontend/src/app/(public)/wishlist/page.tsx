export const dynamic = "force-dynamic";

import ProductCard from "@/_Components/shared/ProductCard/ProductCard"
import { IProduct } from "@/app/_interfaces/products"
import { getAllWishlistItems } from "@/app/_services/wishlist.services"

export default async function Wishlist() {
    const { data, status, count } = await getAllWishlistItems()
    return (
        <div className="min-h-110 bg-gradient-to-b from-secondary1 to-Bg my-5 rounded-2xl py-10">
            <h1 className="mb-10 text-center font-bold text-5xl text-"><span className="text-secondary2">Wishlist</span> ({count})</h1>
            <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-y-10 ">
                {status == 'success' && data.map((product: IProduct) => (
                    <ProductCard from="wishlist" key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}

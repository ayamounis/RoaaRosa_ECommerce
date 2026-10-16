import { IProductCart } from "@/app/_interfaces/Cart";
import Image from "next/image";


export default function CheckoutCard({ price, product }: { price: number, product: IProductCart['product'] }) {
    const { title, imageCover } = product
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Image src={imageCover} width={54} height={54} alt={title} />
                <span>{title}</span>
            </div>
            <span>${price}</span>
        </div>
    )
}

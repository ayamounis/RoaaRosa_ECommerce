import ProductDetailsSlider from "@/_Components/ProductDetailsSlider/ProductDetailsSlider";
import AddToCartBtn from "@/_Components/shared/AddToCartBtn/AddToCartBtn";
import AddToWishlistBtn from "@/_Components/shared/AddToWishlistBtn/AddToWishlistBtn";
import Stars from "@/_Components/shared/Stars/Stars";
import { GetSpecificProduct } from "@/app/_services/products.services";
import { Inter } from "next/font/google";

const inter = Inter({
    weight: ['400', '600'],
    subsets: ['latin']
})
type ProductDetailsProps = {
    params: Promise<{ id: string }>
}
export default async function ProductDetails({params}: ProductDetailsProps) {
    const {id}=await params
    const product = await GetSpecificProduct(id);
    if (!product) {
        return
    }
    return (
        <div className="my-10 gap-8  flex items-center flex-col sm:flex-row ">
            <div className=" sm:w-2/3">
                <ProductDetailsSlider title={product.title || ''} imageCover={product.imageCover || ""} images={product.images || []} />
            </div>
            <div className="flex flex-col sm:w-1/3">
                <h1 className={`text-2xl/[24px] font-semibold  ${inter.className}`}>{product.title || ''}</h1>
                <div className="flex items-center gap-2 my-4">
                    <Stars ratingsAverage={product.ratingsAverage || 0} />
                    <span className=' text-sm text-text2/50'>({product.ratingsQuantity} Reviews)</span>
                    <span className="text-text2/50">|</span>
                    <span className="text-button1">In Stock</span>
                </div>
                <p className={`${inter.className} tracking-wide text-2xl mb-6`}>${product.price}</p>
                <p className={`${inter.className} text-sm/[21px] pb-6 border-b-2`}>{product.description}</p>
                {product.category.name.includes('Fashion') &&
                    <div className="flex items-center gap-4 my-6">
                        <span>Size:</span>
                        <div className="flex items-center gap-2">
                            <span className="px-2 text-sm font-medium py-1 border border-text2/50 rounded-md bg-gray-400">XS</span>
                            <span className="px-2 text-sm font-medium py-1 border border-text2/50 rounded-md bg-gray-400">S</span>
                            <span className="px-2 text-sm font-medium bg-button2 text-text py-1 border border-text2/50 rounded-md">M</span>
                            <span className="px-2 text-sm font-medium py-1 border border-text2/50 rounded-md bg-gray-400">L</span>
                            <span className="px-2 text-sm font-medium py-1 border border-text2/50 rounded-md bg-gray-400">XL</span>
                        </div>
                    </div>
                }
                <div className="flex justify-between gap-4">
                    <AddToCartBtn id={product._id} from="productDetails" />
                    <span className="border border-black/50 flex-center rounded-sm px-[2px]">
                        <AddToWishlistBtn productId={product._id} />
                    </span>
                </div>
            </div>
        </div>
    );
}

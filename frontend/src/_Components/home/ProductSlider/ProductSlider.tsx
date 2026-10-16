import ProductCard from "@/_Components/shared/ProductCard/ProductCard";
import SectionTitle from "@/_Components/shared/SectionTitle/SectionTitle";
import { getAllProducts } from "@/app/_services/products.services";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Countdown from "../Countdown/Countdown";
import SectionSlider from '../SectionSlider/SectionSlider';

export default async function ProductSlider() {
    const products = await getAllProducts()
    if (!products) {
        return
    }
    const discountProducts = products?.filter((item) => item.priceAfterDiscount)

    return (
        <div className="category-slider mt-15">
            <div>
                <div className="countdown flex flex-wrap gap-x-20 items-end">
                    <SectionTitle title='Today’s' desc="Flash Sales" />
                    <div className="flex justify-end max-sm:w-full max-sm:my-5">
                        <Countdown />
                    </div>
                </div>
            </div>
            <div className="flex gap-3 justify-end">
                <span className="review-prev-product flex-center size-8 rounded-full duration-200 hover:bg-gray-200">
                    <ArrowLeft />
                </span>
                <span className="review-next-product flex-center size-8 rounded-full duration-200 hover:bg-gray-200">
                    <ArrowRight />
                </span>
            </div>
            <div className="my-10">
                <SectionSlider
                    uniqueId={'product'}
                    slidesPerView={4.5}
                    spaceBetween={10}
                    items={discountProducts?.map((item) => (
                        <ProductCard
                            key={item._id}
                            product={item}
                        />
                    ))}
                />
            </div>
        </div>
    )
}

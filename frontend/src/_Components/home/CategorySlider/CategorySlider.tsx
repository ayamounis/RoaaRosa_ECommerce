import { ArrowLeft, ArrowRight } from "lucide-react";
import SectionSlider from '../SectionSlider/SectionSlider';
import CategoryCard from "../CategoryCard/CategoryCard";
import { getAllCategories } from "@/app/_services/Categories.services";
import SectionTitle from "@/_Components/shared/SectionTitle/SectionTitle";

export default async function CategorySlider() {
    const categories = await getAllCategories()
    return (
        <div className="category-slider mt-15">
            <div className="flex justify-between items-end ">
                <SectionTitle title="Categories" desc="Browse By Category" />
                <div className="flex gap-3">
                    <span className="review-prev-categories flex-center size-8 rounded-full duration-200 hover:bg-gray-200">
                        <ArrowLeft />
                    </span>
                    <span className="review-next-categories flex-center size-8 rounded-full duration-200 hover:bg-gray-200">
                        <ArrowRight />
                    </span>
                </div>
            </div>
            <div className="my-10">
                <SectionSlider
                    uniqueId={'categories'}
                    items={
                        categories?.map((item) => (
                            <CategoryCard
                                key={item._id}
                                image={item.image}
                                title={item.slug}
                                id={item._id}
                            />
                        ))}
                />
            </div>
        </div>
    )
}

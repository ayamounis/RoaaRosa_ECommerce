'use client';
import { IProduct } from "@/app/_interfaces/products";
import { Suspense, useState } from "react";
import FilterGroup from "../FilterGroup/FilterGroup";
import ProductCard from "../ProductCard/ProductCard";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductList({ products }: { products: IProduct[] }) {
    const [isOpenFilter, setIsOpenFilter] = useState(true);

    return (
        <div className='flex gap-8 relative items-start'>
            {/* Desktop Filter Sidebar */}
            <aside
                className={`hidden lg:block transition-all duration-300 flex-shrink-0 ${
                    isOpenFilter ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden'
                }`}
            >
                <div className='sticky top-32 p-5 bg-white dark:bg-[#28211E] rounded-2xl border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs'>
                    <div className='flex items-center justify-between pb-3 mb-4 border-b border-[#EBDED6] dark:border-[#3D332E]'>
                        <div className='flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2B2320] dark:text-[#FAF6F0]'>
                            <SlidersHorizontal className='w-4 h-4 text-[#C48D80]' />
                            <span>Filters</span>
                        </div>
                        <button
                            onClick={() => setIsOpenFilter(false)}
                            className='text-xs text-[#988172] hover:text-[#C48D80] flex items-center'
                            title='Collapse filters'
                        >
                            <ChevronLeft className='w-4 h-4' />
                        </button>
                    </div>
                    <Suspense fallback={<div className='p-4 text-xs text-[#988172]'>Loading filters...</div>}>
                        <FilterGroup isOpenFilter={isOpenFilter} setIsOpenFilter={setIsOpenFilter} from='lg' />
                    </Suspense>
                </div>
            </aside>

            {/* Toggle Button when Filter is Collapsed on Desktop */}
            {!isOpenFilter && (
                <button
                    onClick={() => setIsOpenFilter(true)}
                    className='hidden lg:flex sticky top-32 items-center gap-2 px-3 py-2 rounded-r-xl bg-white dark:bg-[#28211E] border border-l-0 border-[#EBDED6] dark:border-[#3D332E] shadow-xs text-xs font-medium text-[#2B2320] dark:text-[#FAF6F0] hover:text-[#C48D80]'
                >
                    <SlidersHorizontal className='w-3.5 h-3.5 text-[#C48D80]' />
                    <span>Show Filters</span>
                    <ChevronRight className='w-3.5 h-3.5' />
                </button>
            )}

            {/* Product Grid */}
            <div className='flex-1 min-w-0'>
                <div
                    className={`grid gap-5 sm:gap-6 ${
                        isOpenFilter
                            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                    }`}
                >
                    {products?.map((product: IProduct, idx: number) => (
                        <ProductCard
                            key={product.id || product._id}
                            product={product}
                            dataAos='fade-up'
                            dataAosDelay={(idx % 6) * 70}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

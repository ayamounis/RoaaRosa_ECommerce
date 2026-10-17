import ProductDetailsSlider from "@/_Components/ProductDetailsSlider/ProductDetailsSlider";
import ProductInteractiveActions from "@/_Components/shared/ProductInteractiveActions/ProductInteractiveActions";
import Stars from "@/_Components/shared/Stars/Stars";
import { GetSpecificProduct } from "@/app/_services/products.services";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";

type ProductDetailsProps = {
    params: Promise<{ id: string }>;
};

export default async function ProductDetails({ params }: ProductDetailsProps) {
    const { id } = await params;
    const product = await GetSpecificProduct(id);

    if (!product) {
        return (
            <div className='container py-24 text-center'>
                <h2 className='font-serif text-3xl font-bold text-[#2B2320] dark:text-[#FAF6F0] mb-4'>
                    Product Not Found
                </h2>
                <Link
                    href='/products'
                    className='inline-flex items-center px-6 py-2.5 rounded-full bg-[#C48D80] text-white text-xs font-semibold'
                >
                    Back to Girls&apos; Collection
                </Link>
            </div>
        );
    }

    return (
        <div className='py-8 sm:py-12 bg-[#FBF9F3] dark:bg-[#1F1917] min-h-screen'>
            <div className='container'>
                {/* Breadcrumbs */}
                <nav className='flex items-center gap-1.5 text-xs text-[#988172] mb-8'>
                    <Link href='/' className='hover:text-[#2B2320] dark:hover:text-white transition-colors'>
                        Home
                    </Link>
                    <ChevronRight className='w-3 h-3 text-[#988172]/60' />
                    <Link href='/products' className='hover:text-[#2B2320] dark:hover:text-white transition-colors'>
                        Girls
                    </Link>
                    <ChevronRight className='w-3 h-3 text-[#988172]/60' />
                    <Link
                        href={`/products?category=${product.category?.slug || 'all'}`}
                        className='hover:text-[#2B2320] dark:hover:text-white transition-colors'
                    >
                        {product.category?.name || "Girls' Clothing"}
                    </Link>
                    <ChevronRight className='w-3 h-3 text-[#988172]/60' />
                    <span className='font-medium text-[#2B2320] dark:text-[#FAF6F0] truncate max-w-xs'>
                        {product.title}
                    </span>
                </nav>

                <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start'>
                    {/* Left: Product Images */}
                    <div
                        className='lg:col-span-7 bg-white dark:bg-[#28211E] p-4 sm:p-6 rounded-2xl border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs'
                        data-aos='fade-right'
                    >
                        <ProductDetailsSlider
                            title={product.title || ''}
                            imageCover={product.imageCover || ""}
                            images={product.images && product.images.length > 0 ? product.images : [product.imageCover]}
                        />
                    </div>

                    {/* Right: Product Details & Actions */}
                    <div
                        className='lg:col-span-5 flex flex-col space-y-6'
                        data-aos='fade-left'
                    >
                        <div>
                            <span className='text-xs font-semibold tracking-widest uppercase text-[#C48D80]'>
                                {product.category?.name || "ROAROSA Girls"}
                            </span>
                            <h1 className='font-serif text-2xl sm:text-3xl font-bold text-[#2B2320] dark:text-[#FAF6F0] mt-1'>
                                {product.title}
                            </h1>
                        </div>

                        {/* Rating & Stock */}
                        <div className='flex items-center gap-3 text-xs'>
                            <div className='flex items-center gap-1.5'>
                                <Stars ratingsAverage={product.ratingsAverage || 5.0} />
                                <span className='text-[#988172]'>
                                    ({product.ratingsQuantity || 48} reviews)
                                </span>
                            </div>
                            <span className='text-[#EBDED6] dark:text-[#3D332E]'>|</span>
                            <span className='inline-flex items-center gap-1 text-[#2B2320] dark:text-[#E5C2AF] font-medium'>
                                <span className='w-2 h-2 rounded-full bg-[#C48D80]' />
                                In Stock • Egypt Dispatch
                            </span>
                        </div>

                        {/* Price */}
                        <div className='flex items-baseline gap-3 pb-4 border-b border-[#EBDED6] dark:border-[#3D332E]'>
                            {product.priceAfterDiscount ? (
                                <>
                                    <span className='font-serif text-3xl font-bold text-[#C48D80]'>
                                        {product.priceAfterDiscount} EGP
                                    </span>
                                    <span className='text-sm line-through text-[#988172] font-normal'>
                                        {product.price} EGP
                                    </span>
                                    <span className='text-xs font-bold text-white bg-[#C48D80] px-2 py-0.5 rounded-full'>
                                        Save {Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)}%
                                    </span>
                                </>
                            ) : (
                                <span className='font-serif text-3xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                                    {product.price} EGP
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <p className='text-xs sm:text-sm text-[#5A4F4A] dark:text-[#D1C5BD] leading-relaxed'>
                            {product.description}
                        </p>

                        {/* Interactive Sizes, Swatches, Size Guide & Add To Bag */}
                        <ProductInteractiveActions
                            productId={product._id || product.id}
                            swatches={product.swatches}
                        />

                        {/* Care & Delivery Trust Specs */}
                        <div className='p-4 rounded-xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] space-y-2.5 text-xs text-[#988172]'>
                            <div className='flex items-center gap-2 text-[#2B2320] dark:text-[#FAF6F0] font-medium'>
                                <Truck className='w-4 h-4 text-[#C48D80]' />
                                <span>Free Express Delivery over 1,500 EGP across Egypt</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <RotateCcw className='w-4 h-4 text-[#C48D80]' />
                                <span>14-day hassle-free doorstep returns and exchanges</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <ShieldCheck className='w-4 h-4 text-[#C48D80]' />
                                <span>Certified Sensitive-Skin Safe • 100% Gentle Natural Fibers</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

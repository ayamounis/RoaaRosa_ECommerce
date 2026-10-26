'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import ProductDetailsSlider from '@/_Components/ProductDetailsSlider/ProductDetailsSlider';
import ProductInteractiveActions from '@/_Components/shared/ProductInteractiveActions/ProductInteractiveActions';
import Stars from '@/_Components/shared/Stars/Stars';
import { IProduct } from '@/app/_interfaces/products';

const CATEGORY_AR_NAMES: Record<string, string> = {
  'dresses': 'فساتين وأطقم خفيفة',
  'tops': 'بلوزات وتيشيرتات',
  'knitwear': 'صوف وتريكو',
  'coats': 'معاطف وجواكت',
  'sets': 'أطقم وتنسيقات',
  'nightwear': 'ملابس نوم وبيجامات',
  'occasions': 'مناسبات وسهرات',
  'all': 'جميع أزياء البنات',
};

export default function ProductDetailsClientView({ product }: { product: IProduct }) {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  const catSlug = (product.category?.slug || '').toLowerCase();
  const catName = isAr
    ? CATEGORY_AR_NAMES[catSlug] || product.category?.name || 'أزياء البنات'
    : product.category?.name || "Girls' Clothing";

  const currency = isAr ? 'ج.م' : 'EGP';
  const discountPercent = product.priceAfterDiscount
    ? Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)
    : 0;

  const Separator = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div className='py-8 sm:py-12 bg-[#FBF9F3] dark:bg-[#1F1917] min-h-screen'>
      <div className='container'>
        {/* Breadcrumbs */}
        <nav className='flex items-center gap-1.5 text-xs text-[#988172] mb-8'>
          <Link href='/' className='hover:text-[#2B2320] dark:hover:text-white transition-colors'>
            {isAr ? 'الرئيسية' : 'Home'}
          </Link>
          <Separator className='w-3 h-3 text-[#988172]/60' />
          <Link href='/products' className='hover:text-[#2B2320] dark:hover:text-white transition-colors'>
            {isAr ? 'أزياء البنات' : 'Girls'}
          </Link>
          <Separator className='w-3 h-3 text-[#988172]/60' />
          <Link
            href={`/products?category=${product.category?.slug || 'all'}`}
            className='hover:text-[#2B2320] dark:hover:text-white transition-colors'
          >
            {catName}
          </Link>
          <Separator className='w-3 h-3 text-[#988172]/60' />
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
              imageCover={product.imageCover || ''}
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
                {catName}
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
                  ({product.ratingsQuantity || 48} {isAr ? 'تقييم' : 'reviews'})
                </span>
              </div>
              <span className='text-[#EBDED6] dark:text-[#3D332E]'>|</span>
              <span className='inline-flex items-center gap-1 text-[#2B2320] dark:text-[#E5C2AF] font-medium'>
                <span className='w-2 h-2 rounded-full bg-[#C48D80]' />
                {isAr ? 'متوفر بالمخزون • شحن فوري في مصر' : 'In Stock • Egypt Dispatch'}
              </span>
            </div>

            {/* Price */}
            <div className='flex items-baseline gap-3 pb-4 border-b border-[#EBDED6] dark:border-[#3D332E]'>
              {product.priceAfterDiscount ? (
                <>
                  <span className='font-serif text-3xl font-bold text-[#C48D80]'>
                    {product.priceAfterDiscount} {currency}
                  </span>
                  <span className='text-sm line-through text-[#988172] font-normal'>
                    {product.price} {currency}
                  </span>
                  <span className='text-xs font-bold text-white bg-[#C48D80] px-2 py-0.5 rounded-full'>
                    {isAr ? `وفري ${discountPercent}%` : `Save ${discountPercent}%`}
                  </span>
                </>
              ) : (
                <span className='font-serif text-3xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                  {product.price} {currency}
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
                <span>{isAr ? 'شحن سريع مجاني لجميع محافظات مصر للطلبات فوق 1,500 ج.م' : 'Free Express Delivery over 1,500 EGP across Egypt'}</span>
              </div>
              <div className='flex items-center gap-2'>
                <RotateCcw className='w-4 h-4 text-[#C48D80]' />
                <span>{isAr ? 'إرجاع واستبدال مجاني من باب منزلك خلال 14 يوماً' : '14-day hassle-free doorstep returns and exchanges'}</span>
              </div>
              <div className='flex items-center gap-2'>
                <ShieldCheck className='w-4 h-4 text-[#C48D80]' />
                <span>{isAr ? 'مختبر وآمن للبشرة الحساسة • 100% ألياف طبيعية ناعمة' : 'Certified Sensitive-Skin Safe • 100% Gentle Natural Fibers'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

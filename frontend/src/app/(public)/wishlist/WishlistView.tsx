'use client';

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import ProductCard from '@/_Components/shared/ProductCard/ProductCard';
import { IProduct } from '@/app/_interfaces/products';
import { useLanguage } from '@/context/LanguageContext';

export default function WishlistView({
  data,
  count,
}: {
  data: IProduct[];
  count: number;
}) {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  if (!data || data.length === 0) {
    return (
      <div dir={isRtl ? 'rtl' : 'ltr'} className='container py-16 sm:py-24 text-center'>
        <div className='max-w-md mx-auto p-8 rounded-2xl bg-white dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs space-y-4'>
          <div className='w-16 h-16 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E] mx-auto flex items-center justify-center text-[#C48D80]'>
            <Heart className='w-8 h-8' />
          </div>
          <h1 className='font-serif text-2xl sm:text-3xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
            {isAr ? 'قائمة المفضلة فارغة حالياً' : 'Your Favourites List is Empty'}
          </h1>
          <p className='text-xs sm:text-sm text-[#988172]'>
            {isAr
              ? 'احفظي فساتينك وتشكيلاتك المفضلة للبنات بالضغط على علامة القلب على أي منتج لتجديها هنا لاحقاً.'
              : 'Save your favorite girls’ dresses, knitwear, and celebration pieces by clicking the heart icon on any style.'}
          </p>
          <div className='pt-2'>
            <Link
              href='/products'
              className='inline-flex items-center px-6 py-3 rounded-full bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs'
            >
              {isAr ? 'استكشاف تشكيلة أزياء البنات' : "Explore Girls' Collection"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className='py-8 sm:py-12 bg-[#FBF9F3] dark:bg-[#1F1917] min-h-screen'>
      <div className='container'>
        <div className='mb-8 pb-4 border-b border-[#EBDED6] dark:border-[#3D332E]'>
          <span className='text-xs font-semibold tracking-widest uppercase text-[#C48D80]'>
            {isAr ? 'القطع المحفوظة' : 'Saved Items'}
          </span>
          <h1 className='font-serif text-3xl sm:text-4xl font-bold text-[#2B2320] dark:text-[#FAF6F0] mt-1'>
            {isAr ? `المفضلة (${count})` : `Favourites (${count})`}
          </h1>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {data.map((product: IProduct) => (
            <ProductCard from="wishlist" key={product.id || product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ProductsEmptyState() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className='py-20 text-center max-w-md mx-auto space-y-4'>
      <div className='w-16 h-16 rounded-full bg-[#FAF7F2] dark:bg-[#28211E] border border-[#EBDED6] dark:border-[#3D332E] mx-auto flex items-center justify-center text-[#C48D80]'>
        <Sparkles className='w-8 h-8' />
      </div>
      <h3 className='font-serif text-2xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
        {isAr ? 'لم يتم العثور على موديلات' : 'No styles found'}
      </h3>
      <p className='text-xs sm:text-sm text-[#988172]'>
        {isAr
          ? 'لم نتمكن من العثور على أزياء تطابق خيارات التصفية الحالية. جربي إعادة ضبط الفلاتر أو استكشاف أقسام أخرى.'
          : 'We couldn’t find any girls’ clothing items matching your current filters. Try resetting filters or exploring other categories.'}
      </p>
      <div className='pt-2'>
        <Link
          href='/products'
          className='inline-flex items-center px-6 py-2.5 rounded-full bg-[#C48D80] hover:bg-[#B27B6E] text-white text-xs font-semibold transition-colors shadow-xs'
        >
          {isAr ? 'عرض كل أزياء وتشكيلات البنات' : "View All Girls' Clothing"}
        </Link>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const CATEGORY_AR_NAMES: Record<string, string> = {
  'dresses': 'فساتين وأطقم خفيفة',
  'tops': 'بلوزات وتيشيرتات',
  'knitwear': 'صوف وتريكو',
  'coats': 'معاطف وجواكت',
  'sets': 'أطقم وتنسيقات',
  'nightwear': 'ملابس نوم وبيجامات',
  'occasions': 'مناسبات وسهرات',
  'all': 'جميع أزياء البنات',
  'new-in': 'وصل حديثاً',
  'sale': 'تخفيضات وعروض خاصة',
};

const AGE_AR_NAMES: Record<string, string> = {
  'baby': 'الرضع (0-2 سنة)',
  'younger': 'البنات الصغيرات (3-7 سنوات)',
  'older': 'البنات الكبار (8-16 سنة)',
  'teen': 'المراهقات واليافعات (13-16 سنة)',
};

interface ProductsHeaderProps {
  categorySlug?: string;
  categoryNameEn?: string;
  age?: string;
  search?: string;
  productCount: number;
}

export default function ProductsHeader({
  categorySlug,
  categoryNameEn,
  age,
  search,
  productCount,
}: ProductsHeaderProps) {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  let currentTitle = categoryNameEn || "All Girls' Clothing";
  if (isAr) {
    if (age && AGE_AR_NAMES[age.toLowerCase()]) {
      currentTitle = AGE_AR_NAMES[age.toLowerCase()];
    } else if (categorySlug && CATEGORY_AR_NAMES[categorySlug.toLowerCase()]) {
      currentTitle = CATEGORY_AR_NAMES[categorySlug.toLowerCase()];
    } else if (categoryNameEn) {
      currentTitle = CATEGORY_AR_NAMES[categoryNameEn.toLowerCase()] || categoryNameEn;
    } else {
      currentTitle = 'جميع أزياء وتشكيلات البنات';
    }
  }

  const Separator = isRtl ? ChevronLeft : ChevronRight;

  return (
    <>
      {/* Breadcrumbs */}
      <nav className='flex items-center gap-1.5 text-xs text-[#988172] mb-6'>
        <Link href='/' className='hover:text-[#2B2320] dark:hover:text-white transition-colors'>
          {isAr ? 'الرئيسية' : 'Home'}
        </Link>
        <Separator className='w-3 h-3 text-[#988172]/60' />
        <Link href='/products' className='hover:text-[#2B2320] dark:hover:text-white transition-colors'>
          {isAr ? 'أزياء البنات' : 'Girls'}
        </Link>
        <Separator className='w-3 h-3 text-[#988172]/60' />
        <span className='font-medium text-[#2B2320] dark:text-[#FAF6F0]'>
          {currentTitle}
        </span>
      </nav>

      {/* Department Page Header Banner */}
      <div
        data-aos='fade-up'
        className='mb-8 pb-4 border-b border-[#EBDED6] dark:border-[#3D332E] flex flex-col sm:flex-row sm:items-end justify-between gap-4'
      >
        <div>
          <div className='inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-[#C48D80] mb-1'>
            <Sparkles className='w-3 h-3' />
            <span>{isAr ? 'قسم أزياء البنات • رواروسا' : "ROAROSA Girls' Department"}</span>
          </div>
          <h1 className='font-serif text-3xl sm:text-4xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
            {search ? (
              <span>{isAr ? `نتائج البحث عن: «${search}»` : `Search: “${search}”`}</span>
            ) : (
              currentTitle
            )}
          </h1>
        </div>

        <p className='text-xs sm:text-sm text-[#988172]'>
          {isAr ? (
            <>
              عرض <strong className='text-[#2B2320] dark:text-white'>{productCount}</strong> موديل بالجنيه المصري
            </>
          ) : (
            <>
              Showing <strong className='text-[#2B2320] dark:text-white'>{productCount}</strong> styles in EGP
            </>
          )}
        </p>
      </div>
    </>
  );
}

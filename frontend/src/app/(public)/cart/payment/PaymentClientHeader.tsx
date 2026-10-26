'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';

export default function PaymentClientHeader() {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className='mb-8 pb-4 border-b border-[#EBDED6] dark:border-[#3D332E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
      <div>
        <span className='text-xs font-semibold tracking-widest uppercase text-[#C48D80] flex items-center gap-1.5'>
          <Sparkles className='w-3.5 h-3.5' />
          <span>{isAr ? 'الخطوة الأخيرة' : 'Final Step'}</span>
        </span>
        <h1 className='font-serif text-3xl sm:text-4xl font-bold text-[#2B2320] dark:text-[#FAF6F0] mt-1'>
          {isAr ? 'بيانات الشحن والفاتورة' : 'Billing & Shipping Details'}
        </h1>
      </div>

      <Link
        href='/cart'
        className='text-xs font-semibold text-[#988172] hover:text-[#C48D80] transition-colors flex items-center gap-1.5'
      >
        <span>{isAr ? 'العودة لحقيبة التسوق' : 'Back to Cart'}</span>
        {isRtl ? <ArrowRight className='w-3.5 h-3.5' /> : <ArrowLeft className='w-3.5 h-3.5' />}
      </Link>
    </div>
  );
}

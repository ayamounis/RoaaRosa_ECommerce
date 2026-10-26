'use client';

import React from 'react';
import ThemeToggle from '../../shared/ThemeToggle/ThemeToggle';
import LanguageToggle from '../../shared/LanguageToggle/LanguageToggle';
import Link from 'next/link';
import { Truck, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function TopHeader() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className='w-full bg-[#2B2320] text-[#FBF9F3] text-[11px] sm:text-[13px] border-b border-[#3D332E] z-50 relative'>
      <div className='container flex flex-col sm:flex-row items-center justify-between py-2 sm:py-2.5 gap-2'>
        <div className='flex items-center gap-2 text-center sm:text-start'>
          <Truck className='w-3.5 h-3.5 text-[#E5C2AF] hidden sm:inline' />
          <span>
            {isAr ? (
              <>
                <strong className='font-semibold text-[#E5C2AF]'>شحن سريع مجاني</strong> للطلبات التي تزيد عن 1,500 ج.م
              </>
            ) : (
              <>
                <strong className='font-semibold text-[#E5C2AF]'>Free Express Delivery</strong> on girls&apos; orders over 1,500 EGP
              </>
            )}
          </span>
          <span className='hidden md:inline text-white/40'>|</span>
          <Link
            href='/products?sort=-createdAt'
            className='hidden md:inline-flex text-[#E5C2AF] hover:text-white underline underline-offset-4 font-medium transition-colors'
          >
            {isAr ? 'اكتشفي وصل حديثاً' : 'Explore New In'}
          </Link>
        </div>

        <div className='flex items-center gap-4 text-xs text-[#EBDED6]'>
          <span className='flex items-center gap-1.5 font-medium bg-black/20 px-2 py-0.5 rounded border border-white/10'>
            <span>🇪🇬</span>
            <span>{isAr ? 'ج.م' : 'EGP'}</span>
          </span>
          <Link
            href='/products'
            className='hidden sm:flex items-center gap-1 hover:text-white transition-colors'
          >
            <HelpCircle className='w-3 h-3' />
            <span>{isAr ? 'المساعدة' : 'Customer Help'}</span>
          </Link>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

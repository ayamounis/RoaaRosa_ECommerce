'use client';

import React from 'react';
import ThemeToggle from '../../shared/ThemeToggle/ThemeToggle';
import LanguageToggle from '../../shared/LanguageToggle/LanguageToggle';
import Link from 'next/link';
import { Truck, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

function EgyptFlag({ className = 'w-4 h-3' }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 900 600'
      className={`${className} inline-block rounded-xs border border-white/20 shadow-2xs shrink-0 overflow-hidden`}
      aria-label='علم جمهورية مصر العربية'
      role='img'
    >
      {/* Top Red Stripe */}
      <rect width='900' height='200' fill='#CE1126' />
      {/* Middle White Stripe */}
      <rect y='200' width='900' height='200' fill='#FFFFFF' />
      {/* Bottom Black Stripe */}
      <rect y='400' width='900' height='200' fill='#000000' />
      {/* Eagle of Saladin (Gold Emblem) */}
      <g transform='translate(450, 300) scale(1.15)'>
        {/* Wings & Body */}
        <path
          d='M-18,-60 C-26,-42 -38,-20 -58,-10 C-46,15 -35,38 -20,60 C-10,50 10,50 20,60 C35,38 46,15 58,-10 C38,-20 26,-42 18,-60 Z'
          fill='#C69214'
          stroke='#8A6508'
          strokeWidth='2'
        />
        {/* Head */}
        <path
          d='M-7,-60 C-7,-72 7,-72 10,-60 C14,-62 16,-58 10,-55 Z'
          fill='#C69214'
          stroke='#8A6508'
          strokeWidth='1.5'
        />
        {/* Center Shield */}
        <path
          d='M-16,-22 L16,-22 L14,24 L0,32 L-14,24 Z'
          fill='#FFFFFF'
          stroke='#8A6508'
          strokeWidth='2.5'
        />
        {/* Shield vertical band */}
        <path d='M-5,-20 L5,-20 L4,25 L0,29 L-4,25 Z' fill='#C69214' />
        {/* Base scroll */}
        <path
          d='M-30,56 C-10,50 10,50 30,56 C25,62 -25,62 -30,56 Z'
          fill='#C69214'
          stroke='#8A6508'
          strokeWidth='1.5'
        />
      </g>
    </svg>
  );
}

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
          <span className='flex items-center gap-1.5 font-medium bg-black/20 px-2 py-0.5 rounded-sm border border-white/10'>
            <EgyptFlag className='w-4 h-2.5' />
            <span>{isAr ? 'ج.م' : 'EGP'}</span>
          </span>
          <Link
            href='/contact'
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

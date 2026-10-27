'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import ContactSection from '@/_Components/contact/ContactSection';

export default function ContactPage() {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#FBF9F3] dark:bg-[#1A1513] text-[#2B2320] dark:text-[#FAF6F0]">
      {/* Subtle Breadcrumb Navigation */}
      <div className="border-b border-[#EBDED6]/80 dark:border-[#3D332E]/80 bg-white/40 dark:bg-[#28211E]/40 backdrop-blur-xs">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 py-3.5">
          <nav className="flex items-center gap-2 text-xs text-[#988172]">
            <Link href="/" className="hover:text-[#C48D80] transition-colors">
              {isAr ? 'الرئيسية' : 'Home'}
            </Link>
            <ChevronIcon className="w-3.5 h-3.5 text-[#988172]/60" />
            <span className="font-semibold text-[#2B2320] dark:text-[#FAF6F0]">
              {isAr ? 'تواصل معنا' : 'Contact Us'}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Calm & Minimal Contact Flow */}
      <ContactSection />
    </div>
  );
}

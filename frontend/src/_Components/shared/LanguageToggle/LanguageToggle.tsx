'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageToggle({ className = '' }: { className?: string }) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 border cursor-pointer ${
        language === 'ar'
          ? 'bg-[#C48D80]/15 text-[#C48D80] border-[#C48D80]/30 hover:bg-[#C48D80]/25'
          : 'bg-white/10 text-white/90 border-white/20 hover:bg-white/20'
      } ${className}`}
      title={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
      aria-label='Toggle language'
    >
      <Globe className='w-3.5 h-3.5' />
      <span>{language === 'ar' ? 'English' : 'العربية'}</span>
    </button>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, ShieldCheck, ExternalLink, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSession } from 'next-auth/react';
import LanguageToggle from '@/_Components/shared/LanguageToggle/LanguageToggle';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  onOpenMobileSidebar: () => void;
}

export default function DashboardHeader({
  title,
  subtitle,
  onOpenMobileSidebar,
}: DashboardHeaderProps) {
  const { data: session } = useSession();
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  return (
    <header className="bg-white dark:bg-[#28211E] rounded-3xl p-4 sm:p-5 border border-[#EBDED6] dark:border-[#3D332E] shadow-2xs flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl border border-[#EBDED6] hover:bg-[#FAF7F2] text-[#2B2320] dark:text-[#FAF6F0]"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-[#2B2320] dark:text-[#FAF6F0]">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-[#988172] hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3.5">
        <LanguageToggle />

        {/* Admin profile chip */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] border border-[#EBDED6] dark:border-[#3D332E]">
          <div className="w-6 h-6 rounded-full bg-[#C48D80] text-white flex items-center justify-center text-[10px] font-bold">
            A
          </div>
          <span className="text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0] hidden md:inline">
            {session?.user?.name || (isAr ? 'مسؤول المتجر' : 'Admin')}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-md">
            ADMIN
          </span>
        </div>
      </div>
    </header>
  );
}

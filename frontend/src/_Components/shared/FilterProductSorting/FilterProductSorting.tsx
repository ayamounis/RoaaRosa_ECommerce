'use client';

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export interface FilterProductSortingProps {
  sortType: string | null;
  setSortType: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function FilterProductSorting({
  sortType,
  setSortType,
}: FilterProductSortingProps) {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const options = [
    { label: isAr ? "وصل حديثاً" : "New In", val: "-createdAt" },
    { label: isAr ? "السعر: الأقل للأعلى" : "Price: Low to High", val: "price" },
    { label: isAr ? "السعر: الأعلى للأقل" : "Price: High to Low", val: "-price" },
    { label: isAr ? "الأعلى تقييماً" : "Top Rated", val: "-ratingsAverage" },
  ];

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-semibold tracking-wider text-[#2B2320] dark:text-[#FAF6F0] uppercase'>
          {isAr ? "الترتيب حسب" : "Sort By"}
        </h3>
        {sortType != null && (
          <button
            type='button'
            onClick={() => setSortType(null)}
            className='text-xs text-[#C48D80] hover:underline cursor-pointer'
          >
            {isAr ? "إلغاء الترتيب" : "Clear Sort"}
          </button>
        )}
      </div>

      <div className='grid grid-cols-2 gap-1.5 pt-1'>
        {options.map((opt) => (
          <button
            type='button'
            key={opt.val}
            onClick={() => setSortType(sortType === opt.val ? null : opt.val)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-center transition-all cursor-pointer ${
              sortType === opt.val
                ? "bg-[#C48D80] text-white shadow-2xs"
                : "bg-[#F5EFEB] dark:bg-[#28211E] text-[#2B2320] dark:text-[#FAF6F0] hover:bg-[#EBDED6]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

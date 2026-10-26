'use client';

import { Slider } from "@/_Components/ui/slider";
import { useLanguage } from "@/context/LanguageContext";

export default function FilterByPriceRange({
  value,
  setValue,
}: {
  value: number[];
  setValue: (value: number[]) => void;
}) {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const currency = isAr ? 'ج.م' : 'EGP';

  return (
    <div className='space-y-2'>
      <h3 className='text-sm font-semibold tracking-wider text-[#2B2320] dark:text-[#FAF6F0] uppercase'>
        {isAr ? "نطاق السعر (ج.م)" : "Price (EGP)"}
      </h3>
      <div className='w-full space-y-3 pt-2'>
        <Slider
          value={value}
          onValueChange={setValue}
          min={400}
          max={3000}
          step={50}
        />
        <div className='flex justify-between text-xs text-[#988172] font-medium'>
          <span>{value[0]} {currency}</span>
          <span>{value[1]} {currency}</span>
        </div>
      </div>
    </div>
  );
}

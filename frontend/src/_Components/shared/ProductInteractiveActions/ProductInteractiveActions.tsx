'use client';

import { useState } from 'react';
import { Ruler, Check, X } from 'lucide-react';
import AddToCartBtn from '../AddToCartBtn/AddToCartBtn';
import AddToWishlistBtn from '../AddToWishlistBtn/AddToWishlistBtn';
import { useLanguage } from '@/context/LanguageContext';

interface ProductInteractiveActionsProps {
  productId: string;
  swatches?: { name: string; hex: string }[];
}

const SWATCH_AR_NAMES: Record<string, string> = {
  'Dusty Rose': 'وردي مغبر',
  'Warm Nude': 'بيج دافئ',
  'Taupe': 'رمادي داكن',
  'Cream': 'كريمي',
  'Sage Green': 'أخضر هادئ',
  'Soft Ivory': 'عاجي ناعم',
  'Blush Pink': 'وردي فاتح',
  'Oatmeal': 'شوفان طبيعي',
};

export default function ProductInteractiveActions({ productId, swatches }: ProductInteractiveActionsProps) {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  const sizes = isAr
    ? ['2-3 سنوات', '4-5 سنوات', '6-7 سنوات', '8-9 سنوات', '10-12 سنة']
    : ['2-3 Yrs', '4-5 Yrs', '6-7 Yrs', '8-9 Yrs', '10-12 Yrs'];

  const [selectedSize, setSelectedSize] = useState(sizes[1]);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const defaultSwatches = [
    { name: 'Dusty Rose', hex: '#C48D80' },
    { name: 'Warm Nude', hex: '#E5C2AF' },
    { name: 'Taupe', hex: '#988172' },
    { name: 'Cream', hex: '#FBF9F3' },
  ];
  const listSwatches = swatches && swatches.length > 0 ? swatches : defaultSwatches;
  const [selectedSwatchIdx, setSelectedSwatchIdx] = useState(0);

  const currentSwatch = listSwatches[selectedSwatchIdx];
  const swatchName = isAr
    ? SWATCH_AR_NAMES[currentSwatch?.name] || currentSwatch?.name
    : currentSwatch?.name;

  return (
    <div className='space-y-5'>
      {/* Color Swatch Selection */}
      <div className='space-y-2'>
        <div className='flex items-center justify-between text-xs font-semibold'>
          <span className='text-[#2B2320] dark:text-[#FAF6F0] uppercase tracking-wider'>
            {isAr ? 'اللون:' : 'Color:'} <span className='font-normal text-[#C48D80]'>{swatchName}</span>
          </span>
        </div>
        <div className='flex items-center gap-2'>
          {listSwatches.map((swatch, idx) => (
            <button
              key={idx}
              type='button'
              onClick={() => setSelectedSwatchIdx(idx)}
              title={isAr ? SWATCH_AR_NAMES[swatch.name] || swatch.name : swatch.name}
              style={{ backgroundColor: swatch.hex }}
              className={`size-7 rounded-full border border-black/20 shadow-2xs relative transition-transform cursor-pointer ${
                selectedSwatchIdx === idx ? 'scale-115 ring-2 ring-offset-2 ring-[#C48D80]' : 'hover:scale-105'
              }`}
            >
              {selectedSwatchIdx === idx && (
                <Check className={`w-3.5 h-3.5 mx-auto ${swatch.hex === '#FBF9F3' ? 'text-black' : 'text-white'}`} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selector */}
      <div className='space-y-2.5'>
        <div className='flex items-center justify-between text-xs'>
          <span className='font-semibold text-[#2B2320] dark:text-[#FAF6F0] uppercase tracking-wider'>
            {isAr ? 'اختاري العمر / المقاس:' : 'Select Age / Size:'}
          </span>
          <button
            type='button'
            onClick={() => setIsSizeGuideOpen(true)}
            className='flex items-center gap-1 text-[#988172] hover:text-[#C48D80] hover:underline cursor-pointer'
          >
            <Ruler className='w-3.5 h-3.5' />
            <span>{isAr ? 'دليل المقاسات' : 'Size Guide'}</span>
          </button>
        </div>
        <div className='flex flex-wrap gap-2'>
          {sizes.map((size) => (
            <button
              type='button'
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                selectedSize === size
                  ? 'border-[#C48D80] bg-[#C48D80]/15 text-[#C48D80] font-bold shadow-2xs'
                  : 'border-[#EBDED6] dark:border-[#3D332E] bg-white dark:bg-[#28211E] text-[#2B2320] dark:text-[#FAF6F0] hover:border-[#C48D80]'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Add to Bag and Wishlist */}
      <div className='flex items-center gap-3 pt-2'>
        <div className='flex-1'>
          <AddToCartBtn id={productId} from='productDetails' />
        </div>
        <div className='p-3.5 rounded-full border border-[#EBDED6] dark:border-[#3D332E] bg-white dark:bg-[#28211E] shadow-2xs hover:border-[#C48D80] transition-colors'>
          <AddToWishlistBtn productId={productId} />
        </div>
      </div>

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200'
          onClick={() => setIsSizeGuideOpen(false)}
        >
          <div
            dir={isRtl ? 'rtl' : 'ltr'}
            className='relative w-full max-w-md bg-white dark:bg-[#28211E] rounded-3xl p-6 shadow-2xl border border-[#EBDED6] dark:border-[#3D332E] space-y-4'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              aria-label={isAr ? 'إغلاق' : 'Close'}
              className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} size-8 rounded-full bg-[#FAF7F2] dark:bg-[#1F1917] text-[#2B2320] dark:text-white flex items-center justify-center hover:bg-[#C48D80] hover:text-white transition-colors cursor-pointer`}
            >
              <X className='w-4 h-4' />
            </button>

            <h3 className='font-serif text-xl font-bold text-[#2B2320] dark:text-white'>
              {isAr ? 'دليل مقاسات البنات • رواروسا' : 'ROAROSA Girls Size Guide'}
            </h3>

            <div className='overflow-x-auto text-xs'>
              <table className='w-full text-left border-collapse'>
                <thead>
                  <tr className='border-b border-[#EBDED6] dark:border-[#3D332E] text-[#988172]'>
                    <th className='py-2 font-semibold'>{isAr ? 'العمر' : 'Age'}</th>
                    <th className='py-2 font-semibold'>{isAr ? 'الطول (سم)' : 'Height (cm)'}</th>
                    <th className='py-2 font-semibold'>{isAr ? 'محيط الصدر (سم)' : 'Chest (cm)'}</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-[#EBDED6]/50 dark:divide-[#3D332E]/50 text-[#2B2320] dark:text-[#FAF6F0]'>
                  <tr><td className='py-2'>{isAr ? '2-3 سنوات' : '2-3 Yrs'}</td><td className='py-2'>92 - 98 cm</td><td className='py-2'>54 cm</td></tr>
                  <tr><td className='py-2'>{isAr ? '4-5 سنوات' : '4-5 Yrs'}</td><td className='py-2'>104 - 110 cm</td><td className='py-2'>58 cm</td></tr>
                  <tr><td className='py-2'>{isAr ? '6-7 سنوات' : '6-7 Yrs'}</td><td className='py-2'>116 - 122 cm</td><td className='py-2'>62 cm</td></tr>
                  <tr><td className='py-2'>{isAr ? '8-9 سنوات' : '8-9 Yrs'}</td><td className='py-2'>128 - 134 cm</td><td className='py-2'>66 cm</td></tr>
                  <tr><td className='py-2'>{isAr ? '10-12 سنة' : '10-12 Yrs'}</td><td className='py-2'>140 - 152 cm</td><td className='py-2'>72 cm</td></tr>
                </tbody>
              </table>
            </div>

            <p className='text-[11px] text-[#988172] leading-relaxed pt-2 border-t border-[#EBDED6] dark:border-[#3D332E]'>
              {isAr
                ? 'نصيحة: إذا كان مقاس طفلتك بين مقاسين، نوصي باختيار المقاس الأكبر. جميع القطع مصممة بحساب التوسيع والراحة، مع استبدال مجاني للمقاس خلال 14 يوماً في مصر.'
                : 'Tip: If your daughter is between sizes, we recommend ordering one size up. All items feature generous ease allowances and 14-day free doorstep exchanges in Egypt.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

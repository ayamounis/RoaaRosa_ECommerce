'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Sparkles, Truck, Check } from 'lucide-react';
import { IProduct } from '@/app/_interfaces/products';
import { ProductCardProps } from '../ProductCard/ProductCard.types';
import AddToCartBtn from '../AddToCartBtn/AddToCartBtn';
import AddToWishlistBtn from '../AddToWishlistBtn/AddToWishlistBtn';
import Stars from '../Stars/Stars';
import { useLanguage } from '@/context/LanguageContext';

interface QuickViewModalProps {
  product: ProductCardProps | IProduct | null;
  isOpen: boolean;
  onClose: () => void;
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

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { language, isRtl } = useLanguage();
  const isAr = language === 'ar';

  const [selectedSize, setSelectedSize] = useState('4-5 Yrs');
  const [selectedSwatchIdx, setSelectedSwatchIdx] = useState(0);

  if (!isOpen || !product) return null;

  const productId = product.id || product._id || '';
  const discount = product.priceAfterDiscount
    ? Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)
    : 0;

  const defaultSwatches = [
    { name: 'Dusty Rose', hex: '#C48D80' },
    { name: 'Warm Nude', hex: '#E5C2AF' },
    { name: 'Taupe', hex: '#988172' },
    { name: 'Cream', hex: '#FBF9F3' },
  ];
  const swatches =
    'swatches' in product && Array.isArray((product as { swatches?: unknown }).swatches)
      ? (product as { swatches: { name: string; hex: string }[] }).swatches
      : defaultSwatches;
  const activeSwatch = swatches[selectedSwatchIdx] || swatches[0];
  const activeSwatchName = isAr
    ? SWATCH_AR_NAMES[activeSwatch.name] || activeSwatch.name
    : activeSwatch.name;

  const sizes = isAr
    ? ['2-3 سنوات', '4-5 سنوات', '6-7 سنوات', '8-9 سنوات', '10-12 سنة']
    : ['2-3 Yrs', '4-5 Yrs', '6-7 Yrs', '8-9 Yrs', '10-12 Yrs'];

  const currencyLabel = isAr ? 'ج.م' : 'EGP';

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200'>
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className='relative w-full max-w-3xl bg-white dark:bg-[#28211E] rounded-3xl overflow-hidden shadow-2xl border border-[#EBDED6] dark:border-[#3D332E] max-h-[90vh] flex flex-col md:flex-row'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label={isAr ? 'إغلاق' : 'Close Quick View'}
          className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} z-20 size-8 rounded-full bg-white/90 dark:bg-[#1F1917]/90 text-[#2B2320] dark:text-white flex items-center justify-center shadow-md hover:bg-[#C48D80] hover:text-white transition-colors cursor-pointer`}
        >
          <X className='w-4 h-4' />
        </button>

        {/* Left Column: Image */}
        <div className='relative w-full md:w-1/2 min-h-[300px] md:min-h-[460px] bg-[#FAF7F2] dark:bg-[#1F1917]'>
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            sizes='(max-width: 768px) 100vw, 50vw'
            className='object-cover object-top'
          />
          {discount > 0 && (
            <span className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'} text-xs font-bold bg-[#C48D80] text-white py-1 px-3 rounded-full shadow-xs`}>
              {isAr ? `وفري ${discount}%` : `Save ${discount}%`}
            </span>
          )}
        </div>

        {/* Right Column: Details & Selection */}
        <div className='w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-4'>
          <div>
            <div className='inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-[#C48D80] mb-1'>
              <Sparkles className='w-3 h-3' />
              <span>{isAr ? 'رواروسا للبنات' : 'ROAROSA Girls'}</span>
            </div>
            <h3 className='font-serif text-xl sm:text-2xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
              {product.title}
            </h3>

            {/* Rating */}
            {product.ratingsAverage !== undefined && (
              <div className='flex items-center gap-2 mt-2 text-xs'>
                <Stars ratingsAverage={product.ratingsAverage} />
                <span className='text-[#988172]'>
                  ({product.ratingsQuantity ?? 48} {isAr ? 'تقييم' : 'reviews'})
                </span>
              </div>
            )}

            {/* Price */}
            <div className='flex items-baseline gap-3 my-3'>
              {product.priceAfterDiscount ? (
                <>
                  <span className='font-serif text-2xl font-bold text-[#C48D80]'>
                    {product.priceAfterDiscount} {currencyLabel}
                  </span>
                  <span className='text-sm line-through text-[#988172]'>
                    {product.price} {currencyLabel}
                  </span>
                </>
              ) : (
                <span className='font-serif text-2xl font-bold text-[#2B2320] dark:text-[#FAF6F0]'>
                  {product.price} {currencyLabel}
                </span>
              )}
            </div>

            {/* Color Swatches */}
            <div className='space-y-1.5 py-1'>
              <div className='text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0]'>
                {isAr ? 'اللون:' : 'Color:'} <span className='font-normal text-[#C48D80]'>{activeSwatchName}</span>
              </div>
              <div className='flex items-center gap-2'>
                {swatches.map((swatch, idx) => (
                  <button
                    key={idx}
                    type='button'
                    title={isAr ? SWATCH_AR_NAMES[swatch.name] || swatch.name : swatch.name}
                    onClick={() => setSelectedSwatchIdx(idx)}
                    style={{ backgroundColor: swatch.hex }}
                    className={`size-6 rounded-full border border-black/20 shadow-2xs relative transition-transform cursor-pointer ${
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
            <div className='space-y-1.5 py-2'>
              <div className='text-xs font-semibold text-[#2B2320] dark:text-[#FAF6F0]'>
                {isAr ? 'اختاري المقاس / العمر:' : 'Select Size:'}
              </div>
              <div className='flex flex-wrap gap-2'>
                {sizes.map((size) => (
                  <button
                    key={size}
                    type='button'
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'border-[#C48D80] bg-[#C48D80]/15 text-[#C48D80] font-semibold'
                        : 'border-[#EBDED6] dark:border-[#3D332E] text-[#2B2320] dark:text-[#FAF6F0] hover:border-[#C48D80]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='space-y-3 pt-2 border-t border-[#EBDED6] dark:border-[#3D332E]'>
            <div className='flex items-center gap-2'>
              <div className='flex-1'>
                <AddToCartBtn id={productId} from='productDetails' />
              </div>
              <div className='p-3.5 rounded-full border border-[#EBDED6] dark:border-[#3D332E] bg-white dark:bg-[#1F1917] shadow-2xs hover:border-[#C48D80] transition-colors'>
                <AddToWishlistBtn productId={productId} />
              </div>
            </div>

            <div className='flex items-center justify-between text-[11px] text-[#988172] pt-1'>
              <div className='flex items-center gap-1.5'>
                <Truck className='w-3.5 h-3.5 text-[#C48D80]' />
                <span>{isAr ? 'شحن فوري لجميع محافظات مصر' : 'Express Egypt Delivery'}</span>
              </div>
              <Link
                href={`/productDetails/${productId}`}
                onClick={onClose}
                className='font-semibold text-[#C48D80] hover:underline'
              >
                {isAr ? 'كامل تفاصيل المنتج ←' : 'Full Product Details →'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
